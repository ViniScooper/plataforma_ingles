import { Router } from 'express';
import * as handlers from '../controllers/handlers.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { prisma } from '../database/index.js';

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
router.patch('/exercises/:id', verifyToken, verifyAdmin, handlers.updateExercise);
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

// ─── Multiplayer Co-op RPG Battle Game Server Engine ──────────────────────────

const gameRooms = new Map();
const gameInvites = new Map();

const getNewQuestion = () => {
  const BATTLE_QUESTIONS = [
    { q: "Qual a tradução de 'Book'?", a: "Livro", options: ["Livro", "Caderno", "Caneta", "Mesa"] },
    { q: "Complete a frase: 'She ___ English very well.'", a: "speaks", options: ["speak", "speaks", "speaking", "spoke"] },
    { q: "Qual o antônimo de 'Happy'?", a: "Sad", options: ["Angry", "Glad", "Sad", "Tired"] },
    { q: "Como se escreve 'Maçã' em inglês?", a: "Apple", options: ["Peach", "Apple", "Grape", "Orange"] },
    { q: "Complete com a palavra correta: 'He is a ___ teacher.'", a: "good", options: ["well", "good", "better", "best"] },
    { q: "Traduzir: 'Thank you'", a: "Obrigado", options: ["Por favor", "De nada", "Obrigado", "Olá"] },
    { q: "Qual o plural de 'Child'?", a: "Children", options: ["Childs", "Childrens", "Children", "Childes"] },
    { q: "Qual o significado de 'Run'?", a: "Correr", options: ["Pular", "Correr", "Andar", "Dançar"] },
    { q: "Como se diz 'Quinta-feira' em inglês?", a: "Thursday", options: ["Tuesday", "Thursday", "Wednesday", "Friday"] },
    { q: "Qual é o passado do verbo 'Go'?", a: "Went", options: ["Goed", "Gone", "Went", "Goes"] }
  ];
  const idx = Math.floor(Math.random() * BATTLE_QUESTIONS.length);
  return { idx, ...BATTLE_QUESTIONS[idx] };
};

// Create Room
router.post('/games/create', (req, res) => {
  const { playerId, playerName } = req.body;
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  const initialQuest = getNewQuestion();
  
  const roomState = {
    roomCode,
    stage: 1,
    monsterHp: 60,
    maxMonsterHp: 60,
    monsterType: 'slime',
    players: {
      [playerId]: {
        name: playerName,
        hp: 100,
        avatar: playerName.substring(0, 2).toUpperCase()
      }
    },
    currentQuests: {
      [playerId]: initialQuest
    },
    combatLog: [`Sala ${roomCode} criada por ${playerName}.`],
    actionTrigger: null,
    status: 'active',
    lastActive: Date.now()
  };
  
  gameRooms.set(roomCode, roomState);
  res.status(200).json({ roomCode, state: roomState });
});

// Join Room
router.post('/games/join', (req, res) => {
  const { roomCode, playerId, playerName } = req.body;
  const upperCode = (roomCode || '').trim().toUpperCase();
  const roomState = gameRooms.get(upperCode);
  
  if (!roomState) {
    return res.status(404).json({ error: 'Sala não encontrada!' });
  }
  
  if (roomState.status !== 'active') {
    return res.status(400).json({ error: 'Batalha já foi encerrada nesta sala!' });
  }

  // Add player 2
  roomState.players[playerId] = {
    name: playerName,
    hp: 100,
    avatar: playerName.substring(0, 2).toUpperCase()
  };
  
  roomState.currentQuests[playerId] = getNewQuestion();
  roomState.combatLog.push(`${playerName} entrou no combate!`);
  roomState.lastActive = Date.now();
  
  res.status(200).json({ roomCode: upperCode, state: roomState });
});

// Get Room Status (Poll)
router.get('/games/status/:roomCode', (req, res) => {
  const { roomCode } = req.params;
  const upperCode = roomCode.toUpperCase();
  const roomState = gameRooms.get(upperCode);
  
  if (!roomState) {
    return res.status(404).json({ error: 'Sala não encontrada!' });
  }
  
  // Clean up rooms older than 30 mins
  if (Date.now() - roomState.lastActive > 1800000) {
    gameRooms.delete(upperCode);
    return res.status(404).json({ error: 'Sala expirou por inatividade!' });
  }
  
  res.status(200).json({ state: roomState });
});

