# -*- coding: utf-8 -*-
"""
DeBERTa-v3 Debate Evaluation Model
====================================
Standalone Python script for preprocessing debate data and setting up
the DeBERTa-v3 multi-output regression scoring pipeline.

Usage:
    python model.py

Requirements (install manually if not present):
    pip install pandas numpy torch transformers datasets scikit-learn accelerate
"""

import os
import glob
import json

# ── Path Setup ──────────────────────────────────────────────────────────────
# All paths are relative to this file's directory so the script works
# regardless of where it is launched from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODELS_DIR = os.path.join(BASE_DIR, 'models', 'deberta-v3-debate')
SRC_DIR = os.path.join(BASE_DIR, 'src')

# Required debate score labels
REQUIRED_LABELS = [
    'logical_reasoning', 'argument_strength', 'relevance',
    'evidence', 'rebuttal', 'counterargument', 'clarity'
]

HYPERPARAMETERS = {
    'learning_rate': 2e-5,
    'train_batch_size': 4,
    'eval_batch_size': 4,
    'epochs': 3,
    'weight_decay': 0.01,
    'max_length': 512,
    'random_seed': 42,
}


# ── Optional heavy imports ───────────────────────────────────────────────────
try:
    import pandas as pd
    import numpy as np
    PANDAS_AVAILABLE = True
except ImportError:
    print("WARNING: pandas/numpy not installed. Run: pip install pandas numpy")
    PANDAS_AVAILABLE = False


# ── Section 1: Setup Directory Structure ────────────────────────────────────
def setup_directories():
    dirs = [
        os.path.join(DATA_DIR, 'raw'),
        os.path.join(DATA_DIR, 'processed'),
        os.path.join(DATA_DIR, 'final'),
        MODELS_DIR,
        SRC_DIR,
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"Created directory: {d}")
    print("Directory structure created successfully.")


# ── Section 2: Check GPU Availability ───────────────────────────────────────
def check_gpu():
    try:
        import torch
        available = torch.cuda.is_available()
        print(f"GPU available: {available}")
        if available:
            print(f"GPU name: {torch.cuda.get_device_name(0)}")
            print(f"CUDA version: {torch.version.cuda}")
        else:
            print("No GPU found. Training will run on CPU, which might be slow.")
        return torch
    except ImportError:
        print("WARNING: PyTorch not installed. Run: pip install torch")
        return None


# ── Section 3: Locate and Inspect Dataset ───────────────────────────────────
def locate_and_inspect_dataset():
    if not PANDAS_AVAILABLE:
        print("Skipping dataset inspection: pandas not available.")
        return None, None

    search_patterns = [
        os.path.join(BASE_DIR, '*.csv'),
        os.path.join(DATA_DIR, '*.csv'),
        os.path.join(DATA_DIR, 'raw', '*.csv'),
    ]
    csv_files = []
    for pattern in search_patterns:
        csv_files.extend(glob.glob(pattern))

    if not csv_files:
        print("No CSV files found. Place your dataset in the 'data/raw/' folder.")
        return None, None

    print(f"Found {len(csv_files)} CSV file(s):")
    for f in csv_files:
        print(f"  - {f}")

    all_dfs = {}
    for file_path in csv_files:
        try:
            df = pd.read_csv(file_path, on_bad_lines='skip', engine='python', encoding='utf-8')
            all_dfs[file_path] = df
            print(f"\n--- Inspecting: {os.path.basename(file_path)} ---")
            print(f"  Rows: {df.shape[0]} | Columns: {df.shape[1]}")
            print(f"  Columns: {df.columns.tolist()}")
            print(f"  Missing values:\n{df.isnull().sum()}")
            print(f"  Duplicates: {df.duplicated().sum()}")
            print(f"  First 5 rows:\n{df.head().to_string()}")

            print("\n  Sample Values:")
            for col in df.columns:
                if df[col].dtype == 'object' or df[col].nunique() <= 5:
                    unique_vals = df[col].unique()
                    print(f"    {col}: {unique_vals[:5]}")
                else:
                    print(f"    {col}: {df[col].sample(min(5, len(df))).tolist()}")
        except Exception as e:
            print(f"  Error reading {file_path}: {e}")

    # Identify the main dataset by looking for key columns
    main_dataset_path = None
    potential_debate_columns = [
        'topic', 'opponent_argument', 'response', 'argument',
        'text', 'statement', 'claim', 'essay_text_demoid', 'full_text'
    ]
    for path, df in all_dfs.items():
        for col in potential_debate_columns:
            if col in df.columns:
                print(f"\n--- Identified main dataset: {path} (contains '{col}') ---")
                main_dataset_path = path
                break
        if main_dataset_path:
            break

    if not main_dataset_path:
        print("\nCould not identify main dataset. Please upload a valid CSV.")
        return None, None

    df_main = all_dfs[main_dataset_path]

    # Check for required labels
    missing_labels = [l for l in REQUIRED_LABELS if l not in df_main.columns]
    print("\n--- CHECKING REQUIRED DEBATE LABELS ---")
    if not missing_labels:
        print("SUCCESS: All seven required labels found!")
    else:
        print(f"Missing labels: {missing_labels}")
        _generate_annotation_template(df_main)

    return main_dataset_path, df_main


