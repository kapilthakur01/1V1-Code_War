const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { findMatch, cancelSearch, createPrivateRoom, joinPrivateRoom } = require('../controllers/matchController');

router.post('/find', auth, findMatch);
router.post('/cancel', auth, cancelSearch);
router.post('/create-private', auth, createPrivateRoom);
router.post('/join-private', auth, joinPrivateRoom);

module.exports = router;
