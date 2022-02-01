const express = require('express')
const router = express.Router();
const ctrVenue = require('../controllers/player.controllers');

router.get('/:player_id', ctrVenue.getPlayer);
module.exports = router;