def _generate_annotation_template(df_main):
    """Generate a CSV annotation template pre-populated with available text."""
    template_cols = [
        'topic', 'opponent_argument', 'response',
        'logical_reasoning', 'argument_strength', 'relevance',
        'evidence', 'rebuttal', 'counterargument', 'clarity'
    ]
    template_df = pd.DataFrame(columns=template_cols)
    text_col = next(
        (c for c in ['full_text', 'essay_text_demoid', 'text', 'essay'] if c in df_main.columns),
        None
    )
    if text_col:
        template_df['response'] = df_main[text_col].head(50).values
        print(f"Pre-populated 'response' column from '{text_col}'.")

    template_path = os.path.join(BASE_DIR, 'debate_scoring_annotation_template.csv')
    template_df.to_csv(template_path, index=False)
    print(f"Saved annotation template to: {template_path}")


# ── Section 4: Validate Labels ──────────────────────────────────────────────
def validate_labels(df_main):
    has_labels = df_main is not None and all(l in df_main.columns for l in REQUIRED_LABELS)
    if has_labels:
        print("TRAINING STRATEGY: CASE A — Supervised learning with all 7 labels present.")
    else:
        print("TRAINING STRATEGY: CASE B — Labels missing. Annotation template generated.")
    return has_labels


# ── Section 5: Data Preprocessing Pipeline ──────────────────────────────────
def preprocess_data(df, target_labels=None):
    """Clean and prepare the dataframe for training."""
    df_cleaned = df.dropna(how='all').copy()

    # Map PERSUADE text column → response
    if 'full_text' in df_cleaned.columns and 'response' not in df_cleaned.columns:
        df_cleaned['response'] = df_cleaned['full_text']

    # Normalize text columns
    text_cols = [c for c in ['topic', 'opponent_argument', 'response'] if c in df_cleaned.columns]
    for c in text_cols:
        df_cleaned[c] = df_cleaned[c].astype(str).str.strip().str.replace(r'\s+', ' ', regex=True)

    # Fill missing context fields
    for field in ['topic', 'opponent_argument']:
        if field not in df_cleaned.columns:
            df_cleaned[field] = 'Not Provided'

    # Drop duplicate responses
    if 'response' in df_cleaned.columns:
        df_cleaned = df_cleaned.drop_duplicates(subset=['response'])

    # Build unified input text
    df_cleaned['text'] = (
        'Topic: ' + df_cleaned['topic'] + '\n\n' +
        'Opponent Argument: ' + df_cleaned['opponent_argument'] + '\n\n' +
        'User Response: ' + df_cleaned['response']
    )

    # Validate label ranges (Case A only)
    if target_labels and all(l in df_cleaned.columns for l in target_labels):
        for l in target_labels:
            df_cleaned[l] = pd.to_numeric(df_cleaned[l], errors='coerce')
            df_cleaned = df_cleaned[(df_cleaned[l] >= 0) & (df_cleaned[l] <= 10)]

    return df_cleaned


