import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Chip,
  Alert,
  IconButton,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import apiClient from '../../utils/apiClient';

// ─── Sprite Data 16x16 Matrices ──────────────────────────────────────────────────

const SPRITE_KNIGHT_STAND = [
  "....kkkk........",
  "...kbbbbk.......",
  "..kbccccbk......",
  "..kbcppccbk.....",
  "..kbcppppbk.....",
  "...kbbbbk.......",
  "....kddk........",
  "...kbbbbk.kkk...",
  "..kbddddbkkggk..",
  "..kbddddbkggk...",
  "..kbddddbkkk....",
  "...kbbbbk.......",
  "....kddk........",
  "...kddddk.......",
  "..kkddddkk......",
  "..kk.kk.kk......"
];

const SPRITE_KNIGHT_ATTACK = [
  "....kkkk........",
  "...kbbbbk.......",
  "..kbccccbk......",
  "..kbcppccbk.....",
  "..kbcppppbk.....",
  "...kbbbbk.......",
  "....kddk........",
  "...kbbbbk.......",
  "..kbddddbkkkkkk.",
  "..kbddddbkgggggk",
  "..kbddddbkkkkkk.",
  "...kbbbbk.......",
  "....kddk........",
  "...kddddk.......",
  "..kkddddkk......",
  "..kk.kk.kk......"
];

const SPRITE_SLIME = [
  "................",
  "................",
  "......kkkk......",
  "....kkmmmmkk....",
  "...kmmmmmmmmk...",
  "..kmmmmmmmmmmk..",
  ".kmmmkkmmkkmmmk.",
  ".kmmkkkkkkkkmkk.",
  ".kmmmmmmmmmmmmk.",
  ".kmmmmmmmmmmmmk.",
  "..kmmmmmmmmmmk..",
  "...kkkkkkkkkk...",
  "................",
  "................",
  "................",
  "................"
];

const SPRITE_SKELETON = [
  "....kkkkk.......",
  "...keeeeek......",
  "..keeeeeeek.....",
  "..kerererek.....",
  "..keeeeeeek.....",
  "...keeeeek......",
  "....keeek.......",
  "....keeek.......",
  "...keeeeek......",
  "..keeeeeeek.....",
  "..keeeeeeek.....",
  "...keeeeek......",
  "....keeek.......",
  "...keeeeek......",
  "..keeeeeeek.....",
  "..kk..k..kk....."
];

const SPRITE_DRAGON = [
  "......kkkkkk....",
  "....kkddddddkk..",
  "...kddddddddddk.",
  "..kdddrrddrrddk.",
  "..kdddddddddddk.",
  "..kddddkkkkdddk.",
  "...kdddddddddk.",
  "....kkdddddkk...",
  ".....kdddddk.kk.",
  "....kdddddddkkkk",
  "...kdddddddddkk.",
  "..kddddddddddk..",
  "..kddddddddddk..",
  "...kddddddddk...",
  "....kk...kk.....",
  "....kk...kk....."
];

// ─── Web Audio API Sound FX Synth ───────────────────────────────────────────────

const playRetroSound = (type, soundOn = true) => {
  if (!soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start();
      osc.stop(now + 0.2);
    } else if (type === 'slash') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.start();
      osc.stop(now + 0.22);
    } else if (type === 'victory') {
      osc.type = 'square';
      gain.gain.setValueAtTime(0.08, now);
      
      osc.frequency.setValueAtTime(261.63, now);
      osc.frequency.setValueAtTime(329.63, now + 0.08);
      osc.frequency.setValueAtTime(392.00, now + 0.16);
      osc.frequency.setValueAtTime(523.25, now + 0.24);
      osc.frequency.setValueAtTime(659.25, now + 0.32);
      osc.frequency.setValueAtTime(783.99, now + 0.40);
      osc.frequency.setValueAtTime(1046.50, now + 0.48);
      
      gain.gain.linearRampToValueAtTime(0.01, now + 0.7);
      osc.start();
      osc.stop(now + 0.7);
    } else if (type === 'defeat') {
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.12, now);
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.6);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.start();
      osc.stop(now + 0.6);
    }
  } catch (e) {
    console.warn('Web Audio blocked or unsupported', e);
  }
};

// ─── Drawing Helper ─────────────────────────────────────────────────────────────

const drawSprite = (ctx, sprite, x, y, scale = 4, isFlipped = false) => {
  const colors = {
    '.': null,
    'k': '#000000',
    'w': '#ffffff',
    'g': '#94a3b8',
    'd': '#475569',
    'p': '#ffb5a7',
    'b': '#1d3557',
    'c': '#00b4d8',
    'r': '#ff5a79',
    'y': '#ffb74d',
    'm': '#48c78e',
    's': '#0d4b2e',
    'e': '#e2e8f0'
  };
  
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const char = sprite[r]?.[c] || '.';
      const color = colors[char];
      if (color) {
        ctx.fillStyle = color;
        const drawX = isFlipped ? x + (15 - c) * scale : x + c * scale;
        ctx.fillRect(drawX, y + r * scale, scale, scale);
      }
    }
  }
};

// ─── 1. Word Search Dynamic Generation ──────────────────────────────────────────

const WORD_SEARCH_THEMES = {
  animals: {
    name: "🦁 Animals (Animais)",
    words: ["CAT", "DOG", "LION", "BIRD", "FISH", "BEAR", "FROG", "WOLF"]
  },
  colors: {
    name: "🎨 Colors (Cores)",
    words: ["BLUE", "RED", "GREEN", "PINK", "GREY", "GOLD", "BLACK"]
  },
  verbs: {
    name: "🏃 Action Verbs (Verbos)",
    words: ["RUN", "WALK", "TALK", "SING", "JUMP", "READ", "PLAY", "LOVE"]
  }
};

const generateWordGrid = (words, size = 10) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const directions = [
    [0, 1],   // horizontal right
    [1, 0],   // vertical down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
  ];

  words.forEach(word => {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 150) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * size);
      const startCol = Math.floor(Math.random() * size);

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = startRow + dir[0] * i;
        const c = startCol + dir[1] * i;
        if (r < 0 || r >= size || c < 0 || c >= size) {
          fits = false;
          break;
        }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dir[0] * i;
          const c = startCol + dir[1] * i;
          grid[r][c] = word[i];
        }
        placed = true;
      }
    }
  });

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return grid;
};

// ─── 2. Pixel Word Battle Questions ─────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────────────────────

