const express = require("express");
const router = express.Router();
const { getStudentData, getAttendance } = require("../controllers/studentControllers");
const { verifyToken } = require("../middlewares/verifyToken");
const { checkRole } = require("../middlewares/checkRole");

router.get("/me", verifyToken, checkRole(['student']), getStudentData);

router.get('/myAttendance', verifyToken, checkRole(['student']), getAttendance);

module.exports = router;
