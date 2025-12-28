const express = require('express');
const router = express.Router();
const { getEmployeeData, getMyStudents, addStudents } = require('../controllers/employeeControllers');
const { verifyToken } = require('../middlewares/verifyToken');
const { checkRole } = require('../middlewares/checkRole');

// Get employee profile
router.get('/me',verifyToken, checkRole(['employee']), getEmployeeData);

// Get students
router.get('/myStudents',verifyToken, checkRole(['employee']), getMyStudents);

// Add Students
router.post('/addStudent', verifyToken, addStudents);

module.exports = router;