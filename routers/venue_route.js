const express = require('express')
const router = express.Router();
const ctrVenue = require('../controllers/venue.controllers');

router.get('/', ctrVenue.getVenue);
module.exports = router;