# ── Section 6: Train/Val/Test Split ─────────────────────────────────────────
def split_data(df_processed):
    try:
        from sklearn.model_selection import train_test_split
    except ImportError:
        print("WARNING: scikit-learn not installed. Run: pip install scikit-learn")
        return None, None, None

    train_df, temp_df = train_test_split(df_processed, test_size=0.2, random_state=42)
    val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=42)
    print(f"Training samples  : {len(train_df)}")
    print(f"Validation samples: {len(val_df)}")
    print(f"Test samples      : {len(test_df)}")
    return train_df, val_df, test_df


# ── Section 7: Tokenization & Model Init ────────────────────────────────────
def init_model():
    model_name = 'microsoft/deberta-v3-base'
    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        print("Tokenizer loaded successfully.")
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name,
            num_labels=7,
            problem_type='regression'
        )
        print("DeBERTa-v3 multi-output regression model initialized.")
        return tokenizer, model
    except ImportError:
        print("WARNING: transformers not installed. Run: pip install transformers accelerate")
        return None, None
    except Exception as e:
        print(f"ERROR loading model: {e}")
        return None, None


# ── Section 8: Save Config & Prediction Script ───────────────────────────────
def save_model_config(df_processed=None, train_df=None, val_df=None, test_df=None):
    """Write model_info.json and src/predict.py to the model directory."""
    model_info = {
        'model_name': 'DeBERTa-v3 Debate Evaluation Model',
        'base_model': 'microsoft/deberta-v3-base',
        'number_of_outputs': 7,
        'label_names': [
            'logical_reasoning', 'argument_strength', 'relevance',
            'evidence', 'rebuttal', 'counterargument', 'clarity'
        ],
        'max_length': HYPERPARAMETERS['max_length'],
        'training_epochs': HYPERPARAMETERS['epochs'],
        'learning_rate': HYPERPARAMETERS['learning_rate'],
        'batch_size': HYPERPARAMETERS['train_batch_size'],
        'random_seed': HYPERPARAMETERS['random_seed'],
        'dataset_size': len(df_processed) if df_processed is not None else 0,
        'training_size': len(train_df) if train_df is not None else 0,
        'validation_size': len(val_df) if val_df is not None else 0,
        'test_size': len(test_df) if test_df is not None else 0,
        'evaluation_metrics': 'Pending human label annotation (Case B)',
    }

    config_path = os.path.join(BASE_DIR, 'model_info.json')
    with open(config_path, 'w') as f:
        json.dump(model_info, f, indent=4)
    print(f"Saved model_info.json to: {config_path}")

    # Write predict.py with absolute path resolution
    predict_script = (
        'import os\n'
        'import numpy as np\n'
        '\n'
        'MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), \'..\', \'models\', \'deberta-v3-debate\')\n'
        'LABEL_NAMES = [\n'
        '    \'logical_reasoning\', \'argument_strength\', \'relevance\',\n'
        '    \'evidence\', \'rebuttal\', \'counterargument\', \'clarity\'\n'
        ']\n'
        '\n'
        '_tokenizer = None\n'
        '_model = None\n'
        '\n'
        'def _load_model():\n'
        '    global _tokenizer, _model\n'
        '    if _tokenizer is not None:\n'
        '        return True\n'
        '    try:\n'
        '        import torch\n'
        '        from transformers import AutoTokenizer, AutoModelForSequenceClassification\n'
        '        _tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)\n'
        '        _model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)\n'
        '        _model.eval()\n'
        '        print("Debate scoring model loaded.")\n'
        '        return True\n'
        '    except Exception as e:\n'
        '        print(f"Could not load model: {e}")\n'
        '        return False\n'
        '\n'
        'def analyze_debate(topic, opponent_argument, response):\n'
        '    """Score a debate response across 7 dimensions."""\n'
        '    if not _load_model():\n'
        '        return _rule_based_fallback(response)\n'
        '    import torch\n'
        '    input_text = f"Topic: {topic}\\n\\nOpponent Argument: {opponent_argument}\\n\\nUser Response: {response}"\n'
        '    try:\n'
        '        inputs = _tokenizer(input_text, return_tensors=\'pt\', max_length=512, truncation=True, padding=True)\n'
        '        with torch.no_grad():\n'
        '            outputs = _model(**inputs)\n'
        '        predictions = outputs.logits.squeeze().cpu().numpy()\n'
        '        clipped = np.clip(predictions, 0.0, 10.0)\n'
        '        result = {LABEL_NAMES[i]: float(clipped[i]) for i in range(len(LABEL_NAMES))}\n'
        '        result[\'overall_score\'] = float(np.mean(clipped))\n'
        '        return result\n'
        '    except Exception as e:\n'
        '        return {"error": str(e), "status": "prediction_failed"}\n'
        '\n'
        'def _rule_based_fallback(response):\n'
        '    """Heuristic scorer when model weights are unavailable."""\n'
        '    words = response.split()\n'
        '    base = min(10.0, len(words) / 20.0) * 0.7 + 3.0\n'
        '    scores = {label: round(base, 2) for label in LABEL_NAMES}\n'
        '    scores[\'overall_score\'] = round(base, 2)\n'
        '    scores[\'note\'] = \'Fallback rule-based score — load trained model for accuracy\'\n'
        '    return scores\n'
    )

    predict_path = os.path.join(SRC_DIR, 'predict.py')
    with open(predict_path, 'w') as f:
        f.write(predict_script)
    print(f"Saved src/predict.py to: {predict_path}")


