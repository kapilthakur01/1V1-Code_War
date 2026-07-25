const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getRandomProblem, getProblemById } = require('../controllers/problemsController');

router.get('/random', auth, getRandomProblem);
router.get('/:id', auth, getProblemById);

module.exports = router;
