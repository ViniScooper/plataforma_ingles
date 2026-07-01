import jwt from 'jsonwebtoken';
import { prisma } from '../database/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the current token matches the activeToken in the database
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { activeToken: true }
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'UserNotFound', message: 'Usuário não encontrado.' });
    }

    if (dbUser.activeToken && dbUser.activeToken !== token) {
      return res.status(401).json({ 
        code: 'SESSION_EXPIRED', 
        error: 'Sua sessão foi encerrada porque este usuário foi conectado em outro dispositivo.' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const verifyStudent = (req, res, next) => {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ error: 'Student access required' });
  }
  next();
};
