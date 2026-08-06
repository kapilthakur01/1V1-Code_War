const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  createDebate,
  getDebate,
  sendMessage,
  endDebate,
  getDebateHistory,
} = require('../controllers/debateController');

router.post('/create', auth, createDebate);
router.get('/history', auth, getDebateHistory);
router.get('/:id', auth, getDebate);
router.post('/:id/message', auth, sendMessage);
router.post('/:id/end', auth, endDebate);

module.exports = router;
