const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { runCode, submitCode } = require('../controllers/submissionsController');

router.post('/run', auth, runCode);
router.post('/submit', auth, submitCode);

module.exports = router;
