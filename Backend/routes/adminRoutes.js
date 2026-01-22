const express = require('express');
const router = express.Router();
const { getAdmins, deleteAdmins, getEmployees, deleteTeachers, getDashboardData, getStudents, deleteStudents, addAdmins, editEmployees } = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/verifyToken');

// Get Dashboard Data
router.get("/getDashboardData", getDashboardData);

// Fetch Admins
router.get('/getAdmins', getAdmins);

// Add Admins
router.post('/addAdmin', addAdmins)

// Delete Admins
router.delete('/deleteAdmins/:id', verifyToken, deleteAdmins);

//Fetch Teachers
router.get('/getEmployees', getEmployees);

// Edit Teachers
router.put('/editEmployee/:id', editEmployees)

// Delete Teachers
router.delete('/deleteTeachers/:id', deleteTeachers);

// Fetch Students
router.get("/getStudents", getStudents);

// Delete Students
router.delete("/deleteStudents/:id", deleteStudents)

module.exports = router;