// Submit Answer
router.post('/games/action', (req, res) => {
  const { roomCode, playerId, option, questionIdx } = req.body;
  const upperCode = (roomCode || '').trim().toUpperCase();
  const roomState = gameRooms.get(upperCode);
  
  if (!roomState) {
    return res.status(404).json({ error: 'Sala não encontrada!' });
  }
  
  if (roomState.status !== 'active') {
    return res.status(400).json({ error: 'Combate já foi concluído!' });
  }

  const BATTLE_QUESTIONS = [
    { q: "Qual a tradução de 'Book'?", a: "Livro", options: ["Livro", "Caderno", "Caneta", "Mesa"] },
    { q: "Complete a frase: 'She ___ English very well.'", a: "speaks", options: ["speak", "speaks", "speaking", "spoke"] },
    { q: "Qual o antônimo de 'Happy'?", a: "Sad", options: ["Angry", "Glad", "Sad", "Tired"] },
    { q: "Como se escreve 'Maçã' em inglês?", a: "Apple", options: ["Peach", "Apple", "Grape", "Orange"] },
    { q: "Complete com a palavra correta: 'He is a ___ teacher.'", a: "good", options: ["well", "good", "better", "best"] },
    { q: "Traduzir: 'Thank you'", a: "Obrigado", options: ["Por favor", "De nada", "Obrigado", "Olá"] },
    { q: "Qual o plural de 'Child'?", a: "Children", options: ["Childs", "Childrens", "Children", "Childes"] },
    { q: "Qual o significado de 'Run'?", a: "Correr", options: ["Pular", "Correr", "Andar", "Dançar"] },
    { q: "Como se diz 'Quinta-feira' em inglês?", a: "Thursday", options: ["Tuesday", "Thursday", "Wednesday", "Friday"] },
    { q: "Qual é o passado do verbo 'Go'?", a: "Went", options: ["Goed", "Gone", "Went", "Goes"] }
  ];

  const quest = BATTLE_QUESTIONS[questionIdx];
  const player = roomState.players[playerId];
  
  if (!player) {
    return res.status(400).json({ error: 'Jogador não está na sala!' });
  }
  
  const isCorrect = option === quest.a;
  roomState.lastActive = Date.now();
  
  if (isCorrect) {
    const damage = roomState.stage === 3 ? 30 : 20;
    roomState.monsterHp = Math.max(roomState.monsterHp - damage, 0);
    roomState.combatLog.unshift(`⚔️ ${player.name} acertou! Golpe de ${damage} no monstro.`);
    
    roomState.actionTrigger = {
      type: 'attack',
      playerId,
      playerName: player.name,
      damage,
      target: 'monster',
      timestamp: Date.now()
    };
    
    if (roomState.monsterHp === 0) {
      if (roomState.stage < 3) {
        roomState.stage += 1;
        const nextMaxHp = roomState.stage === 2 ? 80 : 120;
        roomState.monsterHp = nextMaxHp;
        roomState.maxMonsterHp = nextMaxHp;
        roomState.monsterType = roomState.stage === 2 ? 'skeleton' : 'dragon';
        roomState.combatLog.unshift(`🎉 Monstro derrotado! Estágio ${roomState.stage} iniciado contra o ${roomState.monsterType.toUpperCase()}!`);
      } else {
        roomState.status = 'victory';
        roomState.combatLog.unshift(`👑 VITÓRIA! Os jogadores derrotaram o chefe final!`);
      }
    }
  } else {
    const damage = roomState.stage === 1 ? 15 : roomState.stage === 2 ? 20 : 25;
    player.hp = Math.max(player.hp - damage, 0);
    roomState.combatLog.unshift(`💥 ${player.name} errou e recebeu ${damage} de dano.`);
    
    roomState.actionTrigger = {
      type: 'attack',
      playerId,
      playerName: player.name,
      damage,
      target: 'player',
      timestamp: Date.now()
    };
    
    const allDead = Object.values(roomState.players).every(p => p.hp === 0);
    if (allDead) {
      roomState.status = 'defeat';
      roomState.combatLog.unshift(`💀 DERROTA! O grupo foi nocauteado.`);
    }
  }
  
  roomState.currentQuests[playerId] = getNewQuestion();
  
  res.status(200).json({ state: roomState });
});

