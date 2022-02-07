const express = require('express')
const router = express.Router();
const ctrPlayer = require('../controllers/player.controllers');

router.get('/:player_id', ctrPlayer.getPlayer);
router.get('/:player_id/batdetails', ctrPlayer.getPlayerDetails);
router.get('/:player_id/batgraphinfo', ctrPlayer.getPlayerInformationInGraph);
router.get('/:player_id/bowldetails', ctrPlayer.getBowlingDetails);
router.get('/:player_id/bowlgraphinfo', ctrPlayer.getBowlingInformationInGraph);
module.exports = router;