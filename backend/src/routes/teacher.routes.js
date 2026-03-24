// ===========================
// Teacher Routes
// ===========================

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const teacherController = require('../controllers/teacherController');

// All routes require authentication
router.use(authMiddleware);

/**
 * Get teacher's assigned classes
 * GET /api/teachers/my-classes
 */
router.get('/my-classes', teacherController.getMyClasses);

/**
 * Get all students of a teacher (across all assigned classes)
 * GET /api/teachers/my-students
 */
router.get('/my-students', teacherController.getMyStudents);

/**
 * Get all teachers with their assigned classes (Admin only)
 * GET /api/teachers
 */
router.get('/', teacherController.getAllTeachers);

/**
 * Create teacher (Admin only)
 * POST /api/teachers
 */
router.post('/', teacherController.createTeacher);

/**
 * Assign teacher to a class (Admin only)
 * POST /api/teachers/:teacherId/classes/:classId
 */
router.post('/:teacherId/classes/:classId', teacherController.assignToClass);

/**
 * Remove teacher from a class (Admin only)
 * DELETE /api/teachers/:teacherId/classes/:classId
 */
router.delete('/:teacherId/classes/:classId', teacherController.removeFromClass);

module.exports = router;
