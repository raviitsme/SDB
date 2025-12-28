const express = require('express');
const router = express.Router();
const { getAdmins, deleteAdmins, getEmployees, deleteTeachers, getDashboardData, getStudents, deleteStudents } = require('../controllers/adminController');

// Get Dashboard Data
router.get("/getDashboardData", getDashboardData);

// Fetch Admins
router.get('/getAdmins', getAdmins);

//Fetch Teachers
router.get('/getEmployees', getEmployees);

// Delete Admins
router.delete('/deleteAdmins/:id', deleteAdmins);

// Delete Teachers
router.delete('/deleteTeachers/:id', deleteTeachers);

// Fetch Students
router.get("/getStudents", getStudents);

// Delete Students
router.delete("/deleteStudents/:id", deleteStudents)

module.exports = router;
