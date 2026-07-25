const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const {
  getAllProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/adminController');

router.get('/problems', adminAuth, getAllProblems);
router.post('/problems', adminAuth, createProblem);
router.put('/problems/:id', adminAuth, updateProblem);
router.delete('/problems/:id', adminAuth, deleteProblem);

module.exports = router;
