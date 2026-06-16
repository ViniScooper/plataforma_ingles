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

const BATTLE_QUESTIONS = [
  { q: "Qual a tradução de 'Book'?", a: "Livro", options: ["Livro", "Caderno", "Caneta", "Mesa"], level: 1 },
  { q: "Qual o antônimo de 'Happy' (Feliz)?", a: "Sad", options: ["Angry", "Glad", "Sad", "Tired"], level: 1 },
  { q: "Como se escreve 'Maçã' em inglês?", a: "Apple", options: ["Peach", "Apple", "Grape", "Orange"], level: 1 },
  { q: "Traduzir: 'Thank you'", a: "Obrigado", options: ["Por favor", "De nada", "Obrigado", "Olá"], level: 1 },
  { q: "Qual o significado de 'Run'?", a: "Correr", options: ["Pular", "Correr", "Andar", "Dançar"], level: 1 },
  { q: "Como se diz 'Quinta-feira' em inglês?", a: "Thursday", options: ["Tuesday", "Thursday", "Wednesday", "Friday"], level: 1 },
  { q: "Qual a palavra correta para 'Espada'?", a: "Sword", options: ["Shield", "Sword", "Spear", "Bow"], level: 1 },
  { q: "Como se diz 'Castelo' em inglês?", a: "Castle", options: ["Kingdom", "Palace", "Castle", "Fortress"], level: 1 },
  { q: "Como se diz 'Floresta' em inglês?", a: "Forest", options: ["Desert", "Forest", "Mountain", "River"], level: 1 },
  { q: "O que é 'Treasure'?", a: "Tesouro", options: ["Ouro", "Tesouro", "Moeda", "Baú"], level: 1 },
  { q: "Como se diz 'Chave' em inglês?", a: "Key", options: ["Door", "Lock", "Key", "Chest"], level: 1 },
  { q: "Como se diz 'Gelo' em inglês?", a: "Ice", options: ["Fire", "Ice", "Water", "Wind"], level: 1 },
  { q: "Qual o significado de 'Ring'?", a: "Anel", options: ["Colar", "Pulseira", "Anel", "Brinco"], level: 1 },
  { q: "Como se traduz 'Victory'?", a: "Vitória", options: ["Vitória", "Derrota", "Empate", "Combate"], level: 1 },
  { q: "Como se diz 'Dourado' em inglês?", a: "Golden", options: ["Gold", "Golden", "Yellow", "Gilded"], level: 1 },
  { q: "Como traduzir: 'Open the gate'?", a: "Abra o portão", options: ["Abra a porta", "Abra o portão", "Feche a porta", "Destranque o baú"], level: 1 },
  { q: "Qual a palavra em inglês para 'Ponte'?", a: "Bridge", options: ["River", "Bridge", "Road", "Tunnel"], level: 1 },
  { q: "Como se escreve 'Feitiço' em inglês?", a: "Spell", options: ["Spell", "Magic", "Charm", "Hex"], level: 1 },
  { q: "O que significa a palavra 'Shield'?", a: "Escudo", options: ["Armadura", "Espada", "Escudo", "Capacete"], level: 1 },
  { q: "Como se diz 'Monstro' em inglês?", a: "Monster", options: ["Creature", "Beast", "Monster", "Goblin"], level: 1 },
  { q: "Qual a tradução de 'Left'?", a: "Esquerda", options: ["Direita", "Esquerda", "Acima", "Abaixo"], level: 1 },
  { q: "Qual a tradução de 'Right'?", a: "Direita", options: ["Direita", "Esquerda", "Antes", "Depois"], level: 1 },
  { q: "O que significa a palavra 'Before'?", a: "Antes", options: ["Depois", "Antes", "Atrás", "Frente"], level: 1 },
  { q: "O que significa a palavra 'After'?", a: "Depois", options: ["Antes", "Depois", "Lado", "Dentro"], level: 1 },
  
  { q: "Complete a frase: 'She ___ English very well.'", a: "speaks", options: ["speak", "speaks", "speaking", "spoke"], level: 2 },
  { q: "Complete com a palavra correta: 'He is a ___ teacher.'", a: "good", options: ["well", "good", "better", "best"], level: 2 },
  { q: "Qual o plural de 'Child'?", a: "Children", options: ["Childs", "Childrens", "Children", "Childes"], level: 2 },
  { q: "Qual é o passado do verbo 'Go'?", a: "Went", options: ["Goed", "Gone", "Went", "Goes"], level: 2 },
  { q: "Como se diz 'Poção de Vida' em inglês?", a: "Health Potion", options: ["Life Drink", "Healing Potion", "Health Potion", "Mana Flask"], level: 2 },
  { q: "Complete: 'I have ___ money to buy a new armor.'", a: "enough", options: ["enough", "many", "very", "too much"], level: 2 },
  { q: "O que significa 'Quest'?", a: "Missão", options: ["Perguntar", "Missão", "Batalha", "Castelo"], level: 2 },
  { q: "Qual é o significado de 'Darkness'?", a: "Escuridão", options: ["Luz", "Escuridão", "Morte", "Medo"], level: 2 },
  { q: "Complete: 'If you want to defeat the slime, you ___ use fire.'", a: "should", options: ["should", "are", "do", "have"], level: 2 },
  { q: "O que significa o verbo 'To heal'?", a: "Curar", options: ["Correr", "Curar", "Machucar", "Combater"], level: 2 },
  { q: "Como traduzir: 'Beware of the trap'?", a: "Cuidado com a armadilha", options: ["Fuja do monstro", "Cuidado com a armadilha", "Pegue o tesouro", "Encontre a saída"], level: 2 },
  { q: "Qual o antônimo de 'Weak' (Fraco)?", a: "Strong", options: ["Strong", "Tough", "Heavy", "Fast"], level: 2 },
  { q: "Complete: 'I can't read this map, it is in another ___.'", a: "language", options: ["language", "country", "speak", "writing"], level: 2 },
  { q: "Complete: 'They ___ fighting the giant boss now!'", a: "are", options: ["is", "are", "was", "were"], level: 2 },
  { q: "Complete: 'She ___ have a sword, she uses a magic wand.'", a: "doesn't", options: ["don't", "doesn't", "isn't", "hasn't"], level: 2 },
  { q: "Qual o significado de 'Fear'?", a: "Medo", options: ["Coragem", "Medo", "Monstro", "Raiva"], level: 2 },
  { q: "Como se diz 'Vender' em inglês?", a: "Sell", options: ["Buy", "Sell", "Trade", "Give"], level: 2 },
  { q: "Complete: 'There is ___ apple on the table.'", a: "an", options: ["a", "an", "the", "some"], level: 2 },
  { q: "O que significa 'Bow' no contexto de combate/armas?", a: "Arco", options: ["Flecha", "Espada", "Arco", "Adaga"], level: 2 },
  { q: "Como se diz 'Guerreiro' em inglês?", a: "Warrior", options: ["Mage", "Knight", "Warrior", "Thief"], level: 2 },
  { q: "Como se diz 'Vire à esquerda' em inglês?", a: "Turn left", options: ["Turn right", "Turn left", "Go straight", "Go back"], level: 2 },
  { q: "Como se diz 'Vire à direita' em inglês?", a: "Turn right", options: ["Turn right", "Turn left", "Go straight", "Go back"], level: 2 },
  { q: "Complete: 'Tuesday comes ___ Monday.'", a: "after", options: ["before", "after", "between", "next"], level: 2 },
  { q: "Complete: 'Monday comes ___ Tuesday.'", a: "before", options: ["before", "after", "between", "next"], level: 2 },
  
  { q: "Como traduzir: 'The dragon is flying above the castle'?", a: "O dragão está voando acima do castelo", options: ["O dragão está voando acima do castelo", "O dragão está dormindo no castelo", "O dragão atacou o castelo", "O dragão fugiu do castelo"], level: 3 },
  { q: "Qual o passado do verbo 'Buy' (Comprar)?", a: "Bought", options: ["Buyed", "Bought", "Brought", "Bin"], level: 3 },
  { q: "Como traduzir: 'He is the king of this land'?", a: "Ele é o rei desta terra", options: ["Ele é o rei desta terra", "Ele quer reinar esta terra", "Ele protege esta terra", "Ele é o guerreiro desta terra"], level: 3 },
  { q: "Complete: 'We must walk ___ the dark cave.'", a: "through", options: ["through", "across", "about", "above"], level: 3 },
  { q: "Qual a tradução de 'Knight'?", a: "Cavaleiro", options: ["Noite", "Rei", "Guerreiro", "Cavaleiro"], level: 3 },
  { q: "Qual o passado de 'Find' (Encontrar)?", a: "Found", options: ["Finded", "Found", "Founded", "Fund"], level: 3 },
  { q: "Complete: '___ you ready to enter the dungeon?'", a: "Are", options: ["Is", "Do", "Are", "Have"], level: 3 },
  { q: "Traduzir: 'The sun rises in the east'", a: "O sol nasce no leste", options: ["O sol nasce no leste", "O sol brilha no leste", "O sol se põe no leste", "A lua nasce no leste"], level: 3 },
  { q: "Qual o plural de 'Wolf' (Lobo)?", a: "Wolves", options: ["Wolfs", "Wolves", "Wolfes", "Wolverines"], level: 3 },
  { q: "Complete: 'We need to make a ___ to rest.'", a: "camp", options: ["camp", "tent", "house", "fire"], level: 3 },
  { q: "O que significa a palavra 'Arrow'?", a: "Flecha", options: ["Arco", "Flecha", "Escudo", "Lança"], level: 3 },
  { q: "Como se diz 'Perigo' em inglês?", a: "Danger", options: ["Safety", "Hazard", "Danger", "Risk"], level: 3 },
  { q: "Qual o oposto de 'Light' (Claro/Luz)?", a: "Dark", options: ["Shadow", "Dark", "Heavy", "Bright"], level: 3 },
  { q: "Complete: 'He is the ___ wizard in the school.'", a: "smartest", options: ["smartest", "smarter", "more smart", "most smart"], level: 3 },
  { q: "Complete: 'I have never ___ a dragon before.'", a: "seen", options: ["see", "saw", "seen", "seeing"], level: 3 },
  { q: "O que significa o verbo 'To steal'?", a: "Roubar", options: ["Comprar", "Roubar", "Pegar", "Guardar"], level: 3 },
  { q: "Complete: 'You should not go there ___ night.'", a: "at", options: ["in", "on", "at", "during"], level: 3 },
  { q: "Qual o passado de 'Fight' (Lutar)?", a: "Fought", options: ["Fighted", "Fought", "Foughted", "Figh"], level: 3 },
  { q: "Complete: 'This sword is made ___ steel.'", a: "of", options: ["of", "by", "from", "with"], level: 3 },
  { q: "O que significa 'To escape'?", a: "Escapar", options: ["Entrar", "Lutar", "Escapar", "Esconder"], level: 3 },
  { q: "Ordene as palavras para formar a frase: 'like / English / I'", a: "I like English", options: ["I like English", "English I like", "Like I English", "I English like"], level: 3 },
  { q: "Ordene as palavras para formar a frase: 'is / dragon / the / big'", a: "The dragon is big", options: ["Dragon the is big", "The is big dragon", "The dragon is big", "Is the big dragon"], level: 3 },
  { q: "Ordene as palavras para formar a frase: 'go / left / turn / and'", a: "Turn left and go", options: ["Go and turn left", "Turn left and go", "Left turn and go", "Go left and turn"], level: 3 },
  { q: "Ordene as palavras para formar a frase: 'she / before / eats / study'", a: "She eats before studying", options: ["She eats before studying", "She before studying eats", "Before studying she eats", "Eats she before studying"], level: 3 }
];

