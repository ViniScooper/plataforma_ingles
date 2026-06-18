import React, { useState, useEffect } from 'react';
import { Box, Dialog, IconButton, Grid, Button, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import './StudentAvatar.css';

export const darkenColor = (color, percent) => {
  if (!color || typeof color !== 'string') return '#000000';
  let hex = color.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  if (hex.length !== 6) return color;
  const num = parseInt(hex, 16);
  const r = Math.floor((num >> 16) * (1 - percent));
  const g = Math.floor(((num >> 8) & 0x00FF) * (1 - percent));
  const b = Math.floor((num & 0x0000FF) * (1 - percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const lightenColor = (color, percent) => {
  if (!color || typeof color !== 'string') return '#ffffff';
  let hex = color.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
  if (hex.length !== 6) return color;
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const presets = {
  'Masculino': { gender: 'male',   hairstyle: 'curto',    hairColor: '#6B4423', skinTone: '#E6B89A', eyeColor: '#111111', eyeStyle: 'normal',   mouthStyle: 'normal',   eyebrowStyle: 'normal',  clothingStyle: 'casual',    clothingColor: '#3498DB', pantsColor: '#2C3E50', shoesColor: '#1e293b', hatStyle: 'nenhum',        weaponStyle: 'nenhuma' },
  'Feminino':  { gender: 'female', hairstyle: 'comprido', hairColor: '#C9843E', skinTone: '#E6B89A', eyeColor: '#2D5A3D', eyeStyle: 'normal',   mouthStyle: 'sorriso',  eyebrowStyle: 'normal',  clothingStyle: 'vestido',   clothingColor: '#E91E8C', pantsColor: '#C2185B', shoesColor: '#E91E8C', hatStyle: 'nenhum',        weaponStyle: 'nenhuma' },
};

const HAIRSTYLES = ['liso','comprido','espetado','cacheado','rabo-de-cavalo','trancas','moicano','chonmage','afro','curto'];
const CLOTHING_STYLES_FREE = ['casual','esportivo','elegante','aventura','vestido'];

const SKIN_TONES = [
  { name: 'Muito Clara',   color: '#FDDBB4' },
  { name: 'Clara',         color: '#F5C9A0' },
  { name: 'Média Clara',   color: '#E6B89A' },
  { name: 'Média',         color: '#D4A574' },
  { name: 'Morena',        color: '#C49A6C' },
  { name: 'Morena Escura', color: '#A0826D' },
  { name: 'Escura',        color: '#8B6D5C' },
  { name: 'Muito Escura',  color: '#6B5044' },
];

const HAIR_COLORS = [
  '#111111','#3B2010','#6B4423','#8B6F47','#C9843E',
  '#FFD700','#E8B4B8','#D946A8','#5C8A9F','#86C06E',
  '#4A90D9','#FF6B35','#48c78e','#9B59B6','#F5F5F5',
];

const EYE_COLORS = [
  '#111111','#3E2010','#6B5D52','#3E6A8C','#2D5A3D',
  '#6C3A7C','#C0392B','#2980B9','#27AE60','#8E44AD',
  '#F39C12','#1ABC9C',
];

const CLOTHING_COLORS = [
  '#E74C3C','#C0392B','#E67E22','#F39C12','#F1C40F',
  '#2ECC71','#1ABC9C','#3498DB','#2980B9','#9B59B6',
  '#8E44AD','#ECF0F1','#BDC3C7','#34495E','#1A1A2E',
  '#FF6B9D','#00B4D8','#48c78e','#8B4513','#FFD700',
];

const PANTS_COLORS = [
  '#1A1A1A','#2C3E50','#34495E','#3E4A4E','#5C6F7E',
  '#6B4423','#4A3F35','#7F8C8D','#8B6F47','#5C4D38',
  '#1A237E','#4A148C','#B71C1C','#1B5E20','#E65100',
];

const SHOE_COLORS = [
  '#111111','#1e293b','#ffffff','#E74C3C','#8B4513',
  '#7F8C8D','#FFD700','#E91E8C','#2980B9','#27AE60',
];

// ─── Improved 16×16 pixel art patterns ────────────────────────────────────────

export const getAvatarGrid = (avatar) => {
  let grid = Array.from({length: 16}, () => Array(16).fill('0'));

  const set = (x, y, char) => { if (y >= 0 && y < 16 && x >= 0 && x < 16) grid[y][x] = char; };

  const drawPattern = (pattern, defaultChar) => {
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        const ch = pattern[y][x];
        if (ch !== '0' && ch !== '.') grid[y][x] = defaultChar || ch;
      }
    }
  };

  // ── Improved body with outline, neck and shading ──
  const body = [
    "0000000000000000",
    "0000001111000000",  // neck outline
    "000000SSSS000000",  // neck
    "00000SsSsSS00000",
    "0000SSSsSSSS0000",  // upper torso
    "0000SSSsSSSS0000",
    "0000SSSsSSSS0000",
    "00000SsSSSS00000",
    "0000000SS0000000",  // waist
    "00000SSSSSS00000",
    "000SS0SSSS0SS000",  // arms
    "000SS0SSSS0SS000",
    "000Ss0SSSS0Ss000",  // arm shadow
    "000000SSSS000000",  // legs top
    "000000SSSS000000",
    "0000000000000000",
  ];
  drawPattern(body, 'S');

  // ── Eyes ──
  const eyeStyle = avatar.eyeStyle || 'normal';
  if (eyeStyle === 'normal') {
    set(5,4,'1'); set(6,4,'1');
    set(5,5,'E'); set(6,5,'E');
    set(9,4,'1'); set(10,4,'1');
    set(9,5,'E'); set(10,5,'E');
    // eye shine
    set(6,4,'W'); set(10,4,'W');
  } else if (eyeStyle === 'feliz') {
    set(5,4,'1'); set(6,4,'1'); set(7,5,'1');
    set(9,4,'1'); set(10,4,'1'); set(8,5,'1');
  } else if (eyeStyle === 'piscando') {
    set(5,4,'1'); set(6,4,'1');
    set(5,5,'E'); set(6,5,'E'); set(6,4,'W');
    set(9,5,'1'); set(10,5,'1'); // closed eye as line
  } else if (eyeStyle === 'sonolento') {
    set(5,5,'1'); set(6,5,'1');
    set(9,5,'1'); set(10,5,'1');
  } else if (eyeStyle === 'bravo') {
    set(5,4,'1'); set(6,4,'1');
    set(5,5,'E'); set(6,5,'E');
    set(9,4,'1'); set(10,4,'1');
    set(9,5,'E'); set(10,5,'E');
  }

  if (avatar.gender === 'female') {
    if (eyeStyle === 'normal') { set(4,4,'1'); set(11,4,'1'); }
  }

  // ── Mouth ──
  const mouthStyle = avatar.mouthStyle || 'normal';
  if (mouthStyle === 'normal') {
    set(7,6,'M'); set(8,6,'M');
  } else if (mouthStyle === 'sorriso') {
    set(6,6,'S'); set(7,7,'M'); set(8,7,'M'); set(9,6,'S');
    set(7,6,'1'); set(8,6,'1');
  } else if (mouthStyle === 'surpreso') {
    set(7,6,'M'); set(8,6,'M'); set(7,7,'M'); set(8,7,'M');
  } else if (mouthStyle === 'triste') {
    set(7,7,'M'); set(8,7,'M'); set(6,7,'1'); set(9,7,'1');
  } else if (mouthStyle === 'grito') {
    set(6,6,'1'); set(7,6,'M'); set(8,6,'M'); set(9,6,'1');
    set(7,7,'M'); set(8,7,'M');
  }

  // ── Eyebrows ──
  const eyebrowStyle = avatar.eyebrowStyle || 'nenhuma';
  if (eyebrowStyle === 'normal') {
    set(5,3,'H'); set(6,3,'H'); set(9,3,'H'); set(10,3,'H');
  } else if (eyebrowStyle === 'brava') {
    set(4,2,'H'); set(5,3,'H'); set(6,3,'H');
    set(10,3,'H'); set(11,2,'H'); set(9,3,'H');
  } else if (eyebrowStyle === 'triste') {
    set(5,2,'H'); set(6,3,'H');
    set(9,2,'H'); set(10,3,'H');
  } else if (eyebrowStyle === 'arqueada') {
    set(5,2,'H'); set(6,3,'H'); set(7,3,'H');
    set(10,2,'H'); set(9,3,'H'); set(8,3,'H');
  }

  // ── Nose (subtle) ──
  set(7, 6, avatar.gender === 'female' ? 'S' : 's');

  // ── Clothing ──
  const clothesStyles = {
    'casual': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRRR00000","000RR0RRrR0RR000","000RR0RRRr0RR000",
      "000Rr0RRRR0Rr000","00000dDDDDd00000","000000dDDd000000","00000cC00Cc00000",
    ],
    'esportivo': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "00000WWWWW000000","0000RRRRRRRR0000","000RW0RrWW0WR000","0000W0RWRW00W000",
      "000RR0RRRR0RR000","00000DDDDDD00000","000000dDDd000000","00000CC00CC00000",
    ],
    'elegante': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000WW0000000","00000RRRRRR00000","000RR0RRrR0RR000","000RR0WWRR0RR000",
      "000Rr0RRRW0Rr000","00000DDDDDD00000","000000dDDd000000","00000CC00CC00000",
    ],
    'aventura': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000R7777R000000","000RR07r70RR00000","000000RRrR000000",
      "000000R77R000000","00000DDDDDD00000","000000dDDd000000","00000CC00CC00000",
    ],
    'vestido': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRR000000","000000RrRR000000","0000RRRRRRR00000",
      "000RRRRRRRRRR000","00RRRrRRRrRRR000","0RRRRRRRRRRRRR00","00000CC00CC00000",
    ],
    'vestido-real': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRYRR000000","000000RYYY000000","0000RRYYYYR00000",
      "000RRYYYRYYRR000","00RRrYYRRYYrRR00","0RRRRRrRRrRRRRR0","00000CC00CC00000",
    ],
    'armadura': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000W1WW1W000000","000W10WW01W00000","0000001WW1000000",
      "000000W11W000000","00000W1111W00000","000000W11W000000","0000011001100000",
    ],
    'mago': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRR000000","000YR0RRrR0RY000","000YR0YRRr0RY000",
      "000Yr0RRRR0rY000","00000RRRRRRR0000","0000RRRrRRR00000","00000YY00YY00000",
    ],
    'ninja': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRR000000","000RR0RRrR0RR000","000RR0RRRr0RR000",
      "000Rr0RRRR0Rr000","00000RRRRRR00000","000000RRRR000000","00000RR00RR00000",
    ],
    'samurai': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRR000000","000RR0RRrR0RR000","000RR0YRRr0RR000",
      "000Rr0RRRY0Rr000","00000RRRRRR00000","000000dRRd000000","00000RR00RR00000",
    ],
    'hacker': [
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000000000000","0000000000000000","0000000000000000","0000000000000000",
      "0000000RR0000000","00000RRRRR000000","000RR0RRrR0RR000","000RR0GRRr0RR000",
      "000Rr0RRRG0Rr000","00000RRRRRRR0000","000000RRrRR00000","00000RR00RR00000",
    ],
  };
  drawPattern(clothesStyles[avatar.clothingStyle] || clothesStyles['casual']);

  // ── Hats ──
  const hatPatterns = {
    'chapeu-mago': [
      "0000000222000000",
      "0000022222000000",
      "0000222YY2200000",
      "0022222222222200",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'chapeu-pirata': [
      "0000000000000000",
      "0000001111000000",
      "000Y1111WW1111Y0",
      "0YY11WWWWWW11YY0",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'coroa': [
      "0000000000000000",
      "0000100000100000",
      "0000Y10101Y00000",
      "000Y3Y1Y1Y4Y0000",
      "000YYYYYYYYY0000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'elmo': [
      "0000001111100000",
      "000001W111W10000",
      "00001W11111W1000",
      "0001W111111W1000",
      "000W111111111000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'chapeu-cowboy': [
      "0000000000000000",
      "0000007777000000",
      "0000077777770000",
      "0000077y77700000",
      "0777777777777770",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'tiara': [
      "0000000000000000",
      "000000Y0Y0000000",
      "000000YYY0000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'headband': [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000333333330000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'chapeu-chef': [
      "0000000000000000",
      "0000WWWWWWWW0000",
      "000WWWWWWWWWW000",
      "00WWWWWWWWWWWW00",
      "0000111111110000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'mascara-ninja': [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000111111110000",
      "0000111111110000",
      "0000000000000000",
      "0000000000000000",
    ],
  };

  // ── Weapons ──
  const weaponPatterns = {
    'espada-madeira': [
      "0000000000000000",
      "0000000000001100",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "0000000000017M10",
      "000000000011M110",
      "0000000000001100",
      "0000000000000000",
      "0000000000000000",
    ],
    'espada-ferro': [
      "0000000000000000",
      "0000000000001100",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "000000000001wW10",
      "00000000001Y11Y0",
      "000000000000y100",
      "0000000000000000",
      "0000000000000000",
    ],
    'espada-ouro': [
      "0000000000000000",
      "0000000000001100",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "000000000001yY10",
      "00000000001Y31Y0",
      "000000000000Y100",
      "0000000000000000",
      "0000000000000000",
    ],
    'cajado': [
      "0000000000000000",
      "0000000000111110",
      "0000000001YYYYY1",
      "0000000001YY4YY1",
      "0000000001YYYYY1",
      "000000000011Y110",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "0000000000000000",
    ],
    'varinha': [
      "0000000000000000",
      "0000000000001100",
      "000000000001YY10",
      "00000000001YWWY1",
      "000000000001YY10",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "000000000001M100",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'arco': [
      "0000000000001100",
      "000000000001M1w0",
      "00000000001M10w0",
      "0000000001M100w0",
      "000000001M1000w0",
      "00000001M10000w0",
      "0000001M100000w0",
      "000001M1000000w0",
      "0000001M100000w0",
      "00000001M10000w0",
      "000000001M1000w0",
      "0000000001M100w0",
      "00000000001M10w0",
      "000000000001M1w0",
      "0000000000001100",
      "0000000000000000",
    ],
    'katana': [
      "0000000000000010",
      "00000000000001W1",
      "0000000000001w10",
      "000000000001w100",
      "00000000001w1000",
      "0000000001w10000",
      "000000001w100000",
      "00000001w1000000",
      "0000001w10000000",
      "000001w100000000",
      "00001w1000000000",
      "0001w10000000000",
      "001W100000000000",
      "00Y1100000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'escudo': [
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0011111000000000",
      "01WWWWW100000000",
      "01W4Y4W100000000",
      "01WYYYW100000000",
      "01W4Y4W100000000",
      "001WWWW100000000",
      "0001W11000000000",
      "0000100000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  };

  // ── Hair styles (improved with shading) ──
  const hairStyles = {
    'liso': [
      "00000hhhhhhh0000",
      "0000hHHHHHHHh000",
      "000hHHHHHHHHHh00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000hh00000000hh0",
      "0000000000000000",
      "0000000000000000",
    ],
    'comprido': [
      "00000hhhhhhh0000",
      "0000hHHHHHHHh000",
      "000hHHHHHHHHHh00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000hh00000000hh0",
      "0000h0000000hh00",
      "0000000000000000",
      "0000000000000000",
    ],
    'espetado': [
      "0000h00h00h00000",
      "000hHhHhHhHhH000",
      "0000hHHHHHHh0000",
      "000hHHHHHHHHHh00",
      "000hH000000hH000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'cacheado': [
      "0000hHHhHHh00000",
      "000hHhHhHhHh0000",
      "00hHHHHHHHHHHh00",
      "0hHh000000hHh000",
      "00hH0000000hH000",
      "000hh00000hh0000",
      "0000000000000000",
      "0000000000000000",
    ],
    'rabo-de-cavalo': [
      "00000hhhhhhh0000",
      "0000hHHHHHHHh000",
      "000hHHHHHHHHHh00",
      "000hH00000000h00",
      "000H0000000000h0",
      "00000000000hhhh0",
      "000000000000hHH0",
      "000000000000hHH0",
      "000000000000hH00",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'trancas': [
      "00000hhhhhhh0000",
      "0000hHHHHHHHh000",
      "000hHHHHHHHHHh00",
      "000hH00000000h00",
      "000hH00000000h00",
      "000H00000000hH00",
      "00HhH0000000hHh0",
      "000Hh0000000hHh0",
      "00HhH0000000hHh0",
      "000Hh0000000hH00",
      "0000000000000000",
      "0000000000000000",
    ],
    'moicano': [
      "0000000H00000000",
      "000000HHH0000000",
      "00000HHHHH000000",
      "00000hHHHh000000",
      "000000hhh0000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'chonmage': [
      "0000000hh0000000",
      "000000hHh0000000",
      "00000hHHHHh00000",
      "0000hHHHHHHh0000",
      "0000hH0000hH0000",
      "0000000hhh000000",
      "0000000000000000",
      "0000000000000000",
    ],
    'afro': [
      "000hHHHHHHHh0000",
      "00hHHHHHHHHHh000",
      "0hHHHHHHHHHHHh00",
      "0hHHHHHHHHHHHh00",
      "00hHH00000HHh000",
      "000hh000000hh000",
      "0000000000000000",
      "0000000000000000",
    ],
    'curto': [
      "00000hhhhhhh0000",
      "0000hHHHHHHHh000",
      "000hHHHHHHHHHh00",
      "000hh000000hhh00",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
      "0000000000000000",
    ],
  };

  const hair = hairStyles[avatar.hairstyle] || hairStyles['liso'];
  // avoid overwriting eyes
  const hairClean = hair.map((r, y) =>
    y === 4 ? r.substring(0,3)+'00'+r.substring(5,6)+'0'+r.substring(7,9)+'00'+r.substring(11) : r
  );
  drawPattern(hairClean);

  // Draw hat over hair
  if (avatar.hatStyle && hatPatterns[avatar.hatStyle]) {
    drawPattern(hatPatterns[avatar.hatStyle]);
  }

  // Draw weapon
  if (avatar.weaponStyle && weaponPatterns[avatar.weaponStyle]) {
    drawPattern(weaponPatterns[avatar.weaponStyle]);
  }

  return grid.map(row => row.join(''));
};

export const renderAvatarPixels = (ctx, avatar, startX, startY, pixelSize) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = buildColorMap(avatar);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char !== '0' && colorMap[char]) {
        ctx.fillStyle = colorMap[char];
        ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
      }
    }
  }
};

const buildColorMap = (avatar) => ({
  'H': avatar.hairColor,
  'h': darkenColor(avatar.hairColor, 0.25),
  'L': avatar.hairColor, // Map highlights to base color to eliminate weird white spots
  'S': avatar.skinTone,
  's': darkenColor(avatar.skinTone, 0.12),
  'E': avatar.eyeColor || '#111111',
  'W': '#ffffff',
  'w': '#e0e0e0',
  'M': '#5C3317',
  'R': avatar.clothingColor,
  'r': darkenColor(avatar.clothingColor, 0.25),
  'D': avatar.pantsColor,
  'd': darkenColor(avatar.pantsColor, 0.25),
  'C': avatar.shoesColor || '#1e293b',
  'c': darkenColor(avatar.shoesColor || '#1e293b', 0.2),
  '1': '#111111',
  '7': '#8b4513',
  'y': darkenColor('#FFD700', 0.25),
  'Y': '#FFD700',
  '2': '#9B59B6',
  '3': '#E74C3C',
  '4': '#3498DB',
  'G': '#48c78e',
});

// ── AvatarGraphic SVG renderer ───────────────────────────────────────────────
const AvatarGraphic = ({ avatar, viewBox = "0 0 16 16" }) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = buildColorMap(avatar);
  return (
    <svg width="100%" height="100%" viewBox={viewBox} style={{ display: 'block', shapeRendering: 'crispEdges' }}>
      {grid.map((row, y) =>
        row.split('').map((char, x) => {
          if (char === '0' || !colorMap[char]) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={colorMap[char]} />;
        })
      )}
    </svg>
  );
};

// ── StudentAvatar container ──────────────────────────────────────────────────
export const StudentAvatar = ({ size = 80, editable = false, onChange, totalCoins, onSpendCoins, userId, onPurchaseUtility }) => {
  const [open, setOpen] = useState(false);

  const defaultAvatar = {
    gender: 'male', hairstyle: 'liso', hairColor: '#6B4423',
    skinTone: '#E6B89A', eyeColor: '#000000', eyeStyle: 'normal',
    mouthStyle: 'normal', eyebrowStyle: 'normal',
    clothingStyle: 'casual', clothingColor: '#3498DB',
    pantsColor: '#2C3E50', shoesColor: '#1e293b',
    hatStyle: 'nenhum', weaponStyle: 'nenhuma',
  };

  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    if (!userId) return;
    const saved = localStorage.getItem(`student_custom_avatar_${userId}`);
    if (saved) {
      try { setAvatar({ ...defaultAvatar, ...JSON.parse(saved) }); } catch (e) {}
    } else {
      setAvatar(defaultAvatar);
    }
  }, [userId]);

  const handleSave = (newAvatar) => {
    setAvatar(newAvatar);
    if (userId) localStorage.setItem(`student_custom_avatar_${userId}`, JSON.stringify(newAvatar));
    setOpen(false);
    if (onChange) onChange(newAvatar);
  };

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <Box
        sx={{
          width: size, height: size,
          borderRadius: '16px', overflow: 'hidden',
          bgcolor: 'rgba(13, 27, 42, 0.7)',
          border: '3px solid rgba(0, 180, 216, 0.5)',
          boxShadow: '0 0 24px rgba(0, 180, 216, 0.25), inset 0 0 12px rgba(0,0,0,0.3)',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          cursor: editable ? 'pointer' : 'default',
          imageRendering: 'pixelated',
          animation: 'idleBob 2.5s infinite ease-in-out',
          '@keyframes idleBob': {
            '0%, 100%': { transform: 'translateY(0) scale(1)' },
            '50%': { transform: 'translateY(-5px) scale(1.02)' },
          },
          '&:hover': editable ? { borderColor: 'rgba(0,180,216,0.9)', boxShadow: '0 0 32px rgba(0,180,216,0.45)' } : {},
          transition: 'all 0.3s ease',
        }}
        onClick={() => editable && setOpen(true)}
      >
        <AvatarGraphic avatar={avatar} />
      </Box>

      {editable && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); setOpen(true); }}
          sx={{
            position: 'absolute', bottom: -6, right: -6,
            bgcolor: '#7c4dff', color: '#fff',
            width: 24, height: 24,
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 2px 8px rgba(124,77,255,0.5)',
            '&:hover': { bgcolor: '#b388ff', transform: 'scale(1.15)' },
            transition: 'all 0.2s',
          }}
        >
          <EditIcon fontSize="small" sx={{ width: 14, height: 14 }} />
        </IconButton>
      )}

      <AvatarEditorDialog
        open={open} onClose={() => setOpen(false)}
        currentAvatar={avatar} onSave={handleSave}
        totalCoins={totalCoins} onSpendCoins={onSpendCoins} userId={userId}
        onPurchaseUtility={onPurchaseUtility}
      />
    </Box>
  );
};