// Admin Endpoint: Get all active game sessions for teacher monitoring!
router.get('/games/active', verifyToken, verifyAdmin, (req, res) => {
  const activeRooms = Array.from(gameRooms.values()).map(room => ({
    roomCode: room.roomCode,
    stage: room.stage,
    monsterHp: room.monsterHp,
    maxMonsterHp: room.maxMonsterHp,
    monsterType: room.monsterType,
    players: Object.entries(room.players).map(([id, p]) => ({ id, name: p.name, hp: p.hp })),
    combatLog: room.combatLog.slice(0, 5),
    status: room.status,
    lastActive: room.lastActive
  }));
  
  res.status(200).json(activeRooms);
});

// Endpoint to list other students for co-op invitation
router.get('/games/players', verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        id: { not: currentUserId }
      },
      select: {
        id: true,
        name: true,
        username: true
      }
    });
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching game players:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Send invite to a student
router.post('/games/invite', verifyToken, async (req, res) => {
  const { guestId, hostName } = req.body;
  const hostId = req.user.id;
  
  if (!guestId) {
    return res.status(400).json({ error: 'ID do convidado é obrigatório' });
  }
  
  const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const initialQuest = getNewQuestion();
  
  const roomState = {
    roomCode,
    stage: 1,
    monsterHp: 60,
    maxMonsterHp: 60,
    monsterType: 'slime',
    players: {
      [hostId]: {
        name: hostName || 'Aluno',
        hp: 100,
        avatar: (hostName || 'Aluno').substring(0, 2).toUpperCase()
      }
    },
    currentQuests: {
      [hostId]: initialQuest
    },
    combatLog: [`Sala ${roomCode} criada por convite de ${hostName}.`],
    actionTrigger: null,
    status: 'active',
    lastActive: Date.now()
  };
  
  gameRooms.set(roomCode, roomState);
  
  gameInvites.set(roomCode, {
    roomCode,
    hostId: String(hostId),
    hostName: hostName || 'Aluno',
    guestId: String(guestId),
    status: 'pending',
    timestamp: Date.now()
  });
  
  res.status(200).json({ roomCode, state: roomState });
});

// Check pending invites
router.get('/games/invites/pending', verifyToken, (req, res) => {
  const currentUserId = String(req.user.id);
  const now = Date.now();
  
  // Clean up old invites (> 5 mins)
  for (const [code, inv] of gameInvites.entries()) {
    if (now - inv.timestamp > 300000) {
      gameInvites.delete(code);
    }
  }
  
  const pending = Array.from(gameInvites.values()).filter(
    inv => inv.guestId === currentUserId && inv.status === 'pending'
  );
  
  res.status(200).json(pending);
});

// Accept invite
router.post('/games/invite/accept', verifyToken, (req, res) => {
  const { roomCode, guestName } = req.body;
  const guestId = String(req.user.id);
  
  const upperCode = (roomCode || '').trim().toUpperCase();
  const roomState = gameRooms.get(upperCode);
  const invite = gameInvites.get(upperCode);
  
  if (!roomState || !invite) {
    return res.status(404).json({ error: 'Sala ou convite expirou ou não existe!' });
  }
  
  if (invite.guestId !== guestId) {
    return res.status(403).json({ error: 'Você não foi convidado para esta sala!' });
  }
  
  invite.status = 'accepted';
  
  roomState.players[guestId] = {
    name: guestName || 'Convidado',
    hp: 100,
    avatar: (guestName || 'Convidado').substring(0, 2).toUpperCase()
  };
  
  roomState.currentQuests[guestId] = getNewQuestion();
  roomState.combatLog.push(`${guestName} aceitou o convite e entrou no combate!`);
  roomState.lastActive = Date.now();
  
  gameInvites.delete(upperCode);
  
  res.status(200).json({ roomCode: upperCode, state: roomState });
});

// Decline invite
router.post('/games/invite/decline', verifyToken, (req, res) => {
  const { roomCode } = req.body;
  const guestId = String(req.user.id);
  const upperCode = (roomCode || '').trim().toUpperCase();
  
  const invite = gameInvites.get(upperCode);
  if (invite && invite.guestId === guestId) {
    invite.status = 'declined';
    gameInvites.delete(upperCode);
    gameRooms.delete(upperCode);
  }
  
  res.status(200).json({ message: 'Convite recusado com sucesso.' });
});
