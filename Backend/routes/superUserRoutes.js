const express = require('express');
const router = express.Router();
const { getEmployees, getStudents } = require('../controllers/superUserContollers');

// Get employees
router.get('/getEmployees', getEmployees);

// Get students
router.get("/getStudents", getStudents);

module.exports = router;