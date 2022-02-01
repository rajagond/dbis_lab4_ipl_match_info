const express = require('express')
const router = express.Router();
const ctrMatches = require('../controllers/matches.controllers');

router.get('/', ctrMatches.getMatches);
router.get('/ET/:match_id/:inn', ctrMatches.getETByMatch_Id);
router.get('/batsman/:match_id/:inn', ctrMatches.getbatsmanByMatch_Id);
router.get('/bowler/:match_id/:inn', ctrMatches.getbowlerByMatch_Id);
router.get('/match_info/:match_id/:inn', ctrMatches.getInningsInfo);
router.get('/match_info/:match_id', ctrMatches.getMatchInfo);
router.get('/cumulative_run/:match_id', ctrMatches.getCumulativeRunByMatch_Id);
module.exports = router;