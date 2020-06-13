const path = require('path');

const express = require('express');

const madController = require('../controllers/mad');

const router = express.Router();

router.get('/about', madController.getAbout)
router.get('/contact', madController.getContact)
router.get('/activities', madController.getActivities)
router.get('/motivation', madController.getMotivation)

module.exports = router;