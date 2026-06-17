import { prisma } from '../database/index.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {
  const { email, password, username, age, name, role } = req.body;

  if (!email || !password || !username || !name) {
    return res.status(400).json({ error: 'Email, password, username, and name are required' });
  }

  try {
    const check = await checkUserExists(email, username);
    if (check) return res.status(403).json({ error: 'User already exists' });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        age,
        username,
        role: role || 'student'
      }
    });

    return res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const signIn = async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({ error: 'Email/username and password are required' });
  }

  try {
    console.log('🔍 SignIn attempt with:', { email, username, password: '***' });

    const user = await prisma.user.findUnique({
      where: email ? { email } : { username }
    });

    console.log('👤 User found:', user ? `${user.email} (${user.role})` : 'NOT FOUND');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('🔐 Comparing password...');
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log('✓ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Auth successful, generating token');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecret123',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.email);
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error signing in:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, age, username } = req.body;

  try {
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (age) data.age = age;
    if (username) data.username = username;

    if (password) {
      const bcryptjs = (await import('bcryptjs')).default;
      data.password = await bcryptjs.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data
    });

    return res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const bcryptjs = (await import('bcryptjs')).default;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username: email.split('@')[0],
        role: role || 'student'
      }
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    return res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createPlan = async (req, res) => {
  const { name, description, level, price, hours } = req.body;

  if (!name || !level || !price) {
    return res.status(400).json({ error: 'Name, level, and price are required' });
  }

  try {
    const plan = await prisma.plan.create({
      data: { name, description, level, price: parseFloat(price), hours: hours ? parseInt(hours) : null }
    });

    return res.status(201).json({
      message: 'Plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, level, price, hours } = req.body;

  try {
    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (level) data.level = level;
    if (price) data.price = parseFloat(price);
    if (hours) data.hours = parseInt(hours);

    const plan = await prisma.plan.update({
      where: { id: parseInt(id) },
      data
    });

    return res.status(200).json({
      message: 'Plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.plan.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Exercises
export const getExercises = async (req, res) => {
  const { level, type } = req.query;

  try {
    const where = {};
    if (level) where.level = level;
    if (type) where.type = type;

    const exercises = await prisma.exercise.findMany({ where });
    return res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createExercise = async (req, res) => {
  const { level, sentence, gaps, planId, type, title, content } = req.body;

  if (!level || !planId) {
    return res.status(400).json({ error: 'Level and planId are required' });
  }

  try {
    const exercise = await prisma.exercise.create({
      data: {
        level,
        type: type || 'gap-fill',
        title: title || 'New Exercise',
        content: content ? (typeof content === 'string' ? JSON.parse(content) : content) : null,
        sentence: sentence || null,
        gaps: gaps ? (typeof gaps === 'string' ? JSON.parse(gaps) : gaps) : null,
        planId: parseInt(planId)
      }
    });

    return res.status(201).json({
      message: 'Exercise created successfully',
      exercise
    });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { type, title, level, content } = req.body;

  try {
    const data = {};
    if (type) data.type = type;
    if (title) data.title = title;
    if (level) data.level = level;
    if (content) data.content = (typeof content === 'string' ? JSON.parse(content) : content);

    const exercise = await prisma.exercise.update({
      where: { id: parseInt(id) },
      data,
    });

    return res.status(200).json({ message: 'Exercise updated successfully', exercise });
  } catch (error) {
    console.error('Error updating exercise:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.exercise.delete({
      where: { id: parseInt(id) }
    });
    return res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return res.status(500).json({ error: 'Error deleting exercise' });
  }
};

export const deleteAllExercises = async (req, res) => {
  try {
    await prisma.exercise.deleteMany({});
    return res.status(200).json({ message: 'All exercises deleted successfully' });
  } catch (error) {
    console.error('Error deleting all exercises:', error);
    return res.status(500).json({ error: 'Error deleting all exercises' });
  }
};

export const importExercises = async (req, res) => {
  const { exercises, planId, level } = req.body; 

  console.log('📥 Incoming Import Request:', { 
    exercisesCount: Array.isArray(exercises) ? exercises.length : 1, 
    planId,
    sampleType: Array.isArray(exercises) ? exercises[0]?.type : exercises?.type
  });

  if (!exercises) {
    return res.status(400).json({ error: 'Exercises data is required' });
  }

  const dataArray = Array.isArray(exercises) ? exercises : [exercises];
  console.log(`📦 Importing ${dataArray.length} exercises...`);

  try {
    const created = await Promise.all(
      dataArray.map((ex, exIdx) => {
        // Build content: if ex.content exists, use it. 
        // Otherwise, use the root object but remove metadata fields.
        let exContent;
        if (ex.content && typeof ex.content === 'object') {
          exContent = ex.content;
        } else {
          // Extract everything EXCEPT metadata fields to be part of content
          const { title, level, type, planId, ...rest } = ex;
          exContent = rest;
        }

        // Determine type: 
        // Priority 1: explicit type field (with Portuguese mapping)
        // Priority 2: smart detection from content fields
        let exType = ex.type;
        
        // Map friendly labels to internal slugs
        const typeMap = {
          'escrita': 'writing',
          'Escrita': 'writing',
          'writing': 'writing',
          'v-ou-f': 'true-false',
          'v ou f': 'true-false',
          'true-false': 'true-false',
          'Quiz': 'quiz',
          'quiz': 'quiz',
          'leitura': 'text',
          'texto': 'text',
          'text': 'text',
          'gap-fill': 'gap-fill',
          'matching': 'matching',
          'Relacionar': 'matching',
          'sentence-order': 'sentence-order',
          'Frases': 'sentence-order',
          'flashcards': 'flashcards',
          'Flashcards': 'flashcards',
          'cartoes': 'flashcards',
          'Cartões': 'flashcards'
        };

        if (exType && typeMap[exType]) {
          exType = typeMap[exType];
        }

        if (!exType) {
          if (exContent.prompt) exType = 'writing';
          else if (exContent.cards) exType = 'flashcards';
          else if (exContent.statements) exType = 'true-false';
          else if (exContent.sentences) exType = 'sentence-order';
          else if (exContent.pairs) exType = 'matching';
          else if (exContent.questions || ex.questions) exType = 'quiz';
          else exType = 'text';
        }

        console.log(`✅ Exercise #${exIdx}: Processed as "${exType}" (Title: ${ex.title})`);

        // Final safety: if it's quiz but questions are outside content, move them in
        if (exType === 'quiz' && !exContent.questions && ex.questions) {
          exContent.questions = ex.questions;
        }

        return prisma.exercise.create({
          data: {
            level: ex.level || level || 'Beginner',
            type: exType,
            title: ex.title || 'Imported Activity',
            content: exContent,
            planId: parseInt(ex.planId || planId)
          }
        });
      })
    );

    return res.status(201).json({
      message: `${created.length} activities imported successfully`,
      count: created.length
    });
  } catch (error) {
    console.error('Error importing exercises:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Enrollments
export const enrollStudent = async (req, res) => {
  const { userId, planId, classesPerWeek, pricePerClass, studentLevel, lessonDescription, startDate } = req.body;

  if (!userId || !planId) {
    return res.status(400).json({ error: 'User ID and Plan ID are required' });
  }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: parseInt(userId),
        planId: parseInt(planId),
        classesPerWeek: classesPerWeek ? parseInt(classesPerWeek) : 1,
        pricePerClass: pricePerClass ? parseFloat(pricePerClass) : 0,
        studentLevel: studentLevel || 'Beginner',
        lessonDescription: lessonDescription || null,
        startDate: startDate ? new Date(startDate) : new Date()
      }
    });

    return res.status(201).json({
      message: 'Student enrolled successfully',
      enrollment
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Student already enrolled in this plan' });
    }
    console.error('Error enrolling student:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: { user: true, plan: true }
    });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserEnrollments = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { plan: true }
    });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { classesPerWeek, pricePerClass, studentLevel, lessonDescription, startDate } = req.body;

  try {
    const data = {};
    if (classesPerWeek !== undefined) data.classesPerWeek = parseInt(classesPerWeek);
    if (pricePerClass !== undefined) data.pricePerClass = parseFloat(pricePerClass);
    if (studentLevel) data.studentLevel = studentLevel;
    if (lessonDescription !== undefined) data.lessonDescription = lessonDescription;
    if (startDate) data.startDate = new Date(startDate);

    const enrollment = await prisma.enrollment.update({
      where: { id: parseInt(id) },
      data
    });

    return res.status(200).json({ message: 'Enrollment updated successfully', enrollment });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteEnrollment = async (req, res) => {
  const { userId, planId } = req.params;

  try {
    await prisma.enrollment.delete({
      where: {
        userId_planId: {
          userId: parseInt(userId),
          planId: parseInt(planId)
        }
      }
    });

    return res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Student Exercises (Assignment & Tracking)
export const assignExercise = async (req, res) => {
  const { userId, exerciseId } = req.body;

  if (!userId || !exerciseId) {
    return res.status(400).json({ error: 'User ID and Exercise ID are required' });
  }

  try {
    const assignment = await prisma.student_exercise.create({
      data: {
        userId: parseInt(userId),
        exerciseId: parseInt(exerciseId)
      }
    });

    return res.status(201).json({
      message: 'Exercise assigned successfully',
      assignment
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Exercise already assigned to this user' });
    }
    console.error('Error assigning exercise:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStudentProgress = async (req, res) => {
  const { userId } = req.params;

  try {
    const progress = await prisma.student_exercise.findMany({
      where: { userId: parseInt(userId) },
      include: { exercise: true }
    });

    return res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateExerciseStatus = async (req, res) => {
  const { userId, exerciseId, status, result, score, totalQuestions } = req.body;

  try {
    const update = await prisma.student_exercise.update({
      where: {
        userId_exerciseId: {
          userId: parseInt(userId),
          exerciseId: parseInt(exerciseId)
        }
      },
      data: {
        status: status || 'completed',
        result: result || null,
        score: score !== undefined ? parseInt(score) : undefined,
        totalQuestions: totalQuestions !== undefined ? parseInt(totalQuestions) : undefined,
        completedAt: status === 'completed' ? new Date() : undefined
      }
    });

    return res.status(200).json({
      message: 'Exercise status updated',
      update
    });
  } catch (error) {
    console.error('Error updating exercise status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resetExerciseStatus = async (req, res) => {
  const { userId, exerciseId } = req.body;
  
  if (!userId || !exerciseId) {
    return res.status(400).json({ error: 'User ID and Exercise ID are required' });
  }

  try {
    await prisma.student_exercise.update({
      where: {
        userId_exerciseId: {
          userId: parseInt(userId),
          exerciseId: parseInt(exerciseId)
        }
      },
      data: {
        status: 'assigned',
        result: null,
        score: null,
        totalQuestions: null,
        completedAt: null
      }
    });
    return res.status(200).json({ message: 'Exercise status reset to assigned' });
  } catch (error) {
    console.error('Error resetting exercise status:', error);
    return res.status(500).json({ error: 'Error resetting exercise status' });
  }
};

export const resetAllProgress = async (req, res) => {
  try {
    await prisma.student_exercise.deleteMany({});
    return res.status(200).json({ message: 'All student progress reset successfully' });
  } catch (error) {
    console.error('Error resetting all progress:', error);
    return res.status(500).json({ error: 'Error resetting all progress' });
  }
};

// Attendance
export const markAttendance = async (req, res) => {
  const { userId, date, time } = req.body;

  if (!userId || !date || !time) {
    return res.status(400).json({ error: 'User ID, date, and time are required' });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        userId: parseInt(userId),
        date: new Date(date),
        time: time
      }
    });

    return res.status(201).json({
      message: 'Attendance recorded',
      attendance
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAttendance = async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await prisma.attendance.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { date: 'desc' }
    });

    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { user: true },
      orderBy: { date: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { userId, date, time } = req.body;

  try {
    const updated = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: {
        ...(userId && { userId: parseInt(userId) }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
      }
    });
    return res.status(200).json({ message: 'Attendance updated', attendance: updated });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.attendance.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: 'Attendance deleted' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper
async function checkUserExists(email, username) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });
  return !!user;
}