// ── Shop items ───────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 'chapeu-mago',   name: 'Chapéu de Mago',    type: 'hatStyle',      price: 25, emoji: '🧙', rarity: 'raro',     desc: 'Para verdadeiros feiticeiros!' },
  { id: 'chapeu-pirata', name: 'Chapéu de Pirata',  type: 'hatStyle',      price: 30, emoji: '🏴‍☠️', rarity: 'raro',     desc: 'Arrr! Navegue pelos mares!' },
  { id: 'coroa',         name: 'Coroa Real',         type: 'hatStyle',      price: 60, emoji: '👑', rarity: 'lendário', desc: 'Digna de um verdadeiro rei!' },
  { id: 'elmo',          name: 'Elmo de Batalha',    type: 'hatStyle',      price: 45, emoji: '⚔️', rarity: 'épico',    desc: 'Proteção máxima na batalha!' },
  { id: 'chapeu-cowboy', name: 'Chapéu Cowboy',      type: 'hatStyle',      price: 20, emoji: '🤠', rarity: 'comum',    desc: 'Para aventuras no oeste!' },
  { id: 'tiara',         name: 'Tiara de Cristal',   type: 'hatStyle',      price: 35, emoji: '💎', rarity: 'épico',    desc: 'Elegância e brilho!' },
  { id: 'headband',      name: 'Faixa Ninja',        type: 'hatStyle',      price: 15, emoji: '🥷', rarity: 'comum',    desc: 'Velocidade e foco!' },
  { id: 'chapeu-chef',   name: 'Chapéu de Chef',     type: 'hatStyle',      price: 20, emoji: '👨‍🍳', rarity: 'comum',    desc: 'Mestre da cozinha!' },
  { id: 'mascara-ninja', name: 'Máscara Ninja',      type: 'hatStyle',      price: 40, emoji: '🥷', rarity: 'raro',     desc: 'Invisível nas sombras!' },
  { id: 'vestido-real',  name: 'Vestido Real',       type: 'clothingStyle', price: 50, emoji: '👗', rarity: 'épico',    desc: 'Uma roupa digna da realeza!' },
  { id: 'armadura',      name: 'Armadura de Aço',    type: 'clothingStyle', price: 55, emoji: '🛡️', rarity: 'épico',    desc: 'Proteção de guerreiro!' },
  { id: 'mago',          name: 'Vestes de Mago',     type: 'clothingStyle', price: 40, emoji: '🧙', rarity: 'raro',     desc: 'Canal de magia antiga!' },
  { id: 'ninja',         name: 'Traje Ninja',        type: 'clothingStyle', price: 40, emoji: '🥷', rarity: 'raro',     desc: 'Silencioso como as sombras!' },
  { id: 'samurai',       name: 'Armadura Samurai',   type: 'clothingStyle', price: 60, emoji: '⛩️', rarity: 'lendário', desc: 'Honra e disciplina!' },
  { id: 'hacker',        name: 'Moletom Hacker',     type: 'clothingStyle', price: 35, emoji: '💻', rarity: 'raro',     desc: 'Código é o poder!' },
  { id: 'espada-madeira',name: 'Espada de Madeira',  type: 'weaponStyle',   price: 15, emoji: '🪵', rarity: 'comum',    desc: 'Começo de toda aventura!' },
  { id: 'espada-ferro',  name: 'Espada de Ferro',    type: 'weaponStyle',   price: 30, emoji: '⚔️', rarity: 'raro',     desc: 'Forjada por ferreiros habilidosos!' },
  { id: 'espada-ouro',   name: 'Espada de Ouro',     type: 'weaponStyle',   price: 70, emoji: '✨', rarity: 'lendário', desc: 'A lâmina mais brilhante de todas!' },
  { id: 'cajado',        name: 'Cajado Mágico',      type: 'weaponStyle',   price: 35, emoji: '🪄', rarity: 'raro',     desc: 'Carregado de magia elemental!' },
  { id: 'varinha',       name: 'Varinha Encantada',  type: 'weaponStyle',   price: 25, emoji: '🌟', rarity: 'raro',     desc: 'Pequena mas poderosa!' },
  { id: 'arco',          name: 'Arco Élfico',        type: 'weaponStyle',   price: 45, emoji: '🏹', rarity: 'épico',    desc: 'Precisão de élfico!' },
  { id: 'katana',        name: 'Katana Lendária',    type: 'weaponStyle',   price: 65, emoji: '🗡️', rarity: 'lendário', desc: 'Afiada além da compreensão!' },
  { id: 'escudo',        name: 'Escudo do Herói',    type: 'weaponStyle',   price: 40, emoji: '🛡️', rarity: 'épico',    desc: 'Para quem protege os outros!' },
  { id: 'streak-booster', name: 'Elixir de Ofensiva', type: 'utility',       price: 10, emoji: '🔥', rarity: 'raro',     desc: 'Adiciona +1 dia à sua ofensiva atual!' },
  { id: 'streak-freeze',  name: 'Protetor de Ofensiva',type: 'utility',       price: 15, emoji: '❄️', rarity: 'épico',    desc: 'Evita a perda da ofensiva por 1 dia!' },
  { id: 'restore-lives',  name: 'Poção de Vidas',      type: 'utility',       price: 15, emoji: '🧪', rarity: 'lendário', desc: 'Recupera as 4 vidas e destrava o módulo!' },
];