# ── Main Entrypoint ──────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  DeBERTa-v3 Debate Evaluation — Setup & Preprocessing")
    print("=" * 60)

    # 1. Directories
    setup_directories()

    # 2. GPU check
    check_gpu()

    # 3. Locate dataset
    main_dataset_path, df_main = locate_and_inspect_dataset()

    # 4. Validate labels
    has_labels = validate_labels(df_main) if df_main is not None else False

    # 5. Preprocess
    df_processed = None
    if df_main is not None:
        df_processed = preprocess_data(df_main, REQUIRED_LABELS if has_labels else None)
        print(f"Preprocessed records: {len(df_processed)}")

        # Save annotation template based on processed data
        template_cols = [
            'topic', 'opponent_argument', 'response',
            'logical_reasoning', 'argument_strength', 'relevance',
            'evidence', 'rebuttal', 'counterargument', 'clarity'
        ]
        tmpl = pd.DataFrame(columns=template_cols)
        if 'response' in df_processed.columns:
            tmpl['response'] = df_processed['response'].head(50).values
        tmpl['topic'] = 'Provide Debate Topic'
        tmpl['opponent_argument'] = 'Provide Opponent Argument'
        tmpl.to_csv(os.path.join(BASE_DIR, 'debate_scoring_annotation_template.csv'), index=False)
        print("Saved 50-record annotation template.")
    else:
        print("No dataset available to preprocess.")

    # 6. Split (Case A only)
    train_df = val_df = test_df = None
    if df_processed is not None and has_labels:
        train_df, val_df, test_df = split_data(df_processed)

    # 7. Model init (Case A only)
    if has_labels:
        init_model()
        print("Hyperparameters:", HYPERPARAMETERS)
    else:
        print("\nCASE B: Training halted — annotate the template CSV and re-run.")

    # 8. Save config & predict.py
    save_model_config(df_processed, train_df, val_df, test_df)

    # 9. Final report
    print("\n=== FINAL REPORT ===")
    print(f"Dataset Path     : {main_dataset_path or 'Not found'}")
    print(f"Labels Status    : {'Complete' if has_labels else 'Missing — annotation template generated'}")
    print(f"Processed Records: {len(df_processed) if df_processed is not None else 0}")
    print(f"Template Location: {os.path.join(BASE_DIR, 'debate_scoring_annotation_template.csv')}")
    print(f"Model Config     : {os.path.join(BASE_DIR, 'model_info.json')}")
    print(f"Predict Script   : {os.path.join(SRC_DIR, 'predict.py')}")


if __name__ == '__main__':
    main()