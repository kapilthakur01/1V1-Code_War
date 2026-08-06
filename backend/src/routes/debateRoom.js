const router = require('express').Router();
const { auth } = require('../middleware/auth');
const {
  createRoom,
  joinRoom,
  getRoom,
} = require('../controllers/debateRoomController');

router.post('/create', auth, createRoom);
router.post('/join', auth, joinRoom);
router.get('/:code', auth, getRoom);

module.exports = router;