export default function GamesZone({ userId, userName, onEarnXP }) {
  const [activeGame, setActiveGame] = useState(null); // 'wordsearch' | 'battle' | null
  const [soundOn, setSoundOn] = useState(true);

  // --- Word Search States ---
  const [wsTheme, setWsTheme] = useState('animals');
  const [wsGrid, setWsGrid] = useState([]);
  const [wsWords, setWsWords] = useState([]);
  const [wsFoundWords, setWsFoundWords] = useState([]);
  const [wsCompleted, setWsCompleted] = useState(false);
  const [wsMessage, setWsMessage] = useState('');
  const [wsMessageSeverity, setWsMessageSeverity] = useState('info');
  const [wsMode, setWsMode] = useState('ends');
  const [showWsTutorial, setShowWsTutorial] = useState(true);
  const [wsStartCell, setWsStartCell] = useState(null);
  const [wsSelectedCells, setWsSelectedCells] = useState([]);
  const [wsFoundCells, setWsFoundCells] = useState([]);

  // --- RPG Battle Mode (Solo vs Co-op) ---
  const [rpgMode, setRpgMode] = useState(null); // 'solo' | 'coop' | null (lobby choice)
  const [coopSubState, setCoopSubState] = useState('choice'); // 'choice' | 'create' | 'join' | 'play'
  const [roomCode, setRoomCode] = useState('');
  const [coopError, setCoopError] = useState('');
  
  // --- RPG Co-op Invitation States ---
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isInvitingPlayerId, setIsInvitingPlayerId] = useState(null);
  const [invitedPlayerName, setInvitedPlayerName] = useState('');

  // --- Shared Battle States ---
  const [battleStage, setBattleStage] = useState(1);
  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(60);
  const [maxEnemyHp, setMaxEnemyHp] = useState(60);
  const [battleLog, setBattleLog] = useState([]);
  const [currentQuestIdx, setCurrentQuestIdx] = useState(0);
  const [battleStatus, setBattleStatus] = useState('active');
  const [coopPlayers, setCoopPlayers] = useState({});

  const canvasRef = useRef(null);
  
  // Animation coordinates and states
  const animRef = useRef({
    heroX: 50,          // Solo hero position
    hero1X: 30,         // Co-op Player 1 position
    hero2X: 75,         // Co-op Player 2 position
    enemyX: 280,
    heroState: 'stand', // Solo state
    hero1State: 'stand',// Co-op player 1 state
    hero2State: 'stand',// Co-op player 2 state
    enemyState: 'stand',
    particles: [],
    damageTexts: [],
    shakeAmount: 0
  });

  const lastProcessedTriggerTime = useRef(0);

  const showFeedback = (text, severity = 'info') => {
    setWsMessage(text);
    setWsMessageSeverity(severity);
  };

  // Start Word Search
  const startWordSearch = (themeKey) => {
    playRetroSound('select', soundOn);
    const theme = WORD_SEARCH_THEMES[themeKey];
    setWsTheme(themeKey);
    setWsWords(theme.words);
    setWsFoundWords([]);
    setWsStartCell(null);
    setWsSelectedCells([]);
    setWsFoundCells([]);
    setWsCompleted(false);
    setWsGrid(generateWordGrid(theme.words, 10));
    setShowWsTutorial(true);
    setActiveGame('wordsearch');
  };

  // ─── Word Search click mechanisms ──────────────────────────────────────────

  const handleCellClick = (r, c) => {
    if (wsCompleted) return;
    if (wsMode === 'sequence') {
      handleCellClickSequence(r, c);
    } else {
      handleCellClickEnds(r, c);
    }
  };

  const handleCellClickEnds = (r, c) => {
    playRetroSound('select', soundOn);

    if (wsStartCell === null) {
      setWsStartCell({ r, c });
      showFeedback('Letra inicial selecionada. Agora clique na letra final!', 'info');
    } else {
      const start = wsStartCell;
      const end = { r, c };

      const diffR = end.r - start.r;
      const diffC = end.c - start.c;
      const dist = Math.max(Math.abs(diffR), Math.abs(diffC));

      let isStraight = false;
      let stepR = 0;
      let stepC = 0;

      if (diffR === 0 && diffC !== 0) {
        isStraight = true;
        stepC = diffC > 0 ? 1 : -1;
      } else if (diffC === 0 && diffR !== 0) {
        isStraight = true;
        stepR = diffR > 0 ? 1 : -1;
      } else if (Math.abs(diffR) === Math.abs(diffC) && diffR !== 0) {
        isStraight = true;
        stepR = diffR > 0 ? 1 : -1;
        stepC = diffC > 0 ? 1 : -1;
      }

      if (isStraight) {
        let selectedWord = '';
        const cellsInLine = [];
        for (let i = 0; i <= dist; i++) {
          const currR = start.r + stepR * i;
          const currC = start.c + stepC * i;
          selectedWord += wsGrid[currR][currC];
          cellsInLine.push(`${currR}-${currC}`);
        }

        const reversedWord = selectedWord.split('').reverse().join('');
        let foundWordMatch = null;

        if (wsWords.includes(selectedWord) && !wsFoundWords.includes(selectedWord)) {
          foundWordMatch = selectedWord;
        } else if (wsWords.includes(reversedWord) && !wsFoundWords.includes(reversedWord)) {
          foundWordMatch = reversedWord;
        }

        if (foundWordMatch) {
          playRetroSound('victory', soundOn);
          setWsFoundWords(prev => {
            const next = [...prev, foundWordMatch];
            if (next.length === wsWords.length) {
              setWsCompleted(true);
              onEarnXP(100);
              showFeedback('🏆 Parabéns! Você encontrou todas as palavras e ganhou +100 XP!', 'success');
            } else {
              showFeedback(`Perfeito! Você achou a palavra "${foundWordMatch}"!`, 'success');
            }
            return next;
          });
          setWsFoundCells(prev => [...prev, ...cellsInLine]);
        } else {
          playRetroSound('hit', soundOn);
          showFeedback('Nenhuma palavra da lista corresponde a essa seleção.', 'warning');
        }
      } else {
        playRetroSound('hit', soundOn);
        showFeedback('Seleção inválida! Escolha letras alinhadas horizontalmente, verticalmente ou diagonalmente.', 'error');
      }
      setWsStartCell(null);
    }
  };

  const handleCellClickSequence = (r, c) => {
    playRetroSound('select', soundOn);
    
    const pathIndex = wsSelectedCells.findIndex(cell => cell.r === r && cell.c === c);

    if (pathIndex !== -1) {
      if (pathIndex === wsSelectedCells.length - 1) {
        setWsSelectedCells(prev => prev.slice(0, -1));
        const updatedCells = wsSelectedCells.slice(0, -1);
        const currentWord = updatedCells.map(cell => wsGrid[cell.r][cell.c]).join('');
        showFeedback(updatedCells.length > 0 ? `Soletrando: ${currentWord}` : 'Selecione uma letra para começar!', 'info');
      } else {
        showFeedback('Para desmarcar, clique na última letra selecionada!', 'warning');
      }
    } else {
      if (wsSelectedCells.length === 0) {
        setWsSelectedCells([{ r, c }]);
        showFeedback(`Soletrando: ${wsGrid[r][c]}`, 'info');
      } else {
        const last = wsSelectedCells[wsSelectedCells.length - 1];
        const isAdjacent = Math.abs(r - last.r) <= 1 && Math.abs(c - last.c) <= 1;
        if (isAdjacent) {
          const nextCells = [...wsSelectedCells, { r, c }];
          setWsSelectedCells(nextCells);
          const currentWord = nextCells.map(cell => wsGrid[cell.r][cell.c]).join('');
          showFeedback(`Soletrando: ${currentWord}`, 'info');
        } else {
          playRetroSound('hit', soundOn);
          showFeedback('Selecione apenas letras adjacentes!', 'error');
        }
      }
    }
  };

  const validateSequenceWord = () => {
    if (wsSelectedCells.length === 0) return;
    
    const selectedWord = wsSelectedCells.map(cell => wsGrid[cell.r][cell.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    let foundWordMatch = null;

    if (wsWords.includes(selectedWord) && !wsFoundWords.includes(selectedWord)) {
      foundWordMatch = selectedWord;
    } else if (wsWords.includes(reversedWord) && !wsFoundWords.includes(reversedWord)) {
      foundWordMatch = reversedWord;
    }

    if (foundWordMatch) {
      playRetroSound('victory', soundOn);
      setWsFoundWords(prev => {
        const next = [...prev, foundWordMatch];
        if (next.length === wsWords.length) {
          setWsCompleted(true);
          onEarnXP(100);
          showFeedback('🏆 Sensacional! Você encontrou todas as palavras e ganhou +100 XP!', 'success');
        } else {
          showFeedback(`Boa! Você encontrou a palavra "${foundWordMatch}"!`, 'success');
        }
        return next;
      });
      const formattedCellCoords = wsSelectedCells.map(cell => `${cell.r}-${cell.c}`);
      setWsFoundCells(prev => [...prev, ...formattedCellCoords]);
    } else {
      playRetroSound('hit', soundOn);
      showFeedback(`A palavra "${selectedWord}" não é válida ou já foi encontrada!`, 'error');
    }
    setWsSelectedCells([]);
  };

  const clearSequenceSelection = () => {
    playRetroSound('select', soundOn);
    setWsSelectedCells([]);
    showFeedback('Seleção redefinida.', 'info');
  };

  // ─── Co-op RPG Room Creation and Joining ──────────────────────────────────────

  const handleSendInvite = async (guestId, guestName) => {
    playRetroSound('select', soundOn);
    setCoopError('');
    setIsInvitingPlayerId(guestId);
    setInvitedPlayerName(guestName);
    try {
      const response = await apiClient.post('/games/invite', {
        guestId: String(guestId),
        hostName: userName || 'Aluno'
      });
      const data = response.data;
      setRoomCode(data.roomCode);
      setCoopPlayers(data.state.players);
      setBattleLog(data.state.combatLog);
      setEnemyHp(data.state.monsterHp);
      setMaxEnemyHp(data.state.maxMonsterHp);
      setCoopSubState('create');
    } catch (err) {
      setCoopError('Falha ao enviar convite. ' + (err.response?.data?.error || err.message));
    } finally {
      setIsInvitingPlayerId(null);
    }
  };

  const handleAcceptInvite = async (invite) => {
    playRetroSound('select', soundOn);
    setCoopError('');
    try {
      const response = await apiClient.post('/games/invite/accept', {
        roomCode: invite.roomCode,
        guestName: userName || 'Aluno'
      });
      const data = response.data;
      setRoomCode(data.roomCode);
      setCoopPlayers(data.state.players);
      setBattleLog(data.state.combatLog);
      setEnemyHp(data.state.monsterHp);
      setMaxEnemyHp(data.state.maxMonsterHp);
      setBattleStage(data.state.stage);
      setBattleStatus(data.state.status);
      
      const pQuests = data.state.currentQuests || {};
      const myQuest = pQuests[userId] || { idx: 0 };
      setCurrentQuestIdx(myQuest.idx);
      
      setRpgMode('coop');
      setCoopSubState('play');
      setPendingInvites([]);
    } catch (err) {
      setCoopError('Falha ao aceitar convite. ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeclineInvite = async (invite) => {
    playRetroSound('select', soundOn);
    try {
      await apiClient.post('/games/invite/decline', {
        roomCode: invite.roomCode
      });
      setPendingInvites(prev => prev.filter(inv => inv.roomCode !== invite.roomCode));
    } catch (err) {
      console.error('Error declining invite:', err);
    }
  };

  const fetchAvailablePlayers = async () => {
    try {
      const response = await apiClient.get('/games/players');
      setAvailablePlayers(response.data);
    } catch (err) {
      console.error('Error fetching available players:', err);
    }
  };

  // Poll for available players in lobby
  useEffect(() => {
    if (activeGame === 'battle' && rpgMode === 'coop' && coopSubState === 'choice') {
      fetchAvailablePlayers();
      const interval = setInterval(fetchAvailablePlayers, 8000);
      return () => clearInterval(interval);
    }
  }, [activeGame, rpgMode, coopSubState]);

  // Poll pending invites
  useEffect(() => {
    if (activeGame !== 'battle' || battleStatus !== 'active' || (rpgMode === 'coop' && coopSubState === 'play')) return;

    const checkInvites = async () => {
      try {
        const response = await apiClient.get('/games/invites/pending');
        setPendingInvites(response.data);
      } catch (err) {
        console.warn('Error fetching pending invites:', err.message);
      }
    };

    checkInvites();
    const inviteInterval = setInterval(checkInvites, 3000);
    return () => clearInterval(inviteInterval);
  }, [activeGame, rpgMode, coopSubState, battleStatus]);

  const handleCreateCoopRoom = async () => {
    playRetroSound('select', soundOn);
    setCoopError('');
    try {
      const response = await apiClient.post('/games/create', {
        playerId: String(userId),
        playerName: userName || 'Aluno'
      });
      const data = response.data;
      setRoomCode(data.roomCode);
      setCoopPlayers(data.state.players);
      setBattleLog(data.state.combatLog);
      setEnemyHp(data.state.monsterHp);
      setMaxEnemyHp(data.state.maxMonsterHp);
      setCoopSubState('create');
    } catch (err) {
      setCoopError('Falha ao criar sala. ' + (err.response?.data?.error || err.message));
    }
  };

  const handleJoinCoopRoom = async (codeToJoin) => {
    playRetroSound('select', soundOn);
    setCoopError('');
    if (!codeToJoin || codeToJoin.trim().length !== 4) {
      setCoopError('Código da sala deve conter exatamente 4 letras!');
      return;
    }
    try {
      const response = await apiClient.post('/games/join', {
        roomCode: codeToJoin.trim().toUpperCase(),
        playerId: String(userId),
        playerName: userName || 'Aluno'
      });
      const data = response.data;
      setRoomCode(data.roomCode);
      setCoopPlayers(data.state.players);
      setBattleLog(data.state.combatLog);
      setEnemyHp(data.state.monsterHp);
      setMaxEnemyHp(data.state.maxMonsterHp);
      setBattleStage(data.state.stage);
      setBattleStatus(data.state.status);
      
      const pQuests = data.state.currentQuests || {};
      const myQuest = pQuests[userId] || { idx: 0 };
      setCurrentQuestIdx(myQuest.idx);
      
      setCoopSubState('play');
    } catch (err) {
      setCoopError('Falha ao entrar na sala. ' + (err.response?.data?.error || err.message));
    }
  };

  // ─── RPG Battle Game Sync Polling ──────────────────────────────────────────

  // Co-op Polling Status Loop
  useEffect(() => {
    if (activeGame !== 'battle' || rpgMode !== 'coop' || coopSubState === 'choice' || battleStatus !== 'active') return;

    let pollInterval = setInterval(async () => {
      try {
        const response = await apiClient.get(`/games/status/${roomCode}`);
        const state = response.data.state;

        setCoopPlayers(state.players);
        setBattleLog(state.combatLog);
        setEnemyHp(state.monsterHp);
        setMaxEnemyHp(state.maxMonsterHp);
        setBattleStage(state.stage);
        setBattleStatus(state.status);

        // Fetch my current question
        const myQuest = state.currentQuests?.[userId];
        if (myQuest) {
          setCurrentQuestIdx(myQuest.idx);
        }

        // Sync visual trigger events on screen
        const trigger = state.actionTrigger;
        if (trigger && trigger.timestamp > lastProcessedTriggerTime.current) {
          lastProcessedTriggerTime.current = trigger.timestamp;
          
          // Animate attack locally
          const pIds = Object.keys(state.players);
          const isPlayer1 = pIds[0] === trigger.playerId;
          
          if (trigger.target === 'monster') {
            triggerAttackSync(true, isPlayer1, trigger.playerName, trigger.damage);
          } else {
            triggerAttackSync(false, isPlayer1, trigger.playerName, trigger.damage);
          }
        }

        if (state.status === 'victory') {
          animRef.current.hero1State = 'victory';
          animRef.current.hero2State = 'victory';
          playRetroSound('victory', soundOn);
          onEarnXP(100);
          clearInterval(pollInterval);
        } else if (state.status === 'defeat') {
          animRef.current.hero1State = 'defeat';
          animRef.current.hero2State = 'defeat';
          playRetroSound('defeat', soundOn);
          clearInterval(pollInterval);
        }

        // Switch to play view once player 2 enters
        if (coopSubState === 'create' && Object.keys(state.players).length === 2) {
          setCoopSubState('play');
        }

      } catch (err) {
        console.warn('Lobby sync error:', err.message);
      }
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [activeGame, rpgMode, coopSubState, roomCode, battleStatus]);

  // RPG Combat Submission Action (Solo vs Co-op)
  const handleRpgAnswerSubmit = async (option) => {
    if (battleStatus !== 'active') return;

    if (rpgMode === 'coop') {
      // Send co-op action to express in-memory engine
      try {
        const response = await apiClient.post('/games/action', {
          roomCode,
          playerId: String(userId),
          option,
          questionIdx: currentQuestIdx
        });
        const state = response.data.state;
        
        setCoopPlayers(state.players);
        setBattleLog(state.combatLog);
        setEnemyHp(state.monsterHp);
        setMaxEnemyHp(state.maxMonsterHp);
        setBattleStage(state.stage);
        setBattleStatus(state.status);
        
        // Fetch new question from response immediately
        const myQuest = state.currentQuests?.[userId];
        if (myQuest) {
          setCurrentQuestIdx(myQuest.idx);
        }
      } catch (err) {
        console.error('Action submission error:', err.message);
      }
    } else {
      // Solo mode logic
      const q = BATTLE_QUESTIONS[currentQuestIdx];
      const state = animRef.current;

      if (option === q.a) {
        triggerSoloAttackAnimation(true);
        const damage = battleStage === 3 ? 30 : 20;
        const newEnemyHp = Math.max(enemyHp - damage, 0);
        setEnemyHp(newEnemyHp);
        setBattleLog(prev => [`⚔️ Você acertou! Desferiu golpe de ${damage} no monstro.`, ...prev]);

        if (newEnemyHp === 0) {
          if (battleStage < 3) {
            setTimeout(() => {
              const nextStage = battleStage + 1;
              const nextMaxHp = nextStage === 2 ? 80 : 120;
              setBattleStage(nextStage);
              setEnemyHp(nextMaxHp);
              setMaxEnemyHp(nextMaxHp);
              playRetroSound('victory', soundOn);
              setBattleLog(prev => [`🎉 Estágio ${battleStage} vencido! Nova ameaça surge...`, ...prev]);
              animRef.current.enemyX = 280;
              animRef.current.enemyState = 'stand';
            }, 1000);
          } else {
            setBattleStatus('victory');
            state.heroState = 'victory';
            playRetroSound('victory', soundOn);
            onEarnXP(100);
          }
        }
      } else {
        triggerSoloAttackAnimation(false);
        const damage = battleStage === 1 ? 15 : battleStage === 2 ? 20 : 25;
        const newHeroHp = Math.max(heroHp - damage, 0);
        setHeroHp(newHeroHp);
        setBattleLog(prev => [`💥 Resposta errada! Monstro causou ${damage} de dano.`, ...prev]);

        if (newHeroHp === 0) {
          setBattleStatus('defeat');
          state.heroState = 'defeat';
          playRetroSound('defeat', soundOn);
        }
      }

      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * BATTLE_QUESTIONS.length);
      } while (nextIdx === currentQuestIdx && BATTLE_QUESTIONS.length > 1);
      setCurrentQuestIdx(nextIdx);
    }
  };

  // Co-op Sync Animation Trigger
  const triggerAttackSync = (isHeroAttacking, isPlayer1, pName, dmg) => {
    const state = animRef.current;
    if (isHeroAttacking) {
      playRetroSound('slash', soundOn);
      if (isPlayer1) state.hero1State = 'attack';
      else state.hero2State = 'attack';
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step <= 6) {
          if (isPlayer1) state.hero1X += 20;
          else state.hero2X += 20;
        } else if (step <= 10) {
          if (step === 7) {
            state.enemyState = 'hurt';
            // Sparks
            for (let i = 0; i < 15; i++) {
              state.particles.push({
                x: state.enemyX + 24,
                y: 75 + Math.random() * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: 3 + Math.random() * 3,
                color: '#00b4d8',
                life: 15 + Math.floor(Math.random() * 10)
              });
            }
            state.damageTexts.push({
              text: `-${dmg} HP`,
              x: state.enemyX + 10,
              y: 50,
              color: '#ff5a79',
              life: 30
            });
          }
        } else if (step <= 16) {
          if (isPlayer1) state.hero1X -= 20;
          else state.hero2X -= 20;
        } else {
          state.hero1State = 'stand';
          state.hero2State = 'stand';
          state.enemyState = 'stand';
          clearInterval(interval);
        }
      }, 25);
    } else {
      playRetroSound('hit', soundOn);
      state.enemyState = 'attack';
      state.shakeAmount = 12;
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step <= 6) {
          state.enemyX -= 20;
        } else if (step <= 10) {
          if (step === 7) {
            if (isPlayer1) state.hero1State = 'hurt';
            else state.hero2State = 'hurt';
            
            const targetX = isPlayer1 ? state.hero1X : state.hero2X;
            for (let i = 0; i < 15; i++) {
              state.particles.push({
                x: targetX + 24,
                y: 70 + Math.random() * 30,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: 3 + Math.random() * 3,
                color: '#ff5a79',
                life: 15 + Math.floor(Math.random() * 10)
              });
            }
            state.damageTexts.push({
              text: `-${dmg} HP (${pName.substring(0,6)})`,
              x: targetX + 10,
              y: 45,
              color: '#ff3b30',
              life: 30
            });
          }
        } else if (step <= 16) {
          state.enemyX += 20;
        } else {
          state.enemyState = 'stand';
          state.hero1State = 'stand';
          state.hero2State = 'stand';
          clearInterval(interval);
        }
      }, 25);
    }
  };

  // Solo Animation Trigger
  const triggerSoloAttackAnimation = (isHeroAttacking) => {
    const state = animRef.current;
    if (isHeroAttacking) {
      playRetroSound('slash', soundOn);
      state.heroState = 'attack';
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step <= 6) {
          state.heroX += 20;
        } else if (step <= 10) {
          if (step === 7) {
            state.enemyState = 'hurt';
            for (let i = 0; i < 20; i++) {
              state.particles.push({
                x: state.enemyX + 24,
                y: 75 + Math.random() * 30,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                size: 3 + Math.random() * 3,
                color: '#00b4d8',
                life: 15 + Math.floor(Math.random() * 12)
              });
            }
            state.damageTexts.push({
              text: `-${battleStage === 3 ? 30 : 20} HP`,
              x: state.enemyX + 10,
              y: 50,
              color: '#ff5a79',
              life: 35
            });
          }
        } else if (step <= 16) {
          state.heroX -= 20;
        } else {
          state.heroState = 'stand';
          state.enemyState = 'stand';
          clearInterval(interval);
        }
      }, 25);
    } else {
      playRetroSound('hit', soundOn);
      state.enemyState = 'attack';
      state.shakeAmount = 15;
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step <= 6) {
          state.enemyX -= 20;
        } else if (step <= 10) {
          if (step === 7) {
            state.heroState = 'hurt';
            for (let i = 0; i < 20; i++) {
              state.particles.push({
                x: state.heroX + 24,
                y: 70 + Math.random() * 30,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                size: 3 + Math.random() * 3,
                color: '#ff5a79',
                life: 15 + Math.floor(Math.random() * 12)
              });
            }
            state.damageTexts.push({
              text: `-${battleStage === 1 ? 15 : battleStage === 2 ? 20 : 25} HP`,
              x: state.heroX + 10,
              y: 45,
              color: '#ff3b30',
              life: 35
            });
          }
        } else if (step <= 16) {
          state.enemyX += 20;
        } else {
          state.enemyState = 'stand';
          state.heroState = 'stand';
          clearInterval(interval);
        }
      }, 25);
    }
  };

  // Canvas loop registration
  useEffect(() => {
    if (activeGame !== 'battle' || !canvasRef.current || (rpgMode === 'coop' && coopSubState === 'choice')) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const renderLoop = () => {
      const state = animRef.current;

      ctx.save();
      if (state.shakeAmount > 0) {
        const dx = (Math.random() - 0.5) * state.shakeAmount;
        const dy = (Math.random() - 0.5) * state.shakeAmount;
        ctx.translate(dx, dy);
        state.shakeAmount *= 0.9;
        if (state.shakeAmount < 0.5) state.shakeAmount = 0;
      }

      ctx.fillStyle = '#060a13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(30, 20, 2, 2);
      ctx.fillRect(90, 45, 2, 2);
      ctx.fillRect(170, 15, 2, 2);
      ctx.fillRect(250, 40, 2, 2);
      ctx.fillRect(340, 25, 2, 2);

      // Glowing cosmic moon
      ctx.fillStyle = 'rgba(0, 180, 216, 0.08)';
      ctx.beginPath();
      ctx.arc(320, 40, 30, 0, Math.PI * 2);
      ctx.fill();

      // Ground (Retro Grass)
      ctx.fillStyle = '#052316';
      ctx.fillRect(0, 120, canvas.width, canvas.height - 120);
      ctx.fillStyle = '#48c78e';
      ctx.fillRect(0, 120, canvas.width, 3);

      const bob = Math.sin(Date.now() / 150) * 3;

      if (rpgMode === 'coop') {
        // Draw Player 1
        const p1Hp = Object.values(coopPlayers)[0]?.hp ?? 100;
        let p1Y = 60 + (state.hero1State === 'stand' ? bob : 0);
        let p1Sprite = SPRITE_KNIGHT_STAND;
        if (state.hero1State === 'attack') p1Sprite = SPRITE_KNIGHT_ATTACK;
        if (p1Hp === 0) {
          p1Sprite = SPRITE_KNIGHT_STAND;
          p1Y = 85;
        }
        
        let flashP1 = state.hero1State === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
        ctx.save();
        if (flashP1) ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
        drawSprite(ctx, p1Sprite, state.hero1X, p1Y, 3.2, false);
        ctx.restore();

        // Draw Player 2 (if present)
        if (Object.keys(coopPlayers).length > 1) {
          const p2Hp = Object.values(coopPlayers)[1]?.hp ?? 100;
          let p2Y = 68 + (state.hero2State === 'stand' ? -bob : 0);
          let p2Sprite = SPRITE_KNIGHT_STAND;
          if (state.hero2State === 'attack') p2Sprite = SPRITE_KNIGHT_ATTACK;
          if (p2Hp === 0) {
            p2Sprite = SPRITE_KNIGHT_STAND;
            p2Y = 90;
          }

          let flashP2 = state.hero2State === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
          ctx.save();
          if (flashP2) ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
          drawSprite(ctx, p2Sprite, state.hero2X, p2Y, 3.2, false);
          ctx.restore();
        }
      } else {
        // Draw Solo Knight
        let heroY = 60 + (state.heroState === 'stand' ? bob : 0);
        let heroSprite = SPRITE_KNIGHT_STAND;
        if (state.heroState === 'attack') heroSprite = SPRITE_KNIGHT_ATTACK;
        if (state.heroState === 'defeat') {
          heroSprite = SPRITE_KNIGHT_STAND;
          heroY = 85;
        }
        
        let flashHero = state.heroState === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
        ctx.save();
        if (flashHero) ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
        drawSprite(ctx, heroSprite, state.heroX, heroY, 3.5, false);
        ctx.restore();
      }

      // Draw Monster
      if (enemyHp > 0) {
        let enemyY = 65 + (state.enemyState === 'stand' ? -bob : 0);
        let enemySprite = SPRITE_SLIME;
        if (battleStage === 2) enemySprite = SPRITE_SKELETON;
        if (battleStage === 3) enemySprite = SPRITE_DRAGON;

        let flashEnemy = state.enemyState === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
        ctx.save();
        if (flashEnemy) ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
        drawSprite(ctx, enemySprite, state.enemyX, enemyY, 3.5, true);
        ctx.restore();
        
        // Monster HP Bar
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(state.enemyX, enemyY - 15, 56, 6);
        ctx.fillStyle = '#ff5a79';
        ctx.fillRect(state.enemyX, enemyY - 15, (enemyHp / maxEnemyHp) * 56, 6);
      }

      // Draw Player HP Bars above characters
      if (rpgMode === 'coop') {
        const p1 = Object.values(coopPlayers)[0];
        if (p1) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(state.hero1X, 48, 48, 5);
          ctx.fillStyle = '#48c78e';
          ctx.fillRect(state.hero1X, 48, (p1.hp / 100) * 48, 5);
          ctx.fillStyle = '#fff';
          ctx.font = '8px monospace';
          ctx.fillText(p1.name.substring(0,3).toUpperCase(), state.hero1X, 44);
        }

        const p2 = Object.values(coopPlayers)[1];
        if (p2) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(state.hero2X, 58, 48, 5);
          ctx.fillStyle = '#48c78e';
          ctx.fillRect(state.hero2X, 58, (p2.hp / 100) * 48, 5);
          ctx.fillStyle = '#fff';
          ctx.font = '8px monospace';
          ctx.fillText(p2.name.substring(0,3).toUpperCase(), state.hero2X, 54);
        }
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(state.heroX, 50, 56, 6);
        ctx.fillStyle = '#48c78e';
        ctx.fillRect(state.heroX, 50, (heroHp / 100) * 56, 6);
      }

      state.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      state.damageTexts.forEach((d) => {
        ctx.fillStyle = d.color;
        ctx.font = '900 11px "Outfit", sans-serif';
        ctx.fillText(d.text, d.x, d.y);
        d.y -= 1.2;
        d.life -= 1;
      });
      state.damageTexts = state.damageTexts.filter(d => d.life > 0);

      ctx.restore();
      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeGame, rpgMode, coopSubState, enemyHp, battleStage, coopPlayers]);

  const startSoloBattle = () => {
    playRetroSound('select', soundOn);
    setRpgMode('solo');
    setHeroHp(100);
    setEnemyHp(60);
    setMaxEnemyHp(60);
    setBattleStage(1);
    setBattleStatus('active');
    setBattleLog(['⚔️ Combate solo iniciado! Defenda seu reino contra o SLIME.']);
    setCurrentQuestIdx(Math.floor(Math.random() * BATTLE_QUESTIONS.length));
    
    // Reset canvas states
    const state = animRef.current;
    state.heroState = 'stand';
    state.enemyState = 'stand';
    state.particles = [];
    state.damageTexts = [];
    
    setActiveGame('battle');
  };

  const startCoopBattleChoice = () => {
    setRpgMode('coop');
    setCoopSubState('choice');
    setRoomCode('');
    setCoopError('');
    setActiveGame('battle');
  };

  // Helper styles for animations
  const customAnimStyles = (
    <style>{`
      @keyframes floatArcade {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .ws-grid-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 950;
        font-size: 1.15rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s;
        user-select: none;
      }
    `}</style>
  );

  return (
    <Box sx={{ mt: 1, animation: 'fadeIn 0.5s ease', position: 'relative' }}>
      {customAnimStyles}

      {/* Main Bar with Sound Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 950, color: '#fff', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 1 }}>
          🎮 Jogos Interativos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={() => setSoundOn(!soundOn)} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.05)', 
              color: soundOn ? '#00b4d8' : 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            {soundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
          {activeGame !== null && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                playRetroSound('select', soundOn);
                setActiveGame(null);
                setRpgMode(null);
              }}
              sx={{
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: 2.5,
                fontWeight: 800,
                px: 2.5
              }}
            >
              Voltar ao Hub
            </Button>
          )}
        </Box>
      </Box>

      {/* ────────────────── GAME MENU HUB ────────────────── */}
      {activeGame === null && (
        <Grid container spacing={3.5}>
          {/* Card 1: Word Search */}
          <Grid item xs={12} sm={6}>
            <Card sx={{
              p: 3.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.4), rgba(0, 180, 216, 0.05))',
              border: '1px solid rgba(0, 180, 216, 0.2)',
              '&:hover': {
                border: '1px solid #00b4d8',
                boxShadow: '0 8px 30px rgba(0, 180, 216, 0.15)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Box>
                <Typography fontSize={48} sx={{ mb: 1.5 }}>🔍</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#00b4d8' }}>
                  Caça-Palavras
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3.5, lineHeight: 1.6 }}>
                  Treine sua percepção e expanda seu vocabulário em inglês! Escolha um tema de palavras e selecione-as clicando na primeira e última letra da palavra.
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5, letterSpacing: 0.5 }}>
                  Escolha um tema para jogar:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(WORD_SEARCH_THEMES).map(([key, value]) => (
                    <Button
                      key={key}
                      variant="outlined"
                      size="small"
                      onClick={() => startWordSearch(key)}
                      sx={{
                        borderRadius: 2.5,
                        borderColor: 'rgba(0, 180, 216, 0.3)',
                        color: '#eee',
                        fontWeight: 800,
                        textTransform: 'none',
                        '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0,180,216,0.06)' }
                      }}
                    >
                      {value.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Card 2: Pixel RPG Battle */}
          <Grid item xs={12} sm={6}>
            <Card sx={{
              p: 3.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.4), rgba(179, 136, 255, 0.05))',
              border: '1px solid rgba(179, 136, 255, 0.2)',
              '&:hover': {
                border: '1px solid #b388ff',
                boxShadow: '0 8px 30px rgba(179, 136, 255, 0.15)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Box>
                <Typography fontSize={48} sx={{ mb: 1.5 }}>⚔️</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#b388ff' }}>
                  Pixel Word Battle
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3.5, lineHeight: 1.6 }}>
                  Enfrente monstros clássicos de RPG respondendo questionários rápidos de vocabulário e gramática. Animações de pixels retrôs e barras de vida 8-bit!
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={startSoloBattle}
                  sx={{
                    borderColor: 'rgba(179, 136, 255, 0.4)',
                    color: '#fff',
                    borderRadius: 3.5,
                    fontWeight: 800,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#b388ff',
                      bgcolor: 'rgba(179, 136, 255, 0.06)'
                    }
                  }}
                  startIcon={<SportsEsportsIcon />}
                >
                  Jogar Solo ⚔️
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={startCoopBattleChoice}
                  sx={{
                    background: 'linear-gradient(135deg, #7c4dff, #b388ff)',
                    color: '#fff',
                    borderRadius: 3.5,
                    fontWeight: 900,
                    boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b388ff, #7c4dff)',
                      boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)'
                    }
                  }}
                  startIcon={<SportsEsportsIcon />}
                >
                  Jogar Co-op 👥 (Convidar Amigo)
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ────────────────── GAME 1: WORD SEARCH ────────────────── */}
      {activeGame === 'wordsearch' && (
        <Card sx={{ p: 4, background: 'rgba(13, 27, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#00b4d8' }}>
                Caça-Palavras: {WORD_SEARCH_THEMES[wsTheme].name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                <Button 
                  size="small" 
                  onClick={() => setShowWsTutorial(true)}
                  startIcon={<HelpOutlineIcon />}
                  sx={{ 
                    color: '#00b4d8', 
                    fontWeight: 800, 
                    fontSize: '0.75rem', 
                    py: 0.3,
                    bgcolor: 'rgba(0, 180, 216, 0.06)',
                    '&:hover': { bgcolor: 'rgba(0, 180, 216, 0.12)' }
                  }}
                >
                  Ver Tutorial
                </Button>
              </Box>
            </Box>
            <Chip
              label={`${wsFoundWords.length} / ${wsWords.length} Encontradas`}
              color={wsCompleted ? "success" : "primary"}
              sx={{ fontWeight: 900 }}
            />
          </Box>

          {showWsTutorial ? (
            <Box sx={{ p: 3, bgcolor: 'rgba(13, 27, 42, 0.5)', borderRadius: 4, border: '1px solid rgba(0, 180, 216, 0.2)', mb: 4, animation: 'fadeIn 0.4s ease' }}>
              <Typography variant="h6" sx={{ color: '#00b4d8', fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                📖 Tutorial de Jogo: Como Jogar Caça-Palavras?
              </Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, lineHeight: 1.6 }}>
                Encontre as palavras em inglês listadas na barra lateral. A grade de letras possui 10 colunas e 10 linhas. Escolha sua preferida abaixo:
              </Typography>

              <Box sx={{ mb: 3.5, p: 2.5, bgcolor: 'rgba(0,0,0,0.25)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>
                  Selecione o Modo de Seleção de Letras:
                </Typography>
                
                <FormControl component="fieldset">
                  <RadioGroup value={wsMode} onChange={(e) => setWsMode(e.target.value)}>
                    <FormControlLabel 
                      value="ends" 
                      control={<Radio sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#00b4d8' } }} />} 
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>🎯 Modo 1: Clicar no Início e Fim (Recomendado)</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', mt: 0.2 }}>
                            Clique na primeira letra da palavra, depois clique na última letra. A linha inteira se preenche automaticamente!
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 2.5, alignItems: 'flex-start' }}
                    />
                    <FormControlLabel 
                      value="sequence" 
                      control={<Radio sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#b388ff' } }} />} 
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography sx={{ color: '#b388ff', fontWeight: 700, fontSize: '0.9rem' }}>🔤 Modo 2: Seleção Letra por Letra (Sequencial)</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', mt: 0.2 }}>
                            Clique nas letras uma por uma seguindo o caminho adjacente. Ao terminar, clique em <strong>"Validar Palavra 🚀"</strong>.
                          </Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start' }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800 }}>
                  🎁 Recompensa: Concluir a grade inteira concede +100 XP extras no seu perfil!
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    playRetroSound('select', soundOn);
                    setShowWsTutorial(false);
                  }}
                  sx={{ 
                    bgcolor: '#00b4d8', 
                    fontWeight: 900, 
                    borderRadius: 3, 
                    px: 4, 
                    py: 1,
                    '&:hover': { bgcolor: '#0077b6' }
                  }}
                >
                  Entendido, Jogar! 🎮
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
              {wsMessage && (
                <Alert 
                  severity={wsMessageSeverity} 
                  sx={{ 
                    mb: 2.5, 
                    borderRadius: 3, 
                    bgcolor: wsMessageSeverity === 'success' ? 'rgba(72, 199, 142, 0.12)' : wsMessageSeverity === 'warning' ? 'rgba(255, 183, 77, 0.12)' : wsMessageSeverity === 'error' ? 'rgba(255, 90, 121, 0.12)' : 'rgba(0, 180, 216, 0.12)',
                    border: `1px solid ${wsMessageSeverity === 'success' ? 'rgba(72, 199, 142, 0.25)' : wsMessageSeverity === 'warning' ? 'rgba(255, 183, 77, 0.25)' : wsMessageSeverity === 'error' ? 'rgba(255, 90, 121, 0.25)' : 'rgba(0, 180, 216, 0.25)'}`,
                    color: wsMessageSeverity === 'success' ? '#a5d6a7' : wsMessageSeverity === 'warning' ? '#ffb74d' : wsMessageSeverity === 'error' ? '#ffcbd5' : '#88d8ff',
                    animation: 'fadeIn 0.3s ease' 
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800}>{wsMessage}</Typography>
                </Alert>
              )}

              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Modo ativo: <strong>{wsMode === 'ends' ? 'Início e Fim (🎯)' : 'Letra por Letra (🔤)'}</strong>
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => setShowWsTutorial(true)} 
                  sx={{ fontSize: '0.72rem', textTransform: 'none', color: '#b388ff', fontWeight: 800 }}
                >
                  Trocar Modo / Ver Tutorial
                </Button>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{
                    bgcolor: 'rgba(0,0,0,0.25)',
                    p: 2.5,
                    borderRadius: 4,
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    width: '100%',
                    maxWidth: 420,
                    mx: 'auto'
                  }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(10, 1fr)',
                      gap: 1
                    }}>
                      {wsGrid.map((row, rIdx) => 
                        row.map((letter, cIdx) => {
                          const isFound = wsFoundCells.includes(`${rIdx}-${cIdx}`);
                          let isSelected = false;
                          let isStarting = false;

                          if (wsMode === 'ends') {
                            isStarting = wsStartCell && wsStartCell.r === rIdx && wsStartCell.c === cIdx;
                          } else {
                            isSelected = wsSelectedCells.some(cell => cell.r === rIdx && cell.c === cIdx);
                            isStarting = wsSelectedCells.length > 0 && wsSelectedCells[wsSelectedCells.length - 1].r === rIdx && wsSelectedCells[wsSelectedCells.length - 1].c === cIdx;
                          }
                          
                          let bg = 'rgba(255, 255, 255, 0.02)';
                          let border = '1px solid rgba(255,255,255,0.03)';
                          let color = 'rgba(255,255,255,0.7)';
                          let shadow = 'none';

                          if (isStarting) {
                            bg = wsMode === 'ends' ? 'rgba(0, 180, 216, 0.12)' : 'rgba(179, 136, 255, 0.15)';
                            border = wsMode === 'ends' ? '1.5px solid #00b4d8' : '1.5px solid #b388ff';
                            color = wsMode === 'ends' ? '#00b4d8' : '#b388ff';
                            shadow = wsMode === 'ends' ? '0 0 10px rgba(0, 180, 216, 0.25)' : '0 0 10px rgba(179, 136, 255, 0.25)';
                          } else if (isSelected) {
                            bg = 'rgba(179, 136, 255, 0.08)';
                            border = '1px dashed rgba(179, 136, 255, 0.4)';
                            color = '#d1c4e9';
                          } else if (isFound) {
                            bg = 'rgba(72, 199, 142, 0.15)';
                            border = '1px solid #48c78e';
                            color = '#a5d6a7';
                          }

                          return (
                            <Box
                              key={`${rIdx}-${cIdx}`}
                              onClick={() => handleCellClick(rIdx, cIdx)}
                              className="ws-grid-cell"
                              sx={{
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 950,
                                fontSize: { xs: '0.9rem', sm: '1.15rem' },
                                bgcolor: bg,
                                border: border,
                                color: color,
                                boxShadow: shadow,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                userSelect: 'none',
                                '&:hover': {
                                  bgcolor: isFound ? bg : 'rgba(0, 180, 216, 0.06)',
                                  color: isFound ? color : '#00b4d8',
                                  border: isFound ? border : '1px solid rgba(0, 180, 216, 0.3)'
                                }
                              }}
                            >
                              {letter}
                            </Box>
                          );
                        })
                      )}
                    </Box>
                  </Box>

                  {wsMode === 'sequence' && wsSelectedCells.length > 0 && (
                    <Card sx={{ 
                      p: 2.2, 
                      mt: 2.5, 
                      width: '100%', 
                      maxWidth: 420, 
                      bgcolor: 'rgba(179, 136, 255, 0.04)',
                      border: '1px solid rgba(179, 136, 255, 0.2)',
                      borderRadius: 3.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          Palavra Formada:
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#b388ff', letterSpacing: 1 }}>
                          {wsSelectedCells.map(cell => wsGrid[cell.r][cell.c]).join('')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={clearSequenceSelection}
                          sx={{ 
                            borderRadius: 2.5, 
                            color: '#ff8fa3', 
                            borderColor: 'rgba(255, 143, 163, 0.3)',
                            fontWeight: 800,
                            textTransform: 'none',
                            '&:hover': { borderColor: '#ffcbd5', bgcolor: 'rgba(255, 143, 163, 0.06)' }
                          }}
                        >
                          Limpar
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small" 
                          onClick={validateSequenceWord}
                          sx={{ 
                            borderRadius: 2.5, 
                            bgcolor: '#b388ff', 
                            color: '#fff',
                            fontWeight: 900,
                            textTransform: 'none',
                            px: 2.5,
                            '&:hover': { bgcolor: '#7c4dff' }
                          }}
                        >
                          Validar 🚀
                        </Button>
                      </Box>
                    </Card>
                  )}
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.15)', height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', mb: 2, letterSpacing: 0.5 }}>
                        📝 Encontre estas palavras:
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
                        {wsWords.map((word) => {
                          const isFound = wsFoundWords.includes(word);
                          return (
                            <Chip
                              key={word}
                              label={word}
                              sx={{
                                fontWeight: 800,
                                bgcolor: isFound ? 'rgba(72, 199, 142, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                                color: isFound ? '#48c78e' : '#eee',
                                border: isFound ? '1px solid rgba(72, 199, 142, 0.25)' : '1px solid rgba(255, 255, 255, 0.07)',
                                textDecoration: isFound ? 'line-through' : 'none',
                                opacity: isFound ? 0.6 : 1,
                                transition: 'all 0.25s'
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => startWordSearch(wsTheme)}
                        sx={{
                          borderRadius: 3,
                          fontWeight: 800,
                          borderColor: 'rgba(0, 180, 216, 0.25)',
                          color: '#00b4d8',
                          '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0,180,216,0.04)' }
                        }}
                      >
                        ↺ Resetar Grade
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>
      )}

      {/* ────────────────── GAME 2: PIXEL RPG BATTLE ────────────────── */}
      {activeGame === 'battle' && (
        <Card sx={{ p: 4, background: 'rgba(13, 27, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          
          {/* LOBBY LOBBY CHOICE FOR CO-OP */}
          {rpgMode === 'coop' && coopSubState === 'choice' && (
            <Box sx={{ textAlign: 'center', py: 4, animation: 'fadeIn 0.4s ease' }}>
              <Typography fontSize={48} sx={{ mb: 2 }}>👥</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#b388ff' }}>
                RPG Batalha Multiplayer Co-op
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4, maxWidth: 500, mx: 'auto' }}>
                Jogue em dupla contra monstros de inglês! Um jogador cria a sala de combate e o outro entra usando o código gerado.
              </Typography>
              
              {coopError && <Alert severity="error" sx={{ mb: 3, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>{coopError}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2.5, justifyContent: 'center', maxWidth: 500, mx: 'auto' }}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateCoopRoom}
                  sx={{ 
                    flex: 1, 
                    bgcolor: '#7c4dff', 
                    fontWeight: 900, 
                    borderRadius: 3,
                    py: 1.5,
                    '&:hover': { bgcolor: '#b388ff' }
                  }}
                >
                  Criar Nova Sala 🏰
                </Button>
                
                <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                  <TextField 
                    size="small"
                    placeholder="CÓDIGO (ex: ABCD)"
                    id="coopCodeField"
                    inputProps={{ maxLength: 4, style: { textTransform: 'uppercase', fontWeight: 800, textAlign: 'center' } }}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { height: 48 } }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      const codeVal = document.getElementById('coopCodeField')?.value;
                      handleJoinCoopRoom(codeVal);
                    }}
                    sx={{ 
                      borderRadius: 3, 
                      color: '#b388ff', 
                      borderColor: 'rgba(179, 136, 255, 0.4)',
                      fontWeight: 800,
                      '&:hover': { borderColor: '#b388ff', bgcolor: 'rgba(179, 136, 255, 0.05)' }
                    }}
                  >
                    Entrar
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
              
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#b388ff', mb: 2 }}>
                ⚔️ Convidar Outros Alunos
              </Typography>
              
              {availablePlayers.length > 0 ? (
                <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto', justifyContent: 'center', mt: 1 }}>
                  {availablePlayers.map((player) => (
                    <Grid item xs={12} sm={6} key={player.id}>
                      <Card sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 3,
                        transition: 'transform 0.2s, background 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          background: 'rgba(255, 255, 255, 0.06)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textAlign: 'left' }}>
                          <Avatar sx={{ bgcolor: '#7c4dff', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 800 }}>
                            {player.name.substring(0, 2).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff' }}>
                              {player.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                              @{player.username}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button
                          size="small"
                          variant="contained"
                          disabled={isInvitingPlayerId === player.id}
                          onClick={() => handleSendInvite(player.id, player.name)}
                          sx={{
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            bgcolor: '#00b4d8',
                            '&:hover': { bgcolor: '#0077b6' }
                          }}
                        >
                          {isInvitingPlayerId === player.id ? 'Convidando...' : 'Convidar ⚔️'}
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', py: 2 }}>
                  Nenhum outro aluno encontrado no momento para convidar.
                </Typography>
              )}
            </Box>
          )}

          {/* LOBBY WAITING FOR PLAYER 2 */}
          {rpgMode === 'coop' && coopSubState === 'create' && (
            <Box sx={{ textAlign: 'center', py: 4, animation: 'fadeIn 0.4s ease' }}>
              <Typography fontSize={48} sx={{ mb: 2, animation: 'floatArcade 2s ease-in-out infinite' }}>🏰</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#00b4d8' }}>
                Aguardando Jogador 2...
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                Compartilhe o código da sala abaixo com seu amigo para ele entrar na batalha:
              </Typography>
              
              <Box sx={{
                display: 'inline-block',
                p: 3,
                bgcolor: 'rgba(0, 180, 216, 0.12)',
                border: '2px dashed #00b4d8',
                borderRadius: 4,
                mb: 4,
                boxShadow: '0 0 20px rgba(0, 180, 216, 0.08)'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 950, color: '#fff', letterSpacing: 6 }}>
                  {roomCode}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <CircularProgress size={24} sx={{ color: '#00b4d8' }} />
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 650 }}>
                  Aguardando conexão...
                </Typography>
              </Box>
            </Box>
          )}

          {/* PLAY SCREEN (SOLO OR ACTIVE CO-OP PLAYING) */}
          {((rpgMode === 'solo') || (rpgMode === 'coop' && coopSubState === 'play')) && (
            <Box>
              {/* Header Info */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2, gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: rpgMode === 'coop' ? '#b388ff' : '#00b4d8' }}>
                    {rpgMode === 'coop' ? `RPG Batalha Co-op (SALA: ${roomCode})` : 'RPG Batalha Solo'} — Estágio {battleStage} / 3
                  </Typography>
                  {rpgMode === 'coop' && (
                    <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 700, display: 'block', mt: 0.5 }}>
                      👥 Jogando em Dupla: {Object.values(coopPlayers).map(p => p.name).join(' & ')}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={`Monstro: ${battleStage === 1 ? '🟢 Slime' : battleStage === 2 ? '💀 Skeleton' : '👿 Shadow Dragon'}`}
                  color={rpgMode === 'coop' ? "secondary" : "primary"}
                  sx={{ fontWeight: 900 }}
                />
              </Box>

              <Grid container spacing={3.5}>
                {/* HTML5 Canvas retro render */}
                <Grid item xs={12} md={7}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={170}
                      style={{
                        width: '100%',
                        maxWidth: 400,
                        height: 170,
                        borderRadius: '16px',
                        border: `3px solid ${rpgMode === 'coop' ? 'rgba(179, 136, 255, 0.25)' : 'rgba(0, 180, 216, 0.25)'}`,
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                        imageRendering: 'pixelated'
                      }}
                    />
                    
                    {/* Combat HP Indicators */}
                    <Box sx={{ display: 'flex', width: '100%', maxWidth: 400, justifyContent: 'space-between', px: 1, mt: 1.2 }}>
                      {rpgMode === 'coop' ? (
                        Object.values(coopPlayers).map((p, idx) => (
                          <Typography key={idx} variant="caption" sx={{ fontWeight: 800, color: '#48c78e' }}>
                            {p.name.substring(0,8).toUpperCase()}: {p.hp}/100 HP
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#48c78e' }}>
                          HERO: {heroHp} / 100 HP
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#ff5a79' }}>
                        MONSTER: {enemyHp} / {maxEnemyHp} HP
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Combat Log Box */}
                <Grid item xs={12} md={5}>
                  <Card sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.25)', height: 170, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', display: 'block', mb: 1, letterSpacing: 0.5 }}>
                      🛡️ Log de Combate:
                    </Typography>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.8, fontSize: '0.8rem' }}>
                      {battleLog.slice(0, 5).map((log, i) => (
                        <Typography 
                          key={i} 
                          variant="body2" 
                          sx={{ 
                            color: log.startsWith('⚔️') ? '#a5d6a7' : log.startsWith('💥') ? '#ffcbd5' : log.startsWith('🎉') ? '#b388ff' : '#94a3b8',
                            fontWeight: 650,
                            fontSize: '0.82rem'
                          }}
                        >
                          {log}
                        </Typography>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              </Grid>

              {/* ─── QUEST INTERFACE ─── */}
              <Divider sx={{ my: 3.5, borderColor: 'rgba(255,255,255,0.07)' }} />

              {battleStatus === 'active' && (
                <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
                  <Box sx={{ p: 3, bgcolor: rpgMode === 'coop' ? 'rgba(179, 136, 255, 0.05)' : 'rgba(0, 180, 216, 0.05)', borderLeft: `4px solid ${rpgMode === 'coop' ? '#b388ff' : '#00b4d8'}`, borderRadius: 3, mb: 3 }}>
                    <Typography variant="caption" sx={{ color: rpgMode === 'coop' ? '#b388ff' : '#00b4d8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                      ⚔️ VOCABULARY QUEST
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                      {BATTLE_QUESTIONS[currentQuestIdx].q}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {BATTLE_QUESTIONS[currentQuestIdx].options.map((opt) => (
                      <Grid item xs={12} sm={6} key={opt}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleRpgAnswerSubmit(opt)}
                          sx={{
                            p: 2,
                            borderRadius: 3.5,
                            fontWeight: 800,
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            border: '1.5px solid rgba(255, 255, 255, 0.07)',
                            color: '#cbd5e1',
                            '&:hover': {
                              bgcolor: rpgMode === 'coop' ? 'rgba(179, 136, 255, 0.1)' : 'rgba(0, 180, 216, 0.1)',
                              borderColor: rpgMode === 'coop' ? '#b388ff' : '#00b4d8',
                              color: '#fff',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          {opt}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Victory View */}
              {battleStatus === 'victory' && (
                <Box sx={{ textAlign: 'center', py: 4, animation: 'fadeIn 0.5s ease' }}>
                  <Typography fontSize={64} sx={{ filter: 'drop-shadow(0 0 10px rgba(179,136,255,0.4))', mb: 1 }}>👑</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950, color: '#48c78e', mb: 1 }}>
                    VITÓRIA ABSOLUTA!
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#b3c5d7', mb: 3.5 }}>
                    {rpgMode === 'coop' 
                      ? 'Vocês derrotaram o Dragão das Sombras cooperativamente e salvaram o Reino!' 
                      : 'Você derrotou o Dragão das Sombras e salvou o Reino do Vocabulário!'}
                  </Typography>
                  <Alert severity="success" sx={{ display: 'inline-flex', mb: 3.5, borderRadius: 3, bgcolor: 'rgba(72, 199, 142, 0.12)', border: '1px solid rgba(72, 199, 142, 0.25)', color: '#a5d6a7' }}>
                    <Typography variant="subtitle2" fontWeight={800}>
                      🏆 Bônus Concedido: <strong>+100 XP</strong> adicionado ao seu perfil!
                    </Typography>
                  </Alert>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" onClick={rpgMode === 'coop' ? startCoopBattleChoice : startSoloBattle} sx={{ bgcolor: rpgMode === 'coop' ? '#7c4dff' : '#00b4d8', fontWeight: 800, borderRadius: 3, px: 4, py: 1.2 }}>
                      Jogar Novamente
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Defeat View */}
              {battleStatus === 'defeat' && (
                <Box sx={{ textAlign: 'center', py: 4, animation: 'fadeIn 0.5s ease' }}>
                  <Typography fontSize={64} sx={{ mb: 1 }}>💀</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950, color: '#ff5a79', mb: 1 }}>
                    FIM DE JOGO
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#b3c5d7', mb: 3.5 }}>
                    Seus pontos de vida acabaram. Não desmaie, continue praticando!
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" onClick={rpgMode === 'coop' ? startCoopBattleChoice : startSoloBattle} sx={{ bgcolor: '#ff5a79', fontWeight: 800, borderRadius: 3, px: 4, py: 1.2, '&:hover': { bgcolor: '#ff3b30' } }}>
                      Tentar Novamente
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}

        </Card>
      )}

      {/* Dialog de convite para a batalha */}
      {pendingInvites.length > 0 && (
        <Dialog 
          open={pendingInvites.length > 0} 
          PaperProps={{
            style: {
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              boxShadow: '0 0 30px rgba(124, 77, 255, 0.3)'
            }
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', pb: 2 }}>
            <span style={{ fontSize: '1.8rem' }}>⚔️</span>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#b388ff' }}>
                Desafio Co-op RPG!
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Batalha de Inglês em Dupla
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2.5, py: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              O aluno <strong>{pendingInvites[0].hostName}</strong> convocou você!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Vocês dois vão batalhar lado a lado na arena contra os monstros. Cada acerto causa dano ao monstro e protege o grupo!
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1.5 }}>
            <Button 
              onClick={() => handleDeclineInvite(pendingInvites[0])}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                fontWeight: 700,
                '&:hover': { color: '#ff5a79', bgcolor: 'rgba(255, 90, 121, 0.05)' } 
              }}
            >
              Recusar
            </Button>
            <Button 
              variant="contained"
              onClick={() => handleAcceptInvite(pendingInvites[0])}
              sx={{ 
                bgcolor: '#7c4dff', 
                fontWeight: 900, 
                px: 3, 
                borderRadius: 2.5,
                '&:hover': { bgcolor: '#b388ff' } 
              }}
            >
              Batalhar! ⚔️
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </Box>
  );
}