const getNewQuestion = (stage = 1) => {
  const candidates = BATTLE_QUESTIONS.filter(q => q.level === stage);
  if (candidates.length === 0) {
    const idx = Math.floor(Math.random() * BATTLE_QUESTIONS.length);
    return { idx, ...BATTLE_QUESTIONS[idx] };
  }
  const idxInFiltered = Math.floor(Math.random() * candidates.length);
  const selectedQ = candidates[idxInFiltered];
  const globalIdx = BATTLE_QUESTIONS.findIndex(q => q.q === selectedQ.q);
  return { idx: globalIdx, ...selectedQ };
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
        avatar: playerName.substring(0, 2).toUpperCase(),
        consecutiveCorrect: 0
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
    avatar: playerName.substring(0, 2).toUpperCase(),
    consecutiveCorrect: 0
  };
  
  roomState.currentQuests[playerId] = getNewQuestion(roomState.stage);
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
  const { roomCode, playerId, option, questionIdx, isTimeout } = req.body;
  const upperCode = (roomCode || '').trim().toUpperCase();
  const roomState = gameRooms.get(upperCode);
  
  if (!roomState) {
    return res.status(404).json({ error: 'Sala não encontrada!' });
  }
  
  if (roomState.status !== 'active') {
    return res.status(400).json({ error: 'Combate já foi concluído!' });
  }

  const quest = BATTLE_QUESTIONS[questionIdx];
  const player = roomState.players[playerId];
  
  if (!player) {
    return res.status(400).json({ error: 'Jogador não está na sala!' });
  }
  
  const isCorrect = !isTimeout && option === quest.a;
  roomState.lastActive = Date.now();
  
  if (isCorrect) {
    const damage = roomState.stage === 3 ? 30 : 20;
    roomState.monsterHp = Math.max(roomState.monsterHp - damage, 0);
    roomState.combatLog.unshift(`⚔️ ${player.name} acertou! Golpe de ${damage} no monstro.`);
    
    // Combo Counter
    player.consecutiveCorrect = (player.consecutiveCorrect || 0) + 1;
    let revivedPlayerId = null;
    let revivedPlayerName = '';

    if (player.consecutiveCorrect === 4) {
      player.consecutiveCorrect = 0; // reset
      const deadEntry = Object.entries(roomState.players).find(([id, p]) => p.hp === 0);
      if (deadEntry) {
        const [deadId, deadPlayer] = deadEntry;
        deadPlayer.hp = 50; // Revived with 50 HP!
        deadPlayer.consecutiveCorrect = 0;
        revivedPlayerId = deadId;
        revivedPlayerName = deadPlayer.name;
        roomState.combatLog.unshift(`😇 RESSURREIÇÃO! ${player.name} acertou 4 seguidas e reviveu ${deadPlayer.name} com 50 HP!`);
      }
    }

    if (revivedPlayerId) {
      roomState.actionTrigger = {
        type: 'revive',
        playerId: revivedPlayerId,
        playerName: revivedPlayerName,
        damage: 0,
        target: 'player',
        timestamp: Date.now()
      };
    } else {
      roomState.actionTrigger = {
        type: 'attack',
        playerId,
        playerName: player.name,
        damage,
        target: 'monster',
        timestamp: Date.now()
      };
    }
    
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
    player.consecutiveCorrect = 0; // Reset combo counter on wrong answer or timeout!
    const damage = isTimeout
      ? (roomState.stage === 1 ? 5 : roomState.stage === 2 ? 10 : 15)
      : (roomState.stage === 1 ? 15 : roomState.stage === 2 ? 20 : 25);
    player.hp = Math.max(player.hp - damage, 0);
    
    if (isTimeout) {
      roomState.combatLog.unshift(`⏰ Tempo esgotado para ${player.name}! Recebeu ${damage} de dano do monstro.`);
    } else {
      roomState.combatLog.unshift(`💥 ${player.name} errou e recebeu ${damage} de dano.`);
    }
    
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
  
  roomState.currentQuests[playerId] = getNewQuestion(roomState.stage);
  
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

// Admin Endpoint: Delete/Kill an active game room
router.delete('/games/active/:roomCode', verifyToken, verifyAdmin, (req, res) => {
  const { roomCode } = req.params;
  const upperCode = (roomCode || '').trim().toUpperCase();
  
  const deleted = gameRooms.delete(upperCode);
  gameInvites.delete(upperCode);
  
  if (deleted) {
    res.status(200).json({ message: `Sala ${upperCode} encerrada com sucesso!` });
  } else {
    res.status(404).json({ error: 'Sala não encontrada ou já encerrada.' });
  }
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
        avatar: (hostName || 'Aluno').substring(0, 2).toUpperCase(),
        consecutiveCorrect: 0
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
    avatar: (guestName || 'Convidado').substring(0, 2).toUpperCase(),
    consecutiveCorrect: 0
  };
  
  roomState.currentQuests[guestId] = getNewQuestion(roomState.stage);
  roomState.combatLog.push(`${guestName} aceitou o convite e entrou no combate!`);
  roomState.lastActive = Date.now();
  
  gameInvites.delete(upperCode);
  
  res.status(200).json({ roomCode: upperCode, state: roomState });
});

