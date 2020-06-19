const path = require('path');

const express = require('express');

const madController = require('../controllers/mad');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/dashboard', isAuth, madController.getDashboard)
router.get('/contact', madController.getContact)
router.get('/activities', isAuth, madController.getActivities)
router.get('/motivation', isAuth, madController.getMotivation)
router.post('/bucket', isAuth, madController.postBucket)
router.post('/create-toDo', isAuth, madController.postToDo)
router.post('/toDo-delete', isAuth, madController.postToDoDelete)
router.post('/user-idea', isAuth, madController.postUserIdea)

module.exports = router;