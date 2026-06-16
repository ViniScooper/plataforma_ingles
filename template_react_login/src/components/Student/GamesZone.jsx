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
  LinearProgress,
  Avatar,
  Select,
  MenuItem
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

const CMD_STAGES = [
  {
    id: 1,
    name: "Caminho do Aprendiz",
    tip: "Escreva comandos passo a passo. Digite 'right' para ir à direita. Chegue na chave (🔑), digite 'grab key'. Vá ao baú (🔒) e digite 'open chest'!",
    player: { x: 0, y: 0 },
    key: { x: 2, y: 2 },
    chest: { x: 4, y: 4 },
    obstacles: [],
    dangers: [],
    dangerType: 'fire'
  },
  {
    id: 2,
    name: "Primeiras Funções",
    tip: "Aprenda a usar funções! Defina uma função com 'define [nome]' e feche com 'end'. Ex:\ndefine andar_diagonal\n  right\n  down\nend\nE chame ela digitando: andar_diagonal",
    player: { x: 0, y: 0 },
    key: { x: 3, y: 3 },
    chest: { x: 5, y: 5 },
    obstacles: [],
    dangers: [],
    dangerType: 'fire'
  },
  {
    id: 3,
    name: "Desvio do Calabouço",
    tip: "Paredes de pedra 🧱 bloqueiam seu caminho! Use funções para planejar caminhos repetitivos e desviar dos muros.",
    player: { x: 0, y: 5 },
    key: { x: 5, y: 0 },
    chest: { x: 5, y: 5 },
    obstacles: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
    dangers: [],
    dangerType: 'pit'
  },
  {
    id: 4,
    name: "Rios de Fogo",
    tip: "Alerta de perigo! Áreas de fogo 🔥 tiram 1 vida (❤️) e reiniciam sua posição se pisar nelas.",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 0 },
    chest: { x: 5, y: 5 },
    obstacles: [],
    dangers: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
    dangerType: 'fire'
  },
  {
    id: 5,
    name: "Abismo Sem Fim",
    tip: "Dungeons profundas contêm abismos 🕳️ letais! Se você cair, morre e volta al início, perdendo um coração.",
    player: { x: 0, y: 5 },
    key: { x: 3, y: 2 },
    chest: { x: 5, y: 0 },
    obstacles: [{ x: 1, y: 4 }, { x: 2, y: 4 }],
    dangers: [{ x: 3, y: 3 }, { x: 4, y: 3 }],
    dangerType: 'pit'
  },
  {
    id: 6,
    name: "Ciclo de Repetição (Loops)",
    tip: "loops de repetição ativos! Use:\nrepeat 4\n  right\nend\nIsso executa a instrução interna 4 vezes seguidas!",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 0 },
    chest: { x: 5, y: 5 },
    obstacles: [],
    dangers: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
    dangerType: 'fire'
  },
  {
    id: 7,
    name: "O Pântano Ácido",
    tip: "Use loops de repetição para fazer movimentos diagonais precisos pelo pântano.",
    player: { x: 0, y: 0 },
    key: { x: 4, y: 2 },
    chest: { x: 5, y: 5 },
    obstacles: [{ x: 1, y: 1 }, { x: 3, y: 3 }],
    dangers: [{ x: 2, y: 0 }, { x: 0, y: 2 }, { x: 4, y: 4 }],
    dangerType: 'pit'
  },
  {
    id: 8,
    name: "A Câmara Secreta",
    tip: "Escreva uma função que use loops internos para desviar das chamas e dos muros de pedra.",
    player: { x: 0, y: 5 },
    key: { x: 0, y: 0 },
    chest: { x: 5, y: 0 },
    obstacles: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
    dangers: [{ x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }],
    dangerType: 'fire'
  },
  {
    id: 9,
    name: "Labirinto de Fogo",
    tip: "Um labirinto cercado por fogo! Evite pisar nas brasas enquanto busca o tesouro.",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 5 },
    chest: { x: 0, y: 5 },
    obstacles: [{ x: 2, y: 2 }, { x: 3, y: 2 }],
    dangers: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }],
    dangerType: 'fire'
  },
  {
    id: 10,
    name: "Desafio dos Cavaleiros",
    tip: "Apenas programadores experientes passam! Use loops de repetição para andar pelo corredor estreito.",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 1 },
    chest: { x: 1, y: 5 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }],
    dangers: [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }],
    dangerType: 'pit'
  },
  {
    id: 11,
    name: "A Ponte da Morte",
    tip: "Uma ponte estreita de terra rodeada de lava. Caminhe reto e não caia!",
    player: { x: 0, y: 2 },
    key: { x: 3, y: 2 },
    chest: { x: 5, y: 2 },
    obstacles: [],
    dangers: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    dangerType: 'fire'
  },
  {
    id: 12,
    name: "Espelhos Duplos",
    tip: "A chave e o baú estão em posições inversas. Crie uma função flexível.",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 0 },
    chest: { x: 0, y: 5 },
    obstacles: [{ x: 2, y: 2 }],
    dangers: [{ x: 1, y: 1 }, { x: 4, y: 4 }],
    dangerType: 'fire'
  },
  {
    id: 13,
    name: "Dungeon de Lava",
    tip: "Desvie dos fluxos de lava fervente nas laterais usando loops de repetição.",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 2 },
    chest: { x: 0, y: 4 },
    obstacles: [{ x: 2, y: 1 }, { x: 3, y: 4 }],
    dangers: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
    dangerType: 'fire'
  },
  {
    id: 14,
    name: "Espiral da Perdição",
    tip: "A espiral requer uma sequência de movimentos incrementais. Escreva um script otimizado.",
    player: { x: 3, y: 3 },
    key: { x: 0, y: 0 },
    chest: { x: 5, y: 5 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    dangers: [{ x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }],
    dangerType: 'pit'
  },
  {
    id: 15,
    name: "Os Quatro Pilares",
    tip: "Calcule a rota e contorne os pilares de pedra no calabouço.",
    player: { x: 0, y: 0 },
    key: { x: 3, y: 3 },
    chest: { x: 5, y: 5 },
    obstacles: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 4 }, { x: 4, y: 4 }],
    dangers: [],
    dangerType: 'pit'
  },
  {
    id: 16,
    name: "Labirinto de Gelo e Fogo",
    tip: "Desvie dos blocos e das chamas alternadas. Defina uma função curta e repita-a.",
    player: { x: 0, y: 5 },
    key: { x: 5, y: 0 },
    chest: { x: 0, y: 0 },
    obstacles: [{ x: 2, y: 3 }, { x: 3, y: 3 }],
    dangers: [{ x: 1, y: 2 }, { x: 4, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    dangerType: 'fire'
  },
  {
    id: 17,
    name: "Desfiladeiro da Sorte",
    tip: "Desfiladeiro cheio de chamas! Planeje a movimentação usando funções seguras.",
    player: { x: 0, y: 0 },
    key: { x: 4, y: 4 },
    chest: { x: 5, y: 0 },
    obstacles: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    dangers: [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }],
    dangerType: 'fire'
  },
  {
    id: 18,
    name: "Corredor das Sombras",
    tip: "O perigo espreita a cada linha. Mantenha o foco!",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 2 },
    chest: { x: 5, y: 5 },
    obstacles: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 4 }, { x: 3, y: 4 }],
    dangers: [{ x: 2, y: 1 }, { x: 4, y: 3 }],
    dangerType: 'pit'
  },
  {
    id: 19,
    name: "O Templo Antigo",
    tip: "Estamos quase lá! Atravesse a nave principal do templo evitando as poças de ácido.",
    player: { x: 0, y: 5 },
    key: { x: 5, y: 5 },
    chest: { x: 5, y: 0 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
    dangers: [{ x: 0, y: 1 }, { x: 4, y: 3 }, { x: 2, y: 5 }],
    dangerType: 'pit'
  },
  {
    id: 20,
    name: "A Arena do Mago Supremo",
    tip: "O DESAFIO FINAL! Use funções e loops combinados para coletar a chave e escapar de vez!",
    player: { x: 0, y: 0 },
    key: { x: 5, y: 5 },
    chest: { x: 5, y: 0 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }],
    dangers: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 4 }, { x: 0, y: 5 }],
    dangerType: 'fire'
  }
];