// Decline or cancel invite/room
router.post('/games/invite/decline', verifyToken, (req, res) => {
  const { roomCode } = req.body;
  const userId = String(req.user.id);
  const upperCode = (roomCode || '').trim().toUpperCase();
  
  const invite = gameInvites.get(upperCode);
  const room = gameRooms.get(upperCode);

  if (invite) {
    if (invite.guestId === userId || invite.hostId === userId) {
      invite.status = 'declined';
      gameInvites.delete(upperCode);
      gameRooms.delete(upperCode);
      return res.status(200).json({ message: 'Sala e convite removidos com sucesso.' });
    }
  } else if (room) {
    // If it's a room created without direct invite (code sharing)
    // and the player is the host (the only player in the room)
    const isHost = room.players[userId] !== undefined && Object.keys(room.players).length === 1;
    if (isHost) {
      gameRooms.delete(upperCode);
      return res.status(200).json({ message: 'Sala removida com sucesso.' });
    }
  }
  
  // Also, if room exists, we can delete it if it has only the host
  if (room && Object.keys(room.players).length === 1 && room.players[userId]) {
    gameRooms.delete(upperCode);
  }

  res.status(200).json({ message: 'Operação concluída.' });
});

// Leave active coop room
router.post('/games/leave', verifyToken, (req, res) => {
  const { roomCode } = req.body;
  const upperCode = (roomCode || '').trim().toUpperCase();
  const roomState = gameRooms.get(upperCode);
  
  if (roomState) {
    // Delete the room and invite so it clears memory and triggers 404 for other player
    gameRooms.delete(upperCode);
    gameInvites.delete(upperCode);
  }
  
  res.status(200).json({ message: 'Você saiu da partida e a sala foi encerrada.' });
});
