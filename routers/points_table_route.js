const express = require('express')
const router = express.Router();
const ctrPointsTable = require('../controllers/points_table.controllers');

router.get('/:year', ctrPointsTable.getPointsTable);
module.exports = router;