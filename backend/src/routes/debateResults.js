const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getResult, getCoachData } = require('../controllers/debateResultsController');

router.get('/coach', auth, getCoachData);
router.get('/:debateId', auth, getResult);

module.exports = router;