const RARITY_COLORS = {
  'comum':    { bg: 'rgba(127,140,141,0.15)', border: 'rgba(127,140,141,0.4)', label: '#95a5a6', glow: 'rgba(127,140,141,0.2)' },
  'raro':     { bg: 'rgba(52,152,219,0.12)',  border: 'rgba(52,152,219,0.45)', label: '#3498DB',  glow: 'rgba(52,152,219,0.25)' },
  'épico':    { bg: 'rgba(155,89,182,0.15)',  border: 'rgba(155,89,182,0.5)',  label: '#9B59B6',  glow: 'rgba(155,89,182,0.3)' },
  'lendário': { bg: 'rgba(241,196,15,0.12)',  border: 'rgba(241,196,15,0.6)', label: '#F1C40F',  glow: 'rgba(241,196,15,0.35)' },
};

const AvatarEditorDialog = ({ open, onClose, currentAvatar, onSave, totalCoins = 0, onSpendCoins, userId, onPurchaseUtility }) => {
  const [tempAvatar, setTempAvatar] = useState(currentAvatar);
  const [activeTab, setActiveTab] = useState('personalizar'); // 'personalizar' | 'loja'
  const [subTab, setSubTab] = useState('aparência'); // 'aparência' | 'rosto' | 'roupas' | 'cores'
  const [shopFilter, setShopFilter] = useState('todos');

  const [unlockedItems, setUnlockedItems] = useState(() => {
    if (!userId) return [];
    try {
      const saved = localStorage.getItem(`student_unlocked_items_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (open) {
      setTempAvatar(currentAvatar);
    }
  }, [open, currentAvatar]);

  const handleBuy = (item) => {
    if (totalCoins < item.price) return;

    if (item.type === 'utility') {
      if (onSpendCoins) {
        onSpendCoins(item.price);
      }
      if (onPurchaseUtility) {
        onPurchaseUtility(item.id, item.price);
      }
      return;
    }

    const isUnlocked = unlockedItems.includes(item.id);
    if (isUnlocked) {
      setTempAvatar(prev => ({
        ...prev,
        [item.type]: item.id
      }));
      return;
    }

    if (onSpendCoins) {
      onSpendCoins(item.price);
    }
    const newUnlocked = [...unlockedItems, item.id];
    setUnlockedItems(newUnlocked);
    if (userId) {
      localStorage.setItem(`student_unlocked_items_${userId}`, JSON.stringify(newUnlocked));
    }
    setTempAvatar(prev => ({
      ...prev,
      [item.type]: item.id
    }));
  };

  const handleEquipUnlocked = (item) => {
    setTempAvatar(prev => ({
      ...prev,
      [item.type]: item.id
    }));
  };

  const filteredShopItems = SHOP_ITEMS.filter(item => {
    if (shopFilter === 'todos') return true;
    return item.type === shopFilter;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          color: '#fff',
          borderRadius: '20px',
          border: '2px solid rgba(0, 180, 216, 0.3)',
          boxShadow: '0 0 40px rgba(0, 180, 216, 0.2)',
          backgroundImage: 'none',
        }
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
          🧙‍♂️ Criador de Personagem
        </Typography>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {/* Main Tab Switcher */}
        <Box sx={{ display: 'flex', bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: '30px', p: 0.5, mr: 5 }}>
          <Button
            onClick={() => setActiveTab('personalizar')}
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              px: 3,
              py: 0.75,
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'personalizar' ? '#fff' : 'rgba(255,255,255,0.6)',
              background: activeTab === 'personalizar' ? 'linear-gradient(90deg, #00b4d8, #7c4dff)' : 'transparent',
              boxShadow: activeTab === 'personalizar' ? '0 4px 12px rgba(0, 180, 216, 0.3)' : 'none',
              '&:hover': {
                background: activeTab === 'personalizar' ? 'linear-gradient(90deg, #00b4d8, #7c4dff)' : 'rgba(255,255,255,0.05)',
              }
            }}
          >
            🎨 Personalizar
          </Button>
          <Button
            onClick={() => setActiveTab('loja')}
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              px: 3,
              py: 0.75,
              fontSize: '13px',
              fontWeight: 700,
              color: activeTab === 'loja' ? '#fff' : 'rgba(255,255,255,0.6)',
              background: activeTab === 'loja' ? 'linear-gradient(90deg, #00b4d8, #7c4dff)' : 'transparent',
              boxShadow: activeTab === 'loja' ? '0 4px 12px rgba(0, 180, 216, 0.3)' : 'none',
              '&:hover': {
                background: activeTab === 'loja' ? 'linear-gradient(90deg, #00b4d8, #7c4dff)' : 'rgba(255,255,255,0.05)',
              }
            }}
          >
            🪙 Loja
          </Button>
        </Box>
      </Box>

      {/* Main content container */}
      <Box sx={{ display: 'flex', p: 3, gap: 2, height: '480px' }}>
        {activeTab === 'personalizar' ? (
          <>
            {/* Left Column: Preview + Presets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '148px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)', pr: 2 }}>
              <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', mb: 1.5, letterSpacing: '0.8px' }}>
                Visualização
              </Typography>
              
              <Box
                sx={{
                  width: 128,
                  height: 128,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  bgcolor: 'rgba(13, 27, 42, 0.7)',
                  border: '3px solid rgba(0, 180, 216, 0.5)',
                  boxShadow: '0 0 20px rgba(0, 180, 216, 0.2), inset 0 0 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  mb: 2.5,
                  alignSelf: 'center',
                }}
              >
                <Box sx={{ width: '100%', height: '100%', imageRendering: 'pixelated', animation: 'idleBob 2.5s ease-in-out infinite' }}>
                  <AvatarGraphic avatar={tempAvatar} />
                </Box>
              </Box>

              <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', mb: 1, letterSpacing: '0.8px' }}>
                Presets Rápidos
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', flexGrow: 1, pr: 0.5 }}>
                {Object.keys(presets).map(name => (
                  <Box
                    key={name}
                    onClick={() => setTempAvatar(presets[name])}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      bgcolor: 'rgba(255, 255, 255, 0.03)',
                      border: '1.5px solid rgba(0, 212, 255, 0.1)',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0, 212, 255, 0.08)',
                        borderColor: 'rgba(0, 212, 255, 0.4)',
                        transform: 'translateX(2px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                      {name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '3px' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: presets[name].skinTone }} />
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: presets[name].hairColor }} />
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: presets[name].clothingColor }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right Column: Tab navigation + Option fields */}
            <Box sx={{ flexGrow: 1, pl: 2, display: 'flex', flexDirection: 'column', overflowY: 'auto', pr: 0.5 }}>
              {/* Sub-tabs pills */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {[
                  { id: 'aparência', label: 'Aparência', icon: '👤' },
                  { id: 'rosto', label: 'Rosto', icon: '😊' },
                  { id: 'roupas', label: 'Roupas', icon: '👕' },
                  { id: 'cores', label: 'Cores', icon: '🎨' }
                ].map(tab => (
                  <Button
                    key={tab.id}
                    onClick={() => setSubTab(tab.id)}
                    variant={subTab === tab.id ? 'contained' : 'outlined'}
                    size="small"
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      px: 2,
                      py: 0.5,
                      bgcolor: subTab === tab.id ? '#00b4d8' : 'transparent',
                      color: '#fff',
                      borderColor: subTab === tab.id ? 'transparent' : 'rgba(0, 212, 255, 0.25)',
                      boxShadow: subTab === tab.id ? '0 2px 8px rgba(0, 180, 216, 0.4)' : 'none',
                      '&:hover': {
                        bgcolor: subTab === tab.id ? '#00c8f0' : 'rgba(0, 212, 255, 0.08)',
                        borderColor: '#00d4ff',
                      }
                    }}
                  >
                    <span style={{ marginRight: '4px' }}>{tab.icon}</span> {tab.label}
                  </Button>
                ))}
              </Box>

              {/* Tab content */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {subTab === 'aparência' && (
                  <>
                    <Grid container spacing={2}>
                      {/* Gênero */}
                      <Grid item xs={12} sm={6}>
                        <Box className="control-group">
                          <label>Gênero</label>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Button
                              onClick={() => setTempAvatar(prev => ({ ...prev, gender: 'male' }))}
                              variant={tempAvatar.gender === 'male' ? 'contained' : 'outlined'}
                              fullWidth
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '11px',
                                borderRadius: '10px',
                                bgcolor: tempAvatar.gender === 'male' ? '#00b4d8' : 'rgba(0,0,0,0.3)',
                                color: '#fff',
                                borderColor: tempAvatar.gender === 'male' ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                                '&:hover': {
                                  bgcolor: tempAvatar.gender === 'male' ? '#00c8f0' : 'rgba(255,255,255,0.05)',
                                }
                              }}
                            >
                              ♂️ Masculino
                            </Button>
                            <Button
                              onClick={() => setTempAvatar(prev => ({ ...prev, gender: 'female' }))}
                              variant={tempAvatar.gender === 'female' ? 'contained' : 'outlined'}
                              fullWidth
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '11px',
                                borderRadius: '10px',
                                bgcolor: tempAvatar.gender === 'female' ? '#00b4d8' : 'rgba(0,0,0,0.3)',
                                color: '#fff',
                                borderColor: tempAvatar.gender === 'female' ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                                '&:hover': {
                                  bgcolor: tempAvatar.gender === 'female' ? '#00c8f0' : 'rgba(255,255,255,0.05)',
                                }
                              }}
                            >
                              ♀️ Feminino
                            </Button>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Penteado */}
                      <Grid item xs={12} sm={6}>
                        <Box className="control-group">
                          <label>Penteado</label>
                          <select
                            value={tempAvatar.hairstyle}
                            onChange={(e) => setTempAvatar(prev => ({ ...prev, hairstyle: e.target.value }))}
                            style={{ marginTop: '4px' }}
                          >
                            {HAIRSTYLES.map(style => (
                              <option key={style} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </option>
                            ))}
                          </select>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Skin tones */}
                    <Box className="swatches-container" sx={{ mt: 1 }}>
                      <Box className="swatch-group">
                        <label>Cor da Pele</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {SKIN_TONES.map(t => (
                            <Box
                              key={t.color}
                              className={`swatch ${tempAvatar.skinTone === t.color ? 'active' : ''}`}
                              style={{ backgroundColor: t.color }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, skinTone: t.color }))}
                              title={t.name}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Hair colors */}
                    <Box className="swatches-container">
                      <Box className="swatch-group">
                        <label>Cor do Cabelo</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {HAIR_COLORS.map(c => (
                            <Box
                              key={c}
                              className={`swatch ${tempAvatar.hairColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, hairColor: c }))}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                {subTab === 'rosto' && (
                  <>
                    <Grid container spacing={2}>
                      {/* Olhos Style */}
                      <Grid item xs={12} sm={4}>
                        <Box className="control-group">
                          <label>Olhos</label>
                          <select
                            value={tempAvatar.eyeStyle || 'normal'}
                            onChange={(e) => setTempAvatar(prev => ({ ...prev, eyeStyle: e.target.value }))}
                          >
                            {['normal', 'feliz', 'piscando', 'sonolento', 'bravo'].map(style => (
                              <option key={style} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </option>
                            ))}
                          </select>
                        </Box>
                      </Grid>

                      {/* Boca Style */}
                      <Grid item xs={12} sm={4}>
                        <Box className="control-group">
                          <label>Boca</label>
                          <select
                            value={tempAvatar.mouthStyle || 'normal'}
                            onChange={(e) => setTempAvatar(prev => ({ ...prev, mouthStyle: e.target.value }))}
                          >
                            {['normal', 'sorriso', 'surpreso', 'triste', 'grito'].map(style => (
                              <option key={style} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </option>
                            ))}
                          </select>
                        </Box>
                      </Grid>

                      {/* Sobrancelhas Style */}
                      <Grid item xs={12} sm={4}>
                        <Box className="control-group">
                          <label>Sobrancelhas</label>
                          <select
                            value={tempAvatar.eyebrowStyle || 'normal'}
                            onChange={(e) => setTempAvatar(prev => ({ ...prev, eyebrowStyle: e.target.value }))}
                          >
                            {['nenhuma', 'normal', 'brava', 'triste', 'arqueada'].map(style => (
                              <option key={style} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </option>
                            ))}
                          </select>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Eye colors */}
                    <Box className="swatches-container" sx={{ mt: 1 }}>
                      <Box className="swatch-group">
                        <label>Cor dos Olhos</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {EYE_COLORS.map(c => (
                            <Box
                              key={c}
                              className={`swatch ${tempAvatar.eyeColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, eyeColor: c }))}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                {subTab === 'roupas' && (
                  <>
                    {/* Roupa */}
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', mb: 1, letterSpacing: '0.8px' }}>
                        Estilo da Roupa
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {[...CLOTHING_STYLES_FREE, ...SHOP_ITEMS.filter(item => item.type === 'clothingStyle' && unlockedItems.includes(item.id)).map(item => item.id)].map(style => {
                          const shopItem = SHOP_ITEMS.find(item => item.id === style);
                          const label = shopItem ? `${shopItem.emoji} ${shopItem.name}` : style.toUpperCase();
                          return (
                            <Chip
                              key={style}
                              label={label}
                              onClick={() => setTempAvatar(prev => ({ ...prev, clothingStyle: style }))}
                              variant={tempAvatar.clothingStyle === style ? 'filled' : 'outlined'}
                              sx={{
                                bgcolor: tempAvatar.clothingStyle === style ? '#00b4d8' : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                borderColor: tempAvatar.clothingStyle === style ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                                fontWeight: 700,
                                fontSize: '11px',
                                '&:hover': {
                                  bgcolor: tempAvatar.clothingStyle === style ? '#00c8f0' : 'rgba(255,255,255,0.1)',
                                }
                              }}
                            />
                          );
                        })}
                        <Button
                          size="small"
                          onClick={() => { setActiveTab('loja'); setShopFilter('clothingStyle'); }}
                          sx={{ color: '#FFD700', textTransform: 'none', fontSize: '12px', fontWeight: 700 }}
                        >
                          🪙 + na Loja
                        </Button>
                      </Box>
                    </Box>

                    {/* Chapéu */}
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', mb: 1, letterSpacing: '0.8px' }}>
                        Chapéu
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {['nenhum', ...SHOP_ITEMS.filter(item => item.type === 'hatStyle' && unlockedItems.includes(item.id)).map(item => item.id)].map(hat => {
                          const shopItem = SHOP_ITEMS.find(item => item.id === hat);
                          const label = shopItem ? `${shopItem.emoji} ${shopItem.name}` : 'Nenhum';
                          return (
                            <Chip
                              key={hat}
                              label={label}
                              onClick={() => setTempAvatar(prev => ({ ...prev, hatStyle: hat }))}
                              variant={tempAvatar.hatStyle === hat ? 'filled' : 'outlined'}
                              sx={{
                                bgcolor: tempAvatar.hatStyle === hat ? '#00b4d8' : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                borderColor: tempAvatar.hatStyle === hat ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                                fontWeight: 700,
                                fontSize: '11px',
                                '&:hover': {
                                  bgcolor: tempAvatar.hatStyle === hat ? '#00c8f0' : 'rgba(255,255,255,0.1)',
                                }
                              }}
                            />
                          );
                        })}
                        <Button
                          size="small"
                          onClick={() => { setActiveTab('loja'); setShopFilter('hatStyle'); }}
                          sx={{ color: '#FFD700', textTransform: 'none', fontSize: '12px', fontWeight: 700 }}
                        >
                          🪙 + na Loja
                        </Button>
                      </Box>
                    </Box>

                    {/* Arma */}
                    <Box sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', mb: 1, letterSpacing: '0.8px' }}>
                        Arma / Acessório
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        {['nenhuma', ...SHOP_ITEMS.filter(item => item.type === 'weaponStyle' && unlockedItems.includes(item.id)).map(item => item.id)].map(weap => {
                          const shopItem = SHOP_ITEMS.find(item => item.id === weap);
                          const label = shopItem ? `${shopItem.emoji} ${shopItem.name}` : 'Nenhuma';
                          return (
                            <Chip
                              key={weap}
                              label={label}
                              onClick={() => setTempAvatar(prev => ({ ...prev, weaponStyle: weap }))}
                              variant={tempAvatar.weaponStyle === weap ? 'filled' : 'outlined'}
                              sx={{
                                bgcolor: tempAvatar.weaponStyle === weap ? '#00b4d8' : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                borderColor: tempAvatar.weaponStyle === weap ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                                fontWeight: 700,
                                fontSize: '11px',
                                '&:hover': {
                                  bgcolor: tempAvatar.weaponStyle === weap ? '#00c8f0' : 'rgba(255,255,255,0.1)',
                                }
                              }}
                            />
                          );
                        })}
                        <Button
                          size="small"
                          onClick={() => { setActiveTab('loja'); setShopFilter('weaponStyle'); }}
                          sx={{ color: '#FFD700', textTransform: 'none', fontSize: '12px', fontWeight: 700 }}
                        >
                          🪙 + na Loja
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}

                {subTab === 'cores' && (
                  <>
                    {/* Clothing colors */}
                    <Box className="swatches-container">
                      <Box className="swatch-group">
                        <label>Cor da Roupa</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {CLOTHING_COLORS.map(c => (
                            <Box
                              key={c}
                              className={`swatch ${tempAvatar.clothingColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, clothingColor: c }))}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Pants colors */}
                    <Box className="swatches-container">
                      <Box className="swatch-group">
                        <label>Cor das Calças</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {PANTS_COLORS.map(c => (
                            <Box
                              key={c}
                              className={`swatch ${tempAvatar.pantsColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, pantsColor: c }))}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>

                    {/* Shoes colors */}
                    <Box className="swatches-container">
                      <Box className="swatch-group">
                        <label>Cor do Sapato</label>
                        <Box className="swatch-grid" sx={{ mt: 0.5 }}>
                          {SHOE_COLORS.map(c => (
                            <Box
                              key={c}
                              className={`swatch ${tempAvatar.shoesColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c }}
                              onClick={() => setTempAvatar(prev => ({ ...prev, shoesColor: c }))}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </>
        ) : (
          /* Shop Tab Content */
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Shop Subheader */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
              {/* Filters */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'hatStyle', label: 'Chapéus' },
                  { id: 'clothingStyle', label: 'Roupas' },
                  { id: 'weaponStyle', label: 'Armas' },
                  { id: 'utility', label: 'Especiais ⚡' }
                ].map(filter => (
                  <Button
                    key={filter.id}
                    onClick={() => setShopFilter(filter.id)}
                    variant={shopFilter === filter.id ? 'contained' : 'outlined'}
                    size="small"
                    sx={{
                      borderRadius: '16px',
                      textTransform: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      px: 2,
                      py: 0.5,
                      bgcolor: shopFilter === filter.id ? '#00b4d8' : 'transparent',
                      color: '#fff',
                      borderColor: shopFilter === filter.id ? 'transparent' : 'rgba(0, 212, 255, 0.2)',
                      '&:hover': {
                        bgcolor: shopFilter === filter.id ? '#00c8f0' : 'rgba(0, 212, 255, 0.08)',
                        borderColor: '#00d4ff',
                      }
                    }}
                  >
                    {filter.label}
                  </Button>
                ))}
              </Box>

              {/* Balance */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255, 215, 0, 0.1)',
                  border: '1.5px solid rgba(255, 215, 0, 0.4)',
                  borderRadius: '16px',
                  px: 2,
                  py: 0.5,
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.15)',
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#FFD700' }}>
                  Seu Saldo: 🪙 {totalCoins}
                </Typography>
              </Box>
            </Box>

            {/* Shop Grid */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
              <Grid container spacing={2}>
                {filteredShopItems.map(item => {
                  const isUnlocked = unlockedItems.includes(item.id);
                  const isEquipped = tempAvatar[item.type] === item.id;
                  const rarity = item.rarity || 'comum';
                  const rarityConfig = RARITY_COLORS[rarity] || RARITY_COLORS['comum'];

                  return (
                    <Grid item xs={6} sm={4} md={3} key={item.id}>
                      <Box
                        className="shop-card"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          bgcolor: 'rgba(255, 255, 255, 0.02)',
                          border: `1.5px solid ${rarityConfig.border}`,
                          borderRadius: '14px',
                          p: 1.5,
                          position: 'relative',
                          boxShadow: `inset 0 0 12px rgba(0,0,0,0.2), 0 2px 8px ${rarityConfig.glow}`,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            borderColor: rarityConfig.label,
                            boxShadow: `0 4px 16px ${rarityConfig.glow}`,
                          }
                        }}
                      >
                        {/* Rarity Chip top-right */}
                        <Chip
                          label={rarity.toUpperCase()}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: '8px',
                            height: '16px',
                            fontWeight: 800,
                            bgcolor: rarityConfig.bg,
                            color: rarityConfig.label,
                            border: `1px solid ${rarityConfig.border}`,
                          }}
                        />

                        {/* Emoji centered */}
                        <Typography sx={{ fontSize: '36px', textAlign: 'center', my: 1.5, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                          {item.emoji}
                        </Typography>

                        {/* Item Name */}
                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#fff', textAlign: 'center', mb: 0.5 }}>
                          {item.name}
                        </Typography>

                        {/* Description */}
                        <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', flexGrow: 1, mb: 1.5 }}>
                          {item.desc}
                        </Typography>

                        {/* Button */}
                        {isUnlocked ? (
                          <Button
                            fullWidth
                            size="small"
                            variant={isEquipped ? 'contained' : 'outlined'}
                            onClick={() => handleEquipUnlocked(item)}
                            disabled={isEquipped}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              bgcolor: isEquipped ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
                              color: isEquipped ? '#00b4d8' : '#fff',
                              borderColor: isEquipped ? 'transparent' : 'rgba(0, 180, 216, 0.4)',
                              '&:hover': {
                                bgcolor: isEquipped ? 'rgba(0, 180, 216, 0.2)' : 'rgba(0, 180, 216, 0.1)',
                                borderColor: '#00b4d8',
                              }
                            }}
                          >
                            {isEquipped ? 'Equipado' : 'Equipar'}
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={() => handleBuy(item)}
                            disabled={totalCoins < item.price}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              bgcolor: totalCoins >= item.price ? '#FFD700' : 'rgba(255,255,255,0.05)',
                              color: totalCoins >= item.price ? '#000' : 'rgba(255,255,255,0.3)',
                              boxShadow: totalCoins >= item.price ? '0 2px 8px rgba(255, 215, 0, 0.3)' : 'none',
                              '&:hover': {
                                bgcolor: totalCoins >= item.price ? '#FFC700' : 'rgba(255,255,255,0.05)',
                              }
                            }}
                          >
                            {totalCoins >= item.price ? `Comprar 🪙 ${item.price}` : `Saldo Insuficiente (🪙 ${item.price})`}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer row */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button
          onClick={onClose}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            fontFamily: 'Outfit, sans-serif',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
              color: '#fff',
              bgcolor: 'transparent',
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => onSave(tempAvatar)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#fff',
            background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
            boxShadow: '0 4px 20px rgba(0,180,216,0.4)',
            fontFamily: 'Outfit, sans-serif',
            '&:hover': {
              background: 'linear-gradient(90deg, #00c8f0, #9c27b0)',
              boxShadow: '0 6px 28px rgba(0,180,216,0.55)',
            }
          }}
        >
          Salvar
        </Button>
      </Box>
    </Dialog>
  );
};