const parseScript = (lines, stageNum) => {
  let index = 0;

  const parseBlock = (stopTokens = []) => {
    const block = [];
    while (index < lines.length) {
      const line = lines[index];
      const lower = line.toLowerCase();
      const parts = lower.split(/\s+/);
      
      if (stopTokens.includes(parts[0])) {
        break; // Stop parsing this block
      }
      
      index++; // consume this line
      
      if (parts[0] === 'define') {
        throw new Error("Definições de função devem ser feitas no topo do script e não podem ser aninhadas.");
      }
      
      if (parts[0] === 'repeat') {
        if (stageNum < 6) {
          throw new Error("Loops (repeat) só são permitidos a partir do Estágio 6!");
        }
        const count = parseInt(parts[1], 10);
        if (isNaN(count) || count <= 0 || count > 50) {
          throw new Error(`Número de repetições inválido: "${parts[1]}".`);
        }
        const body = parseBlock(['end']);
        if (index >= lines.length || lines[index].toLowerCase() !== 'end') {
          throw new Error("Bloco 'repeat' não foi fechado com 'end'.");
        }
        index++; // consume 'end'
        block.push({ type: 'repeat', count, body });
      } 
      else if (parts[0] === 'for') {
        if (stageNum < 8) {
          throw new Error("Loops (for) só são permitidos a partir do Estágio 8!");
        }
        const varName = parts[1];
        let startIdx = 2;
        if (parts[2] === 'from') startIdx = 3;
        const startVal = parseInt(parts[startIdx], 10);
        if (parts[startIdx + 1] !== 'to') {
          throw new Error(`Sintaxe do 'for' inválida. Use: for ${varName || 'x'} [início] to [fim]`);
        }
        const endVal = parseInt(parts[startIdx + 2], 10);
        if (isNaN(startVal) || isNaN(endVal)) {
          throw new Error("Valores de início/fim do loop 'for' devem ser números.");
        }
        const body = parseBlock(['end']);
        if (index >= lines.length || lines[index].toLowerCase() !== 'end') {
          throw new Error("Bloco 'for' não foi fechado com 'end'.");
        }
        index++; // consume 'end'
        block.push({ type: 'for', varName, start: startVal, end: endVal, body });
      }
      else if (parts[0] === 'while') {
        if (stageNum < 10) {
          throw new Error("Loops (while) só são permitidos a partir do Estágio 10!");
        }
        const condition = parts.slice(1).join(' ');
        if (!condition) {
          throw new Error("O loop 'while' precisa de uma condição. Ex: while not has key");
        }
        const body = parseBlock(['end']);
        if (index >= lines.length || lines[index].toLowerCase() !== 'end') {
          throw new Error("Bloco 'while' não foi fechado com 'end'.");
        }
        index++; // consume 'end'
        block.push({ type: 'while', condition, body });
      }
      else if (parts[0] === 'if') {
        if (stageNum < 4) {
          throw new Error("Condicionais (if/else) só são permitidas a partir do Estágio 4!");
        }
        const condition = parts.slice(1).join(' ');
        if (!condition) {
          throw new Error("A condicional 'if' precisa de uma condição. Ex: if has key");
        }
        const thenBody = parseBlock(['else', 'end']);
        let elseBody = [];
        if (index < lines.length && lines[index].toLowerCase() === 'else') {
          index++; // consume 'else'
          elseBody = parseBlock(['end']);
        }
        if (index >= lines.length || lines[index].toLowerCase() !== 'end') {
          throw new Error("Bloco 'if' não foi fechado com 'end'.");
        }
        index++; // consume 'end'
        block.push({ type: 'if', condition, thenBody, elseBody });
      }
      else {
        block.push({ type: 'command', line });
      }
    }
    return block;
  };

  return parseBlock();
};

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
  const [timeLeft, setTimeLeft] = useState(13);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // --- Pixel Command Quest States ---
  const [cmdText, setCmdText] = useState('');
  const [cmdLog, setCmdLog] = useState([]);
  const [cmdStage, setCmdStage] = useState(1);
  const [selectedStageMenu, setSelectedStageMenu] = useState(1);
  const [showCmdTutorial, setShowCmdTutorial] = useState(true);
  const [cmdStatus, setCmdStatus] = useState('playing');
  const [cmdPlayerPos, setCmdPlayerPos] = useState({ x: 0, y: 0 });
  const [cmdKeyPos, setCmdKeyPos] = useState({ x: 2, y: 2 });
  const [cmdChestPos, setCmdChestPos] = useState({ x: 4, y: 4 });
  const [cmdHasKey, setCmdHasKey] = useState(false);
  const [cmdObstacles, setCmdObstacles] = useState([]);
  const [cmdDangers, setCmdDangers] = useState([]);
  const [cmdLives, setCmdLives] = useState(3);
  const [showCmdHelp, setShowCmdHelp] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdScriptRunning, setCmdScriptRunning] = useState(false);
  const [cmdPlayerAnim, setCmdPlayerAnim] = useState('idle');
  const scriptAbortControllerRef = useRef(null);
  const currentStageData = CMD_STAGES.find(s => s.id === cmdStage) || CMD_STAGES[0];

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
      setBattleStage(data.state.stage || 1);
      setBattleStatus('active');
      
      const pQuests = data.state.currentQuests || {};
      const myQuest = pQuests[userId] || { idx: 0 };
      setCurrentQuestIdx(myQuest.idx);

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
      setActiveGame('battle');
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
    if (!userId) return;
    
    // Don't show invites if user is actively playing a game
    if (activeGame === 'wordsearch' || activeGame === 'command') return;
    if (activeGame === 'battle' && battleStatus === 'active' && (rpgMode !== 'coop' || coopSubState === 'play')) return;

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
  }, [userId, activeGame, rpgMode, coopSubState, battleStatus]);

  // Question Timer Effect
  useEffect(() => {
    if (battleStatus !== 'active' || isTimerPaused) return;
    
    // In co-op, if I am dead, I don't have a timer running
    if (rpgMode === 'coop' && (coopPlayers[userId]?.hp ?? 100) === 0) return;

    setTimeLeft(13);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleQuestionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [battleStatus, currentQuestIdx, rpgMode, isTimerPaused]);

  const handleQuestionTimeout = async () => {
    if (battleStatus !== 'active') return;
    playRetroSound('hit', soundOn);

    if (rpgMode === 'coop') {
      setIsTimerPaused(true);
      try {
        const response = await apiClient.post('/games/action', {
          roomCode,
          playerId: String(userId),
          option: null,
          questionIdx: currentQuestIdx,
          isTimeout: true
        });
        const state = response.data.state;
        setCoopPlayers(state.players);
        setBattleLog(state.combatLog);
        setEnemyHp(state.monsterHp);
        setMaxEnemyHp(state.maxMonsterHp);
        setBattleStage(state.stage);
        setBattleStatus(state.status);
        
        const myQuest = state.currentQuests?.[userId];
        if (myQuest) {
          setCurrentQuestIdx(myQuest.idx);
        }
      } catch (err) {
        console.error('Timeout action error:', err.message);
      } finally {
        setIsTimerPaused(false);
      }
    } else {
      // Solo Timeout
      const damage = battleStage === 1 ? 5 : battleStage === 2 ? 10 : 15;
      const newHeroHp = Math.max(heroHp - damage, 0);
      setHeroHp(newHeroHp);
      
      triggerSoloAttackAnimation(false); // monster attacks hero
      setBattleLog(prev => [`⏰ Tempo esgotado! Recebeu ${damage} de dano do monstro.`, ...prev]);

      if (newHeroHp === 0) {
        setBattleStatus('defeat');
        playRetroSound('defeat', soundOn);
      } else {
        // Select next question
        const candidates = BATTLE_QUESTIONS.filter(quest => quest.level === battleStage);
        const selectedQ = candidates[Math.floor(Math.random() * candidates.length)];
        const globalIdx = BATTLE_QUESTIONS.findIndex(quest => quest.q === selectedQ.q);
        setCurrentQuestIdx(globalIdx);
      }
    }
  };

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
      setBattleStage(data.state.stage || 1);
      setBattleStatus('active');
      
      const pQuests = data.state.currentQuests || {};
      const myQuest = pQuests[userId] || { idx: 0 };
      setCurrentQuestIdx(myQuest.idx);

      setCoopSubState('create');
    } catch (err) {
      setCoopError('Falha ao criar sala. ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelCoopRoom = async () => {
    playRetroSound('select', soundOn);
    try {
      if (roomCode) {
        await apiClient.post('/games/invite/decline', {
          roomCode
        });
      }
    } catch (err) {
      console.warn('Error cancelling room:', err);
    } finally {
      setRoomCode('');
      setCoopPlayers({});
      setBattleStatus('menu');
      setCoopSubState('choice');
    }
  };

  const handleLeaveRpgMatch = async (exitToHub = false) => {
    playRetroSound('select', soundOn);
    if (rpgMode === 'coop') {
      try {
        if (roomCode) {
          await apiClient.post('/games/leave', { roomCode });
        }
      } catch (err) {
        console.warn('Error leaving room:', err);
      } finally {
        setRoomCode('');
        setCoopPlayers({});
        setCoopSubState('choice');
        if (exitToHub) {
          setActiveGame(null);
        } else {
          setBattleStatus('menu');
        }
      }
    } else {
      if (exitToHub) {
        setActiveGame(null);
      } else {
        setBattleStatus('menu');
      }
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
          
          if (trigger.type === 'revive') {
            triggerReviveSync(isPlayer1, trigger.playerName);
          } else if (trigger.target === 'monster') {
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
        if (err.response?.status === 404) {
          setCoopSubState('choice');
          setCoopError(err.response?.data?.error || 'A sala foi fechada, o convite foi recusado ou expirou.');
          playRetroSound('defeat', soundOn);
          clearInterval(pollInterval);
        }
      }
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [activeGame, rpgMode, coopSubState, roomCode, battleStatus]);

  // Cleanup active coop room on component unmount
  useEffect(() => {
    return () => {
      if (rpgMode === 'coop' && roomCode) {
        apiClient.post('/games/leave', { roomCode }).catch(() => {});
      }
    };
  }, [rpgMode, roomCode]);

  // RPG Combat Submission Action (Solo vs Co-op)
  const handleRpgAnswerSubmit = async (option) => {
    if (battleStatus !== 'active') return;
    setIsTimerPaused(true);

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
      } finally {
        setIsTimerPaused(false);
      }
    } else {
      // Solo mode logic
      const q = BATTLE_QUESTIONS[currentQuestIdx];
      if (!q) return;
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
              
              // Select next question
              const candidates = BATTLE_QUESTIONS.filter(quest => quest.level === nextStage);
              const selectedQ = candidates[Math.floor(Math.random() * candidates.length)];
              const globalIdx = BATTLE_QUESTIONS.findIndex(quest => quest.q === selectedQ.q);
              setCurrentQuestIdx(globalIdx);
              setIsTimerPaused(false);
            }, 1000);
          } else {
            setBattleStatus('victory');
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

      const isEnemyDefeated = (option === q.a && Math.max(enemyHp - (battleStage === 3 ? 30 : 20), 0) === 0);
      const activeStageForNextQuestion = isEnemyDefeated 
        ? Math.min(battleStage + 1, 3) 
        : battleStage;

      const candidates = BATTLE_QUESTIONS.filter(quest => quest.level === activeStageForNextQuestion);
      let nextIdx;
      if (candidates.length > 0) {
        do {
          const selectedQ = candidates[Math.floor(Math.random() * candidates.length)];
          nextIdx = BATTLE_QUESTIONS.findIndex(quest => quest.q === selectedQ.q);
        } while (nextIdx === currentQuestIdx && candidates.length > 1);
      } else {
        do {
          nextIdx = Math.floor(Math.random() * BATTLE_QUESTIONS.length);
        } while (nextIdx === currentQuestIdx && BATTLE_QUESTIONS.length > 1);
      }
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

  const triggerReviveSync = (isPlayer1, pName) => {
    const state = animRef.current;
    playRetroSound('victory', soundOn);
    
    if (isPlayer1) state.hero1State = 'victory';
    else state.hero2State = 'victory';
    
    const targetX = isPlayer1 ? state.hero1X : state.hero2X;
    const targetY = isPlayer1 ? 85 : 90;
    
    for (let i = 0; i < 20; i++) {
      state.particles.push({
        x: targetX + 15 + Math.random() * 15,
        y: targetY - 10 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 3,
        size: 3 + Math.random() * 3,
        color: '#48c78e',
        life: 30 + Math.floor(Math.random() * 10)
      });
    }
    
    state.damageTexts.push({
      text: `REVIVIDO!`,
      x: targetX + 10,
      y: 50,
      color: '#48c78e',
      life: 45
    });
    
    setTimeout(() => {
      state.hero1State = 'stand';
      state.hero2State = 'stand';
    }, 1500);
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
    if (!ctx) return;
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
        const p1Hp = Object.values(coopPlayers || {})[0]?.hp ?? 100;
        let p1Y = 60 + (state.hero1State === 'stand' ? bob : 0);
        let p1Sprite = SPRITE_KNIGHT_STAND;
        if (state.hero1State === 'attack') p1Sprite = SPRITE_KNIGHT_ATTACK;
        if (p1Hp === 0) {
          p1Sprite = SPRITE_KNIGHT_STAND;
          p1Y = 85;
          ctx.save();
          ctx.globalAlpha = 0.4;
          drawSprite(ctx, p1Sprite, state.hero1X, p1Y, 3.2, false);
          ctx.restore();
          
          ctx.fillStyle = '#ff5a79';
          ctx.font = 'bold 8px "Outfit", sans-serif';
          ctx.fillText('💀 MORREU', state.hero1X + 2, p1Y - 8);
        } else {
          let flashP1 = state.hero1State === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
          ctx.save();
          if (flashP1) {
            try {
              ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
            } catch (e) {
              ctx.globalAlpha = 0.5;
            }
          }
          drawSprite(ctx, p1Sprite, state.hero1X, p1Y, 3.2, false);
          ctx.restore();
        }
        
        // Draw Player 2 (if present)
        if (Object.keys(coopPlayers || {}).length > 1) {
          const p2Hp = Object.values(coopPlayers || {})[1]?.hp ?? 100;
          let p2Y = 68 + (state.hero2State === 'stand' ? -bob : 0);
          let p2Sprite = SPRITE_KNIGHT_STAND;
          if (state.hero2State === 'attack') p2Sprite = SPRITE_KNIGHT_ATTACK;
          if (p2Hp === 0) {
            p2Sprite = SPRITE_KNIGHT_STAND;
            p2Y = 90;
            ctx.save();
            ctx.globalAlpha = 0.4;
            drawSprite(ctx, p2Sprite, state.hero2X, p2Y, 3.2, false);
            ctx.restore();
            
            ctx.fillStyle = '#ff5a79';
            ctx.font = 'bold 8px "Outfit", sans-serif';
            ctx.fillText('💀 MORREU', state.hero2X + 2, p2Y - 8);
          } else {
            let flashP2 = state.hero2State === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
            ctx.save();
            if (flashP2) {
              try {
                ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
              } catch (e) {
                ctx.globalAlpha = 0.5;
              }
            }
            drawSprite(ctx, p2Sprite, state.hero2X, p2Y, 3.2, false);
            ctx.restore();
          }
        }
      } else {
        // Draw Solo Knight
        let heroY = 60 + (state.heroState === 'stand' ? bob : 0);
        let heroSprite = SPRITE_KNIGHT_STAND;
        if (state.heroState === 'attack') heroSprite = SPRITE_KNIGHT_ATTACK;
        if (heroHp === 0) {
          heroSprite = SPRITE_KNIGHT_STAND;
          heroY = 85;
        }
        
        let flashHero = state.heroState === 'hurt' && Math.floor(Date.now() / 50) % 2 === 0;
        ctx.save();
        if (flashHero) {
          try {
            ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
          } catch (e) {
            ctx.globalAlpha = 0.5;
          }
        }
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
        if (flashEnemy) {
          try {
            ctx.filter = 'brightness(2) drop-shadow(0px 0px 5px #ff5a79)';
          } catch (e) {
            ctx.globalAlpha = 0.5;
          }
        }
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
        const p1 = Object.values(coopPlayers || {})[0];
        if (p1) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(state.hero1X, 48, 48, 5);
          ctx.fillStyle = '#48c78e';
          ctx.fillRect(state.hero1X, 48, (p1.hp / 100) * 48, 5);
          ctx.fillStyle = '#fff';
          ctx.font = '8px monospace';
          ctx.fillText((p1.name || 'P1').substring(0,3).toUpperCase(), state.hero1X, 44);
        }

        const p2 = Object.values(coopPlayers || {})[1];
        if (p2) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(state.hero2X, 58, 48, 5);
          ctx.fillStyle = '#48c78e';
          ctx.fillRect(state.hero2X, 58, (p2.hp / 100) * 48, 5);
          ctx.fillStyle = '#fff';
          ctx.font = '8px monospace';
          ctx.fillText((p2.name || 'P2').substring(0,3).toUpperCase(), state.hero2X, 54);
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
    const candidates = BATTLE_QUESTIONS.filter(quest => quest.level === 1);
    const selectedQ = candidates[Math.floor(Math.random() * candidates.length)];
    const globalIdx = BATTLE_QUESTIONS.findIndex(quest => quest.q === selectedQ.q);
    setCurrentQuestIdx(globalIdx);
    
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
    setBattleStatus('menu');
    setActiveGame('battle');
  };

  // --- Pixel Command Quest Game Handlers ---
  const startCommandQuest = (stageNum = 1, initialLives = null) => {
    playRetroSound('select', soundOn);
    setCmdStage(stageNum);
    setCmdStatus('playing');
    setCmdHasKey(false);
    setCmdScriptRunning(false);
    setCmdText('');
    setCmdPlayerAnim('idle');
    
    let currentLives = cmdLives;
    if (initialLives !== null) {
      setCmdLives(initialLives);
      currentLives = initialLives;
    }
    
    const stageData = CMD_STAGES.find(s => s.id === stageNum) || CMD_STAGES[0];
    
    setCmdLog([
      `🎮 Pixel Command Quest - Estágio ${stageNum}: ${stageData.name} Iniciado!`,
      `Objetivo: Escreva comandos em inglês para se mover, pegar a chave (🔑) e abrir o baú (🔒).`,
      `Vidas restantes: ${'❤️ '.repeat(currentLives)}`,
      `Dica: ${stageData.tip}`
    ]);
    setCmdHistory([]);

    setCmdPlayerPos({ ...stageData.player });
    setCmdKeyPos({ ...stageData.key });
    setCmdChestPos({ ...stageData.chest });
    setCmdObstacles([...stageData.obstacles]);
    setCmdDangers([...stageData.dangers]);

    setActiveGame('command');
  };

  const processCommandText = (rawCmd, playerPosState, hasKeyState) => {
    const cmd = rawCmd.trim().toLowerCase();
    let dx = 0;
    let dy = 0;
    let action = null;

    if (cmd === 'left' || cmd === 'go left' || cmd === 'move left') {
      dx = -1;
    } else if (cmd === 'right' || cmd === 'go right' || cmd === 'move right') {
      dx = 1;
    } else if (cmd === 'up' || cmd === 'go up' || cmd === 'move up') {
      dy = -1;
    } else if (cmd === 'down' || cmd === 'go down' || cmd === 'move down') {
      dy = 1;
    } else if (cmd === 'grab' || cmd === 'take' || cmd === 'get' || cmd === 'grab key' || cmd === 'take key' || cmd === 'get key') {
      action = 'grab';
    } else if (cmd === 'open' || cmd === 'unlock' || cmd === 'open chest' || cmd === 'unlock chest') {
      action = 'open';
    } else {
      return { success: false, log: `❌ Comando inválido: "${rawCmd}".` };
    }

    if (action === null) {
      const newX = playerPosState.x + dx;
      const newY = playerPosState.y + dy;

      if (newX < 0 || newX > 5 || newY < 0 || newY > 5) {
        return { success: false, log: `💥 Colisão! Limite do mapa em (${newX}, ${newY}).` };
      }

      const isObstacle = cmdObstacles.some(obs => obs.x === newX && obs.y === newY);
      if (isObstacle) {
        return { success: false, log: `🧱 Bloqueado! Obstáculo em (${newX}, ${newY}).` };
      }

      return { success: true, newPos: { x: newX, y: newY }, log: `🚶 Movido para (${newX}, ${newY}).` };
    } else if (action === 'grab') {
      if (playerPosState.x === cmdKeyPos.x && playerPosState.y === cmdKeyPos.y) {
        if (hasKeyState) {
          return { success: false, log: `🔑 Você já tem a chave!` };
        } else {
          return { success: true, grabKey: true, log: `🔑 Chave coletada com sucesso!` };
        }
      } else {
        return { success: false, log: `❌ Não há chaves aqui em (${playerPosState.x}, ${playerPosState.y}).` };
      }
    } else if (action === 'open') {
      if (playerPosState.x === cmdChestPos.x && playerPosState.y === cmdChestPos.y) {
        if (!hasKeyState) {
          return { success: false, log: `🔒 Baú trancado! Pegue a chave primeiro.` };
        } else {
          return { success: true, win: true, log: `🔓 Parabéns! Baú aberto. Missão Cumprida!` };
        }
      } else {
        return { success: false, log: `❌ Não há baú aqui em (${playerPosState.x}, ${playerPosState.y}).` };
      }
    }

    return { success: false, log: `❌ Algo deu errado.` };
  };

  const runCommandScript = async (scriptText) => {
    if (cmdScriptRunning || cmdStatus !== 'playing') return;
    setCmdScriptRunning(true);
    setCmdLog(prev => [...prev, `⚡ Compilando e executando script...`]);

    // Set up abort state
    if (scriptAbortControllerRef.current) {
      scriptAbortControllerRef.current.abort = true;
    }
    const abortState = { abort: false };
    scriptAbortControllerRef.current = abortState;

    const evaluateCondition = (cond, currentPos, hasKey) => {
      const c = cond.trim().toLowerCase();
      
      if (c === 'has key' || c === 'haskey' || c === 'tenho chave' || c === 'tem chave') {
        return hasKey;
      }
      if (c === 'not has key' || c === 'not haskey' || c === 'no key' || c === 'nao tenho chave' || c === 'sem chave') {
        return !hasKey;
      }
      if (c === 'on key' || c === 'em cima da chave' || c === 'na chave') {
        return currentPos.x === cmdKeyPos.x && currentPos.y === cmdKeyPos.y;
      }
      if (c === 'on chest' || c === 'em cima do bau' || c === 'no bau') {
        return currentPos.x === cmdChestPos.x && currentPos.y === cmdChestPos.y;
      }
      
      // Directions free checks
      if (c === 'free right' || c === 'livre direita') {
        const nextX = currentPos.x + 1;
        return nextX <= 5 && !cmdObstacles.some(obs => obs.x === nextX && obs.y === currentPos.y);
      }
      if (c === 'free left' || c === 'livre esquerda') {
        const nextX = currentPos.x - 1;
        return nextX >= 0 && !cmdObstacles.some(obs => obs.x === nextX && obs.y === currentPos.y);
      }
      if (c === 'free up' || c === 'livre cima') {
        const nextY = currentPos.y - 1;
        return nextY >= 0 && !cmdObstacles.some(obs => obs.x === currentPos.x && obs.y === nextY);
      }
      if (c === 'free down' || c === 'livre baixo') {
        const nextY = currentPos.y + 1;
        return nextY <= 5 && !cmdObstacles.some(obs => obs.x === currentPos.x && obs.y === nextY);
      }

      // Danger checks
      if (c === 'danger right' || c === 'perigo direita') {
        const nextX = currentPos.x + 1;
        return cmdDangers.some(dang => dang.x === nextX && dang.y === currentPos.y);
      }
      if (c === 'danger left' || c === 'perigo esquerda') {
        const nextX = currentPos.x - 1;
        return cmdDangers.some(dang => dang.x === nextX && dang.y === currentPos.y);
      }
      if (c === 'danger up' || c === 'perigo cima') {
        const nextY = currentPos.y - 1;
        return cmdDangers.some(dang => dang.x === currentPos.x && dang.y === nextY);
      }
      if (c === 'danger down' || c === 'perigo baixo') {
        const nextY = currentPos.y + 1;
        return cmdDangers.some(dang => dang.x === currentPos.x && dang.y === nextY);
      }
      if (c === 'on danger' || c === 'no perigo') {
        return cmdDangers.some(dang => dang.x === currentPos.x && dang.y === currentPos.y);
      }

      return false;
    };

    let statements;
    try {
      const lines = scriptText
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);
      
      const functions = new Map();
      const mainLines = [];
      let inFunc = false;
      let currentFuncName = '';
      let currentFuncBody = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lower = line.toLowerCase();
        
        if (lower.startsWith('define ')) {
          if (cmdStage < 2) {
            throw new Error("Funções só são permitidas a partir do Estágio 2!");
          }
          if (inFunc) {
            throw new Error(`Erro na linha ${i + 1}: Definição de função aninhada não permitida.`);
          }
          const parts = line.split(/\s+/);
          const name = parts[1]?.toLowerCase();
          if (!name || ['left', 'right', 'up', 'down', 'grab', 'take', 'get', 'open', 'unlock', 'repeat', 'define', 'end', 'if', 'else', 'while', 'for'].includes(name)) {
            throw new Error(`Erro na linha ${i + 1}: Nome de função inválido ou reservado: "${name}".`);
          }
          inFunc = true;
          currentFuncName = name;
          currentFuncBody = [];
        } else if (lower === 'end') {
          if (inFunc) {
            functions.set(currentFuncName, currentFuncBody);
            inFunc = false;
          } else {
            mainLines.push(line);
          }
        } else {
          if (inFunc) {
            currentFuncBody.push(line);
          } else {
            mainLines.push(line);
          }
        }
      }

      if (inFunc) {
        throw new Error(`Função "${currentFuncName}" não foi fechada com "end".`);
      }

      statements = parseScript(mainLines, cmdStage);
    } catch (err) {
      setCmdLog(prev => [...prev, `❌ Erro de Compilação: ${err.message}`]);
      setCmdScriptRunning(false);
      return;
    }

    if (statements.length === 0) {
      setCmdLog(prev => [...prev, `❌ Script vazio ou sem comandos executáveis.`]);
      setCmdScriptRunning(false);
      return;
    }

    let currentPos = { ...cmdPlayerPos };
    let hasKey = cmdHasKey;

    const runBlock = async (stmtList, depth = 0) => {
      if (depth > 30) {
        throw new Error("Recursão muito profunda detectada!");
      }

      for (const stmt of stmtList) {
        if (abortState.abort) return;

        if (stmt.type === 'command') {
          const rawCmd = stmt.line;
          const lower = rawCmd.trim().toLowerCase();

          if (functions.has(lower)) {
            const funcBodyLines = functions.get(lower);
            const funcStmts = parseScript(funcBodyLines, cmdStage);
            await runBlock(funcStmts, depth + 1);
          } else {
            const result = processCommandText(rawCmd, currentPos, hasKey);
            setCmdLog(prev => [...prev, `> ${rawCmd}`, result.log]);

            if (result.success) {
              if (result.newPos) {
                currentPos = result.newPos;
                setCmdPlayerPos(currentPos);
                playRetroSound('select', soundOn);
              }
              if (result.grabKey) {
                hasKey = true;
                setCmdHasKey(true);
                setCmdPlayerAnim('grab');
                playRetroSound('victory', soundOn);
                await new Promise(resolve => setTimeout(resolve, 650));
                setCmdPlayerAnim('idle');
              }

              // Check danger
              const isDanger = cmdDangers.some(dang => dang.x === currentPos.x && dang.y === currentPos.y);
              if (isDanger) {
                const stageData = CMD_STAGES.find(s => s.id === cmdStage) || CMD_STAGES[0];
                const isPit = stageData.dangerType === 'pit';
                
                setCmdPlayerAnim(isPit ? 'fall' : 'burn');
                playRetroSound('defeat', soundOn);

                await new Promise(resolve => setTimeout(resolve, 1200));
                setCmdPlayerAnim('idle');

                setCmdLives(prevLives => {
                  const nextLives = prevLives - 1;
                  const hazardMsg = isPit 
                    ? `🕳️ Calabouço fatal! Você caiu no abismo.` 
                    : `🔥 Rio de fogo! Você se queimou nas chamas.`;
                  
                  if (nextLives === 0) {
                    setCmdLog(prevLog => [
                      ...prevLog,
                      `${hazardMsg} 💀 MORTE! Você perdeu todos os corações ❤️. Voltando para o Estágio 1...`
                    ]);
                    setTimeout(() => {
                      startCommandQuest(1, 3);
                    }, 1200);
                  } else {
                    setCmdLog(prevLog => [
                      ...prevLog,
                      `${hazardMsg} Perdeu 1 vida. Vidas restantes: ${'❤️ '.repeat(nextLives)}`
                    ]);
                    setCmdPlayerPos({ ...stageData.player });
                    setCmdHasKey(false);
                  }
                  return nextLives === 0 ? 3 : nextLives;
                });

                abortState.abort = true;
                setCmdScriptRunning(false);
                return;
              }

              if (result.win) {
                setCmdStatus('victory');
                setCmdPlayerAnim('victory');
                setCmdScriptRunning(false);
                playRetroSound('victory', soundOn);
                onEarnXP(100);
                abortState.abort = true;
                return;
              }
            } else {
              playRetroSound('select', soundOn);
              setCmdLog(prev => [...prev, `❌ Script parado devido a erro.`]);
              setCmdScriptRunning(false);
              abortState.abort = true;
              return;
            }

            await new Promise(resolve => setTimeout(resolve, 600));
          }
        }
        else if (stmt.type === 'repeat') {
          for (let r = 0; r < stmt.count; r++) {
            if (abortState.abort) return;
            await runBlock(stmt.body, depth + 1);
          }
        }
        else if (stmt.type === 'for') {
          const startVal = stmt.start;
          const endVal = stmt.end;
          let count = Math.abs(endVal - startVal) + 1;
          if (count > 50) count = 50;

          for (let r = 0; r < count; r++) {
            if (abortState.abort) return;
            await runBlock(stmt.body, depth + 1);
          }
        }
        else if (stmt.type === 'while') {
          let safety = 0;
          while (evaluateCondition(stmt.condition, currentPos, hasKey)) {
            if (abortState.abort) return;
            if (safety++ > 100) {
              throw new Error("Loop infinito detectado no bloco 'while'!");
            }
            await runBlock(stmt.body, depth + 1);
          }
        }
        else if (stmt.type === 'if') {
          const isTrue = evaluateCondition(stmt.condition, currentPos, hasKey);
          if (isTrue) {
            await runBlock(stmt.thenBody, depth + 1);
          } else if (stmt.elseBody && stmt.elseBody.length > 0) {
            await runBlock(stmt.elseBody, depth + 1);
          }
        }
      }
    };

    try {
      await runBlock(statements);
      if (!abortState.abort) {
        setCmdLog(prev => [...prev, `🏁 Script executado com sucesso.`]);
        setCmdScriptRunning(false);
      }
    } catch (err) {
      setCmdLog(prev => [...prev, `❌ Erro de Execução: ${err.message}`]);
      setCmdScriptRunning(false);
    }
  };

  const handleSingleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!cmdText.trim() || cmdScriptRunning || cmdStatus !== 'playing') return;
    
    const rawCmd = cmdText.trim();
    setCmdText('');
    setCmdHistory(prev => [...prev, rawCmd]);

    const result = processCommandText(rawCmd, cmdPlayerPos, cmdHasKey);
    setCmdLog(prev => [...prev, `> ${rawCmd}`, result.log]);

    if (result.success) {
      let newPos = { ...cmdPlayerPos };
      if (result.newPos) {
        newPos = result.newPos;
        setCmdPlayerPos(newPos);
        playRetroSound('select', soundOn);
      }
      if (result.grabKey) {
        setCmdHasKey(true);
        setCmdPlayerAnim('grab');
        playRetroSound('victory', soundOn);
        await new Promise(resolve => setTimeout(resolve, 650));
        setCmdPlayerAnim('idle');
      }

      // Check danger
      const isDanger = cmdDangers.some(dang => dang.x === newPos.x && dang.y === newPos.y);
      if (isDanger) {
        const stageData = CMD_STAGES.find(s => s.id === cmdStage) || CMD_STAGES[0];
        const isPit = stageData.dangerType === 'pit';

        setCmdPlayerAnim(isPit ? 'fall' : 'burn');
        playRetroSound('defeat', soundOn);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setCmdPlayerAnim('idle');

        setCmdLives(prevLives => {
          const nextLives = prevLives - 1;
          const hazardMsg = isPit 
            ? `🕳️ Calabouço fatal! Você caiu no abismo.` 
            : `🔥 Rio de fogo! Você se queimou nas chamas.`;
          
          if (nextLives === 0) {
            setCmdLog(prevLog => [
              ...prevLog,
              `${hazardMsg} 💀 MORTE! Você perdeu todos os corações ❤️. Voltando para o Estágio 1...`
            ]);
            setTimeout(() => {
              startCommandQuest(1, 3);
            }, 1200);
          } else {
            setCmdLog(prevLog => [
              ...prevLog,
              `${hazardMsg} Perdeu 1 vida. Vidas restantes: ${'❤️ '.repeat(nextLives)}`
            ]);
            setCmdPlayerPos({ ...stageData.player });
            setCmdHasKey(false);
          }
          return nextLives === 0 ? 3 : nextLives;
        });
        return;
      }

      if (result.win) {
        setCmdStatus('victory');
        setCmdPlayerAnim('victory');
        playRetroSound('victory', soundOn);
        onEarnXP(100);
      }
    } else {
      playRetroSound('select', soundOn);
    }
  };

  // Helper styles for animations
  const customAnimStyles = (
    <style>{`
      @keyframes floatArcade {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes shakeBurn {
        0%, 100% { transform: translate(0, 0) rotate(0deg); filter: drop-shadow(0 0 10px #ff3c3c) saturate(1.8); }
        20% { transform: translate(-2px, 2px) rotate(-1deg); }
        40% { transform: translate(2px, -2px) rotate(1deg); }
        60% { transform: translate(-2px, -2px) rotate(-1deg); }
        80% { transform: translate(2px, 2px) rotate(1deg); }
      }
      @keyframes fallPit {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; filter: blur(3px); }
      }
      @keyframes popVictory {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px gold); }
        50% { transform: scale(1.25); filter: drop-shadow(0 0 24px orange); }
      }
      @keyframes grabKeyPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3) translateY(-8px); filter: drop-shadow(0 0 12px yellow); }
        100% { transform: scale(1); }
      }
      .anim-burn {
        animation: shakeBurn 0.1s infinite;
      }
      .anim-fall {
        animation: fallPit 0.8s forwards;
      }
      .anim-victory-glow {
        animation: popVictory 1.2s infinite ease-in-out;
      }
      .anim-key-grab {
        animation: grabKeyPop 0.6s ease-out;
      }
      .ws-grid-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 950;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
      }
      @media (max-width: 600px) {
        .ws-grid-cell {
          font-size: 0.72rem !important;
          border-radius: 4px !important;
        }
      }
      @media (min-width: 601px) {
        .ws-grid-cell {
          font-size: 1.15rem !important;
          border-radius: 8px !important;
        }
      }
    `}</style>
  );

  const isFullscreen = activeGame !== null;

  return (
    <Box sx={isFullscreen ? {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      overflowY: 'auto',
      bgcolor: '#0a0d1a',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(124, 77, 255, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 180, 216, 0.05) 0%, transparent 40%)',
      p: { xs: 1, sm: 2, md: 4 },
      boxSizing: 'border-box',
      animation: 'fadeIn 0.4s ease'
    } : {
      mt: 1,
      animation: 'fadeIn 0.5s ease',
      position: 'relative'
    }}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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

          {/* Card 3: Pixel Command Quest */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              p: 3.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.4), rgba(72, 199, 142, 0.05))',
              border: '1px solid rgba(72, 199, 142, 0.2)',
              '&:hover': {
                border: '1px solid #48c78e',
                boxShadow: '0 8px 30px rgba(72, 199, 142, 0.15)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Box>
                <Typography fontSize={48} sx={{ mb: 1.5 }}>🧙‍♂️</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#48c78e' }}>
                  Pixel Command Quest
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3.5, lineHeight: 1.6 }}>
                  Digite comandos em inglês para mover o Mago pelo mapa. Pegue a chave de ouro e destranque o baú de tesouro! Suporta scripts de comando.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5, letterSpacing: 0.5 }}>
                  Selecione um Estágio (1 a 20):
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedStageMenu}
                    onChange={(e) => setSelectedStageMenu(Number(e.target.value))}
                    sx={{
                      color: '#fff',
                      bgcolor: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: 2.5,
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(72, 199, 142, 0.3)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#48c78e' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#48c78e' }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#0d1b2a',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          maxHeight: 300,
                          '& .MuiMenuItem-root': {
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            '&:hover': { bgcolor: 'rgba(72, 199, 142, 0.15)', color: '#fff' },
                            '&.Mui-selected': { bgcolor: 'rgba(72, 199, 142, 0.25)', color: '#fff', '&:hover': { bgcolor: 'rgba(72, 199, 142, 0.3)' } }
                          }
                        }
                      }
                    }}
                  >
                    {CMD_STAGES.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        Fase {s.id}: {s.name} {s.id >= 11 ? '🔥🕳️' : s.id >= 6 ? '🔄' : s.id >= 2 ? '⚡' : '🧙‍♂️'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => startCommandQuest(selectedStageMenu)}
                  sx={{
                    py: 1.2,
                    borderRadius: 2.5,
                    bgcolor: '#48c78e',
                    color: '#000',
                    fontWeight: 900,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#38a374' }
                  }}
                >
                  Jogar Estágio {selectedStageMenu} ➡️
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ────────────────── GAME 1: WORD SEARCH ────────────────── */}
      {activeGame === 'wordsearch' && (
        <Card sx={{ p: { xs: 1.5, sm: 3, md: 4 }, background: 'rgba(13, 27, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
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

              <Grid container spacing={{ xs: 2, md: 4 }}>
                <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{
                    bgcolor: 'rgba(0,0,0,0.25)',
                    p: { xs: 1, sm: 2, md: 2.5 },
                    borderRadius: 4,
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    width: '100%',
                    maxWidth: 420,
                    mx: 'auto',
                    boxSizing: 'border-box'
                  }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(10, 1fr)',
                      gap: { xs: '3px', sm: '6px', md: '8px' }
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
                                fontSize: { xs: '0.72rem', sm: '0.95rem', md: '1.15rem' },
                                bgcolor: bg,
                                border: border,
                                color: color,
                                boxShadow: shadow,
                                borderRadius: { xs: '4px', sm: '6px', md: '8px' },
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
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          Palavra Formada:
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#b388ff', letterSpacing: 1 }}>
                          {wsSelectedCells.map(cell => wsGrid[cell.r][cell.c]).join('')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}>
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

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#00b4d8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 650 }}>
                    Aguardando conexão...
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleCancelCoopRoom}
                  sx={{
                    mt: 2,
                    color: 'rgba(255,255,255,0.6)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ff5a79',
                      color: '#ff5a79',
                      bgcolor: 'rgba(255, 90, 121, 0.05)'
                    }
                  }}
                >
                  Cancelar Batalha ❌
                </Button>
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
                      👥 Jogando em Dupla: {Object.values(coopPlayers || {}).map(p => p.name).join(' & ')}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Chip
                    label={`Monstro: ${battleStage === 1 ? '🟢 Slime' : battleStage === 2 ? '💀 Skeleton' : '👿 Shadow Dragon'}`}
                    color={rpgMode === 'coop' ? "secondary" : "primary"}
                    sx={{ fontWeight: 900 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleLeaveRpgMatch(false)}
                    sx={{ 
                      borderRadius: 2, 
                      fontWeight: 800, 
                      borderColor: 'rgba(255, 90, 121, 0.3)',
                      color: '#ff5a79',
                      bgcolor: 'rgba(255, 90, 121, 0.05)',
                      textTransform: 'none',
                      height: 32,
                      '&:hover': {
                        borderColor: '#ff5a79',
                        bgcolor: 'rgba(255, 90, 121, 0.12)'
                      }
                    }}
                  >
                    Abandonar ❌
                  </Button>
                </Box>
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
                        Object.entries(coopPlayers || {}).map(([id, p]) => {
                          const isDead = p.hp === 0;
                          return (
                            <Typography key={id} variant="caption" sx={{ fontWeight: 800, color: isDead ? '#ff5a79' : '#48c78e' }}>
                              {(p.name || 'Jogador').substring(0,8).toUpperCase()}: {isDead ? '💀 MORREU' : `${p.hp}/100 HP`}
                              {!isDead && p.consecutiveCorrect > 0 && ` (Combo: ${p.consecutiveCorrect}/4 🔥)`}
                            </Typography>
                          );
                        })
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
                rpgMode === 'coop' && (coopPlayers[userId]?.hp ?? 100) === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 5, 
                    px: 3,
                    animation: 'fadeIn 0.4s ease', 
                    bgcolor: 'rgba(255, 90, 121, 0.04)', 
                    border: '1px dashed rgba(255, 90, 121, 0.2)', 
                    borderRadius: 4,
                    mb: 3
                  }}>
                    <Typography fontSize={48} sx={{ mb: 1.5 }}>💀</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#ff5a79' }}>
                      Você foi Derrotado!
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 450, mx: 'auto', lineHeight: 1.6 }}>
                      Seu HP chegou a 0. Você não pode mais responder perguntas nesta batalha. Aguarde seu parceiro derrotar o monstro para vencerem juntos!
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
                    <Box sx={{ p: 3, bgcolor: rpgMode === 'coop' ? 'rgba(179, 136, 255, 0.05)' : 'rgba(0, 180, 216, 0.05)', borderLeft: `4px solid ${rpgMode === 'coop' ? '#b388ff' : '#00b4d8'}`, borderRadius: 3, mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: rpgMode === 'coop' ? '#b388ff' : '#00b4d8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                          ⚔️ VOCABULARY QUEST
                        </Typography>
                        <Chip
                          label={`${timeLeft}s ⏱️`}
                          size="small"
                          color={timeLeft <= 4 ? "error" : "default"}
                          sx={{ 
                            fontWeight: 800, 
                            height: 20, 
                            fontSize: '0.75rem',
                            bgcolor: timeLeft <= 4 ? '#ff5a79' : 'rgba(255,255,255,0.06)',
                            color: '#fff'
                          }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', mb: 2.5 }}>
                        {BATTLE_QUESTIONS[currentQuestIdx]?.q || 'Carregando...'}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(timeLeft / 13) * 100}
                        color={timeLeft <= 4 ? "error" : rpgMode === 'coop' ? "secondary" : "primary"}
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      {(BATTLE_QUESTIONS[currentQuestIdx]?.options || []).map((opt) => (
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
                )
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
                    {rpgMode === 'solo' ? (
                      <Button
                        variant="contained"
                        onClick={startSoloBattle}
                        sx={{ bgcolor: '#48c78e', '&:hover': { bgcolor: '#38a374' }, fontWeight: 900, borderRadius: 2.5 }}
                      >
                        Jogar Novamente 🔁
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleLeaveRpgMatch(false)}
                        sx={{ bgcolor: '#b388ff', '&:hover': { bgcolor: '#9c27b0' }, fontWeight: 900, borderRadius: 2.5 }}
                      >
                        Voltar ao Lobby Co-op 👥
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => handleLeaveRpgMatch(true)}
                      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, borderRadius: 2.5 }}
                    >
                      Voltar ao Menu
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Defeat View */}
              {battleStatus === 'defeat' && (
                <Box sx={{ textAlign: 'center', py: 4, animation: 'fadeIn 0.5s ease' }}>
                  <Typography fontSize={64} sx={{ mb: 1 }}>💀</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 950, color: '#ff5a79', mb: 1 }}>
                    DERROTA!
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#b3c5d7', mb: 3.5 }}>
                    O monstro derrotou você! Estude o vocabulário e tente novamente.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {rpgMode === 'solo' ? (
                      <Button
                        variant="contained"
                        onClick={startSoloBattle}
                        sx={{ bgcolor: '#ff5a79', '&:hover': { bgcolor: '#ff3b5c' }, fontWeight: 900, borderRadius: 2.5 }}
                      >
                        Tentar Novamente 🔁
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handleLeaveRpgMatch(false)}
                        sx={{ bgcolor: '#b388ff', '&:hover': { bgcolor: '#9c27b0' }, fontWeight: 900, borderRadius: 2.5 }}
                      >
                        Voltar ao Lobby Co-op 👥
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => handleLeaveRpgMatch(true)}
                      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, borderRadius: 2.5 }}
                    >
                      Voltar ao Menu
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Card>
      )}

      {/* ────────────────── GAME 3: PIXEL COMMAND QUEST ────────────────── */}
      {activeGame === 'command' && (
        <Card sx={{ p: { xs: 1, sm: 3, md: 4 }, background: 'rgba(13, 27, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)', mb: { xs: '320px', sm: 4 } }}>
          {/* Header Bar */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#48c78e' }}>
                Pixel Command Quest: Estágio {cmdStage} — {CMD_STAGES.find(s => s.id === cmdStage)?.name || ""}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.5 }}>
                {CMD_STAGES.find(s => s.id === cmdStage)?.tip || ""}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              {/* Hearts / Lives indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  Vidas:
                </Typography>
                <Typography sx={{ fontSize: '1.2rem', letterSpacing: 1.5, userSelect: 'none' }}>
                  {'❤️'.repeat(cmdLives)}
                  {'🖤'.repeat(3 - cmdLives)}
                </Typography>
              </Box>

              <Chip
                label={cmdHasKey ? "🔑 Chave Coletada" : "🔒 Procurando Chave"}
                color={cmdHasKey ? "success" : "warning"}
                sx={{ fontWeight: 900 }}
              />
            </Box>
          </Box>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* GRID MAP AREA */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{
                bgcolor: 'rgba(0,0,0,0.3)',
                p: { xs: 0.5, sm: 2 },
                borderRadius: 4,
                border: '1.5px solid rgba(255,255,255,0.06)',
                width: '100%',
                maxWidth: { xs: '100%', sm: 500, md: 520 },
                boxSizing: 'border-box',
                mx: 'auto'
              }}>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: { xs: '3px', sm: '6px', md: '8px' },
                  bgcolor: '#0d1117',
                  p: { xs: '4px', sm: '8px' },
                  borderRadius: 3
                }}>
                  {Array.from({ length: 6 }).map((_, y) => 
                    Array.from({ length: 6 }).map((_, x) => {
                      const isPlayer = cmdPlayerPos.x === x && cmdPlayerPos.y === y;
                      const isKey = cmdKeyPos.x === x && cmdKeyPos.y === y && !cmdHasKey;
                      const isChest = cmdChestPos.x === x && cmdChestPos.y === y;
                      const isObstacle = cmdObstacles.some(obs => obs.x === x && obs.y === y);
                      const isDanger = cmdDangers.some(dang => dang.x === x && dang.y === y);

                      let bg = 'rgba(0, 180, 216, 0.08)';
                      let border = '1px solid rgba(0, 180, 216, 0.18)';
                      let shadow = 'none';

                      if (isObstacle) {
                        bg = 'rgba(255,255,255,0.05)';
                        border = '1px solid rgba(255,255,255,0.15)';
                      } else if (isDanger) {
                        const isPit = currentStageData.dangerType === 'pit';
                        bg = isPit ? 'rgba(5, 12, 24, 0.65)' : 'rgba(255, 90, 121, 0.15)';
                        border = isPit ? '1px solid rgba(0, 180, 216, 0.25)' : '1px solid #ff5a79';
                      } else if (isPlayer) {
                        bg = 'rgba(72, 199, 142, 0.15)';
                        border = '1px solid #48c78e';
                        shadow = '0 0 10px rgba(72, 199, 142, 0.25)';
                      } else if (isKey) {
                        bg = 'rgba(255, 183, 77, 0.08)';
                        border = '1px dashed rgba(255, 183, 77, 0.4)';
                      } else if (isChest) {
                        bg = 'rgba(124, 77, 255, 0.12)';
                        border = '1px solid #7c4dff';
                      }

                      return (
                        <Box
                          key={`${x}-${y}`}
                          sx={{
                            aspectRatio: '1/1',
                            bgcolor: bg,
                            border: border,
                            boxShadow: shadow,
                            borderRadius: '6px',
                            display: 'flex',
                            position: 'relative',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.25s ease',
                            fontSize: { xs: '2.0rem', sm: '2.1rem', md: '2.3rem' },
                            '&:hover': {
                              bgcolor: isPlayer ? bg : 'rgba(0, 180, 216, 0.18)'
                            }
                          }}
                        >
                          {/* Element rendering */}
                          {isPlayer ? (
                            <Box 
                              className={
                                cmdPlayerAnim === 'burn' ? 'anim-burn' :
                                cmdPlayerAnim === 'fall' ? 'anim-fall' :
                                cmdPlayerAnim === 'victory' ? 'anim-victory-glow' :
                                cmdPlayerAnim === 'grab' ? 'anim-key-grab' : ''
                              }
                              sx={{ 
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(cmdPlayerAnim === 'idle' ? {
                                  animation: 'pulsePlayer 2s infinite ease-in-out',
                                  '@keyframes pulsePlayer': {
                                    '0%, 100%': { transform: 'scale(1)' },
                                    '50%': { transform: 'scale(1.18)' }
                                  }
                                } : {})
                              }}
                            >
                              🧙‍♂️
                            </Box>
                          ) : (
                            <>
                              {isKey && '🔑'}
                              {isChest && (cmdStatus === 'victory' ? '🔓' : '🔒')}
                              {isObstacle && '🧱'}
                              {isDanger && (currentStageData.dangerType === 'pit' ? '🕳️' : '🔥')}
                            </>
                          )}

                          {/* Mini overlay icon in top-left when player is on an item */}
                          {isPlayer && (
                            <>
                              {isKey && (
                                <Box sx={{ position: 'absolute', top: 2, left: 4, fontSize: '0.55em', lineHeight: 1 }}>
                                  🔑
                                </Box>
                              )}
                              {isChest && (
                                <Box sx={{ position: 'absolute', top: 2, left: 4, fontSize: '0.55em', lineHeight: 1 }}>
                                  {cmdStatus === 'victory' ? '🔓' : '🔒'}
                                </Box>
                              )}
                              {isDanger && (
                                <Box sx={{ position: 'absolute', top: 2, left: 4, fontSize: '0.55em', lineHeight: 1 }}>
                                  {currentStageData.dangerType === 'pit' ? '🕳️' : '🔥'}
                                </Box>
                              )}
                            </>
                          )}

                          {/* Faint coordinates */}
                          <Typography sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 4,
                            fontSize: '0.55rem',
                            color: 'rgba(255,255,255,0.12)',
                            userSelect: 'none',
                            display: { xs: 'none', sm: 'block' }
                          }}>
                            {x},{y}
                          </Typography>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Box>

              {/* Status / Win Message moved below Option B */}
              <Box sx={{ display: 'none' }} />
            </Grid>

            {/* COLUMN 2: OPTION B (SCRIPT EDITOR) */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card sx={{ 
                p: 3, 
                bgcolor: 'rgba(0,0,0,0.2)', 
                border: '1.5px solid rgba(255,255,255,0.06)', 
                borderRadius: 4,
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    💻 OPÇÃO B: Escrever um Script Completo (Múltiplas Linhas)
                  </Typography>
                  <Box sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column', mb: 1.5 }}>
                    <Box
                      component="textarea"
                      id="cmd-script-editor"
                      placeholder={`Digite um comando por linha. Ex:\nright\nright\ndown\ngrab key`}
                      disabled={cmdScriptRunning || cmdStatus !== 'playing'}
                      sx={{
                        width: '100%',
                        height: { xs: '120px', md: '180px' },
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        color: '#cbd5e1',
                        padding: '12px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        resize: 'none',
                        outline: 'none',
                        flexGrow: 1
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={cmdScriptRunning || cmdStatus !== 'playing'}
                      onClick={() => {
                        const val = document.getElementById('cmd-script-editor').value;
                        runCommandScript(val);
                      }}
                      sx={{
                        bgcolor: '#b388ff',
                        color: '#000',
                        fontWeight: 900,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#7c4dff' }
                      }}
                    >
                      Executar Script ⚡
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={cmdScriptRunning || cmdStatus !== 'playing'}
                      onClick={() => {
                        let exampleText = "";
                        if (cmdStage === 1) {
                          exampleText = "right\nright\ndown\ndown\ngrab key\ndown\ndown\nright\nright\nopen chest";
                        } else if (cmdStage >= 2 && cmdStage < 6) {
                          exampleText = "define diag\n  right\n  down\nend\ndiag\ndiag\ndiag\ngrab key\ndiag\ndiag\nopen chest";
                        } else if (cmdStage >= 6) {
                          exampleText = "repeat 5\n  right\nend\ngrab key\nrepeat 5\n  down\nend\nopen chest";
                        }
                        document.getElementById('cmd-script-editor').value = exampleText;
                        playRetroSound('select', soundOn);
                      }}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: '#ccc',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' }
                      }}
                    >
                      Carregar Exemplo 💡
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={cmdScriptRunning}
                      onClick={() => {
                        setCmdLog([`🧹 Console limpo.`]);
                        playRetroSound('select', soundOn);
                      }}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: '#ff8fa3',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(255,143,163,0.04)' }
                      }}
                    >
                      Limpar Log
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => startCommandQuest(cmdStage)}
                      disabled={cmdScriptRunning}
                      sx={{
                        borderRadius: 2,
                        borderColor: 'rgba(72, 199, 142, 0.25)',
                        color: '#48c78e',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#48c78e', bgcolor: 'rgba(72,199,142,0.04)' }
                      }}
                    >
                      ↺ Resetar Fase
                    </Button>
                  </Box>
                </Box>
              </Card>

              {/* Status / Win Message */}
              {cmdStatus === 'victory' ? (
                <Box sx={{ p: 2.5, bgcolor: 'rgba(72, 199, 142, 0.08)', border: '1px solid rgba(72, 199, 142, 0.25)', borderRadius: 3.5, width: '100%', maxWidth: '100%', textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
                  <Typography variant="h6" sx={{ color: '#48c78e', fontWeight: 900, mb: 1 }}>
                    🏆 Missão Concluída!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                    Você usou os comandos perfeitamente e abriu o baú! Recebeu +100 XP extras.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => {
                        if (cmdStage < 20) startCommandQuest(cmdStage + 1);
                        else startCommandQuest(1);
                      }}
                      sx={{ bgcolor: '#48c78e', '&:hover': { bgcolor: '#38a374' }, fontWeight: 800, borderRadius: 2.5 }}
                    >
                      {cmdStage < 20 ? `Próximo Estágio (${cmdStage + 1}) ➡️` : "Reiniciar Jogo"}
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => setActiveGame(null)}
                      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, borderRadius: 2.5 }}
                    >
                      Sair
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 2.5, bgcolor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 3.5, width: '100%', maxWidth: '100%', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#00b4d8', fontWeight: 900, mb: 1 }}>
                    {cmdScriptRunning ? "⚡ Executando Instruções..." : "🧙‍♂️ Mago Pronto"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                    {cmdScriptRunning 
                      ? "O mago está executando os comandos enviados na ordem correta." 
                      : "Escreva instruções na OPÇÃO A ou OPÇÃO B ao lado para controlar o mago."}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      disabled
                      sx={{ 
                        borderColor: 'rgba(0, 180, 216, 0.25)', 
                        color: '#00b4d8', 
                        fontWeight: 800, 
                        borderRadius: 2.5,
                        "&.Mui-disabled": {
                          borderColor: 'rgba(0, 180, 216, 0.25)',
                          color: '#00b4d8'
                        }
                      }}
                    >
                      Estágio {cmdStage} / 20
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* ROW 2: LOG, TUTORIAL, OPTION A, AND OTHER CONTROLS */}
            <Grid item xs={12}>
              <Grid container spacing={3.5}>
                {/* Column 1 of Row 2: Tutorial & Syntax Guide */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, height: '100%' }}>
                    {/* Collapsible dynamic tutorial */}
                    <Box sx={{
                      mb: 2,
                      borderRadius: 3.5,
                      bgcolor: 'rgba(0, 180, 216, 0.05)',
                      border: '1px solid rgba(0, 180, 216, 0.15)',
                      borderLeft: '4px solid #00b4d8',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      <Box 
                        onClick={() => setShowCmdTutorial(!showCmdTutorial)}
                        sx={{ 
                          p: 1.5, 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          bgcolor: 'rgba(0, 180, 216, 0.04)',
                          '&:hover': { bgcolor: 'rgba(0, 180, 216, 0.08)' }
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00b4d8', display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 0.5, userSelect: 'none' }}>
                          💡 Tutorial da Fase {cmdStage}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800, fontSize: '0.7rem' }}>
                          {showCmdTutorial ? "OCULTAR ➖" : "MOSTRAR ➕"}
                        </Typography>
                      </Box>
                      {showCmdTutorial && (
                        <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 180, 216, 0.1)', animation: 'fadeIn 0.25s ease' }}>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', display: 'block', fontSize: '0.78rem', lineHeight: 1.5 }}>
                            {cmdStage === 1 && "Escreva comandos passo a passo em inglês para mover o Mago 🧙‍♂️. Ex: 'right' para ir à direita, 'down' para descer. Use 'grab key' para coletar a chave (🔑) e depois 'open chest' para abrir o baú (🔒)."}
                            {cmdStage === 2 && (
                              <span>
                                <strong>Funções (Fase 2+):</strong> Crie blocos de código reutilizáveis! Escreva:
                                <pre style={{ margin: '6px 0', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontFamily: 'monospace', color: '#a5d6a7', fontSize: '0.75rem' }}>
{`define turn
  right
  down
end
turn`}
                                </pre>
                                Defina com <code>define nome</code>, coloque as ações, feche com <code>end</code> e chame pelo nome!
                              </span>
                            )}
                            {cmdStage === 3 && "Use Funções para planejar caminhos eficientes, desviando dos blocos de muro 🧱. Escreva seu código no Console Multilinhas e aperte Executar Script!"}
                            {cmdStage === 4 && (
                              <span>
                                <strong>Condicionais (Fase 4+):</strong> Tome decisões no código com <code>if</code> e <code>else</code>!
                                <pre style={{ margin: '6px 0', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontFamily: 'monospace', color: '#a5d6a7', fontSize: '0.75rem' }}>
{`if on key
  grab key
else
  right
end`}
                                </pre>
                                Condições válidas: <code>has key</code>, <code>on key</code>, <code>on chest</code>, <code>free right/left/up/down</code>.
                              </span>
                            )}
                            {cmdStage === 5 && "Combine Condicionais! Verifique se uma direção está livre antes de se mover. Ex: 'if free down' ... 'end'."}
                            {cmdStage === 6 && (
                              <span>
                                <strong>Loops de Repetição (Fase 6+):</strong> Escreva menos linhas repetindo comandos! Escreva:
                                <pre style={{ margin: '6px 0', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontFamily: 'monospace', color: '#a5d6a7', fontSize: '0.75rem' }}>
{`repeat 4
  right
end`}
                                </pre>
                                Isso fará o mago andar 4 passos para a direita. Use <code>repeat [vezes]</code> e feche com <code>end</code>!
                              </span>
                            )}
                            {cmdStage === 7 && "Combine Funções, Loops e Condicionais! Crie comandos inteligentes para navegar com segurança e eficiência."}
                            {cmdStage === 8 && (
                              <span>
                                <strong>Loops com Variáveis (Fase 8+):</strong> Faça loops de contagem clássicos com <code>for</code>!
                                <pre style={{ margin: '6px 0', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontFamily: 'monospace', color: '#a5d6a7', fontSize: '0.75rem' }}>
{`for x 1 to 5
  right
end`}
                                </pre>
                                Isso repetirá o bloco 5 vezes.
                              </span>
                            )}
                            {cmdStage === 9 && "Use Loops com For! Isso ajuda a modularizar o número de passos que você quer que o Mago execute em retas compridas."}
                            {cmdStage === 10 && (
                              <span>
                                <strong>Loops Condicionais (Fase 10+):</strong> Repita ações baseando-se no cenário com <code>while</code>!
                                <pre style={{ margin: '6px 0', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, fontFamily: 'monospace', color: '#a5d6a7', fontSize: '0.75rem' }}>
{`while not has key
  right
end
grab key`}
                                </pre>
                                O mago andará para a direita repetidamente até estar sobre a chave para coletá-la!
                              </span>
                            )}
                            {cmdStage > 10 && cmdStage < 20 && "Estágio Avançado! Use todas as estruturas aprendidas (functions, repeat, if/else, for e while) para desviar das lava e poços com o menor número de linhas possível."}
                            {cmdStage === 20 && "O DESAFIO FINAL! Use funções, condicionais e loops combinados para coletar a chave e escapar de vez do abismo do mago!"}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Syntax Help Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                        📖 Guia Rápido de Referência:
                      </Typography>
                      <Button 
                        size="small"
                        onClick={() => setShowCmdHelp(!showCmdHelp)}
                        sx={{ fontSize: '0.72rem', textTransform: 'none', color: '#48c78e', fontWeight: 800 }}
                      >
                        {showCmdHelp ? "Ocultar Guia ➖" : "Guia de Sintaxe ➕"}
                      </Button>
                    </Box>

                    {/* Collapsible Syntax Tutorial */}
                    {showCmdHelp && (
                      <Box sx={{
                        p: 2,
                        bgcolor: 'rgba(72, 199, 142, 0.04)',
                        border: '1px dashed rgba(72, 199, 142, 0.25)',
                        borderRadius: 3.5,
                        animation: 'fadeIn 0.3s ease',
                        fontSize: '0.8rem', 
                        color: '#cbd5e1',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5
                      }}>
                        <Box>
                          <strong style={{ color: '#fff' }}>1. Comandos Básicos (Fase 1+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>left</code>, <code>right</code>, <code>up</code>, <code>down</code> — Mover.<br />
                            <code>grab key</code> — Coletar chave 🔑.<br />
                            <code>open chest</code> — Abrir baú 🔒.
                          </div>
                        </Box>
                        <Box>
                          <strong style={{ color: '#fff' }}>2. Funções (Fase 2+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>define [nome]</code> ... <code>end</code> — Criar função.
                          </div>
                        </Box>
                        <Box>
                          <strong style={{ color: '#fff' }}>3. Condicionais (Fase 4+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>if [condição]</code> ... <code>else</code> ... <code>end</code><br />
                            <em>Condições:</em> <code>has key</code>, <code>on key</code>, <code>on chest</code>, <code>free right/left/up/down</code>, <code>danger right/left/up/down</code>.
                          </div>
                        </Box>
                        <Box>
                          <strong style={{ color: '#fff' }}>4. Loops Repeat (Fase 6+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>repeat [vezes]</code> ... <code>end</code> — Repetir bloco.
                          </div>
                        </Box>
                        <Box>
                          <strong style={{ color: '#fff' }}>5. Loops For (Fase 8+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>for x 1 to [vezes]</code> ... <code>end</code> — Contagem clássica.
                          </div>
                        </Box>
                        <Box>
                          <strong style={{ color: '#fff' }}>6. Loops While (Fase 10+):</strong>
                          <div style={{ paddingLeft: 8, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            <code>while [condição]</code> ... <code>end</code> — Repetir enquanto verdade.
                          </div>
                        </Box>
                      </Box>
                    )}
                  </Card>
                </Grid>

                {/* Column 2 of Row 2: Log, Option A & Bottom Controls */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5, letterSpacing: 0.5 }}>
                        💻 Terminal de Execução:
                      </Typography>
                      {/* Terminal history output box */}
                      <Box sx={{
                        bgcolor: '#090d16',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 3,
                        p: 2,
                        height: 110,
                        overflowY: 'auto',
                        fontFamily: 'monospace, Courier New',
                        fontSize: '0.82rem',
                        mb: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                      }}>
                        {cmdLog.map((log, idx) => (
                          <Typography 
                            key={idx} 
                            sx={{ 
                              fontFamily: 'monospace, Courier New',
                              fontSize: '0.82rem',
                              color: log.startsWith('❌') ? '#ff5a79' : log.startsWith('>') ? '#b388ff' : log.startsWith('🚶') || log.startsWith('🔑') || log.startsWith('🔓') ? '#48c78e' : 'rgba(255,255,255,0.7)',
                              pl: log.startsWith('>') ? 0 : 1.5
                            }}
                          >
                            {log}
                          </Typography>
                        ))}
                      </Box>

                      {/* Option A: Single Command */}
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, display: 'block', mb: 1 }}>
                        OPÇÃO A: Enviar um comando de cada vez (Modo Interativo)
                      </Typography>
                      <Box component="form" onSubmit={handleSingleCommandSubmit} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField
                          size="small"
                          fullWidth
                          value={cmdText}
                          onChange={(e) => setCmdText(e.target.value)}
                          placeholder="Ex: right, left, up, down, grab key, open chest..."
                          disabled={cmdScriptRunning || cmdStatus !== 'playing'}
                          InputProps={{
                            sx: {
                              color: '#fff',
                              bgcolor: 'rgba(0,0,0,0.25)',
                              borderRadius: 2.5,
                              fontSize: '0.88rem',
                              fontFamily: 'monospace',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                              '&.Mui-focused fieldset': { borderColor: '#48c78e !important' }
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          disabled={cmdScriptRunning || cmdStatus !== 'playing'}
                          sx={{
                            bgcolor: '#48c78e',
                            color: '#000',
                            fontWeight: 900,
                            borderRadius: 2.5,
                            px: 3,
                            '&:hover': { bgcolor: '#38a374' }
                          }}
                        >
                          Enviar
                        </Button>
                      </Box>
                    </Box>

                    {/* Reset / Voltar Buttons */}
                    <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', pt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          playRetroSound('select', soundOn);
                          setActiveGame(null);
                        }}
                        disabled={cmdScriptRunning}
                        sx={{
                          borderRadius: 2.5,
                          borderColor: 'rgba(255,255,255,0.15)',
                          color: '#fff',
                          textTransform: 'none',
                          '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.04)' }
                        }}
                      >
                        ↺ Voltar ao Menu
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
