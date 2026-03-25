import { Router } from 'express';
import * as handlers from '../controllers/handlers.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

export const router = Router();

// Auth
router.post('/auth/signup', handlers.signUp);
router.post('/auth/signin', handlers.signIn);
router.get('/users', verifyToken, verifyAdmin, handlers.getAllUsers);
router.post('/users', verifyToken, verifyAdmin, handlers.createUser);
router.put('/users/:id', verifyToken, handlers.updateUser);
router.delete('/users/:id', verifyToken, handlers.deleteUser);

// Plans (Admin only for write operations)
router.get('/plans', handlers.getAllPlans);
router.post('/plans', verifyToken, verifyAdmin, handlers.createPlan);
router.put('/plans/:id', verifyToken, verifyAdmin, handlers.updatePlan);
router.delete('/plans/:id', verifyToken, verifyAdmin, handlers.deletePlan);

// Exercises
router.get('/exercises', handlers.getExercises);
router.post('/exercises', verifyToken, verifyAdmin, handlers.createExercise);
router.delete('/exercises/:id', verifyToken, verifyAdmin, handlers.deleteExercise);
router.post('/exercises/import', verifyToken, verifyAdmin, handlers.importExercises);

// Enrollments
router.post('/enrollments', verifyToken, verifyAdmin, handlers.enrollStudent);
router.get('/enrollments', verifyToken, verifyAdmin, handlers.getEnrollments);
router.get('/enrollments/user/:userId', verifyToken, handlers.getUserEnrollments);
router.put('/enrollments/:id', verifyToken, verifyAdmin, handlers.updateEnrollment);
router.delete('/enrollments/:userId/:planId', verifyToken, verifyAdmin, handlers.deleteEnrollment);

// Student Progress & Assignments
router.post('/assignments', verifyToken, verifyAdmin, handlers.assignExercise);
router.get('/progress/:userId', verifyToken, handlers.getStudentProgress);
router.put('/progress/status', verifyToken, handlers.updateExerciseStatus);
router.put('/progress/reset', verifyToken, verifyAdmin, handlers.resetExerciseStatus);

// Attendance
router.post('/attendance', verifyToken, verifyAdmin, handlers.markAttendance);
router.get('/attendance', verifyToken, verifyAdmin, handlers.getAllAttendance);
router.get('/attendance/:userId', verifyToken, handlers.getAttendance);
router.put('/attendance/:id', verifyToken, verifyAdmin, handlers.updateAttendance);
router.delete('/attendance/:id', verifyToken, verifyAdmin, handlers.deleteAttendance);
