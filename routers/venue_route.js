const express = require('express')
const router = express.Router();
const ctrVenue = require('../controllers/venue.controllers');

router.get('/', ctrVenue.getVenue);
router.get('/:venue_id/basic', ctrVenue.getVenueInformation);
router.get('/:venue_id/pie_chart', ctrVenue.getVenuePieChartInformation);
router.get('/:venue_id/graph', ctrVenue.getVenueGraphInformation);
module.exports = router;