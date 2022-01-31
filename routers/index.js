const express = require('express')
const router = express.Router();
const ctrMatches = require('../controllers/matches.controllers');

router.get('/', ctrMatches.getMatches);
router.get('/:match_id/:inn', ctrMatches.getMatchById);
module.exports = router;