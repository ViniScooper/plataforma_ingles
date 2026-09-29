import React, { useState, useEffect } from 'react';
import { Box, Dialog, IconButton, Grid, Button, Typography, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import './StudentAvatar.css';
import apiClient from '../../utils/apiClient';

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

// ─── High-Definition 24×24 Pixel Art System ──────────────────────────────────

export const buildColorMap = (avatar) => ({
  // Hair
  'H': avatar.hairColor,
  'h': darkenColor(avatar.hairColor, 0.28),
  'd': darkenColor(avatar.hairColor, 0.48),
  'L': lightenColor(avatar.hairColor, 0.35),
  'l': lightenColor(avatar.hairColor, 0.55),
  // Skin
  'S': avatar.skinTone,
  's': darkenColor(avatar.skinTone, 0.14),
  'k': darkenColor(avatar.skinTone, 0.28),
  'P': lightenColor(avatar.skinTone, 0.20),
  'B': '#f87171', // soft cheek blush
  // Eyes
  'E': avatar.eyeColor || '#111111',
  'e': darkenColor(avatar.eyeColor || '#111111', 0.45),
  'W': '#ffffff',
  'w': '#cbd5e1',
  // Mouth
  'M': '#8b4513',
  'm': '#5c2a10',
  // Clothes
  'R': avatar.clothingColor,
  'r': darkenColor(avatar.clothingColor, 0.25),
  'K': darkenColor(avatar.clothingColor, 0.45),
  'T': lightenColor(avatar.clothingColor, 0.32),
  // Pants
  'D': avatar.pantsColor,
  'p': darkenColor(avatar.pantsColor, 0.25),
  'Q': darkenColor(avatar.pantsColor, 0.45),
  'U': lightenColor(avatar.pantsColor, 0.25),
  // Shoes
  'C': avatar.shoesColor || '#1e293b',
  'c': darkenColor(avatar.shoesColor || '#1e293b', 0.3),
  'X': lightenColor(avatar.shoesColor || '#1e293b', 0.35),
  // Accents / Metals
  '1': '#0f172a',
  '7': '#8b4513',
  '8': '#5c2e0b',
  'y': darkenColor('#FFD700', 0.28),
  'Y': '#FFD700',
  'Z': '#FFF59D',
  '2': '#9B59B6',
  '3': '#E74C3C',
  '4': '#3498DB',
  '5': '#2ECC71',
  'G': '#48c78e',
  'g': '#10b981',
});

export const getAvatarGrid = (avatar) => {
  let grid = Array.from({length: 24}, () => Array(24).fill('0'));

  const set = (x, y, char) => { if (y >= 0 && y < 24 && x >= 0 && x < 24) grid[y][x] = char; };

  const drawPattern = (pattern, defaultChar) => {
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        const ch = pattern[y][x];
        if (ch !== '0' && ch !== '.') grid[y][x] = defaultChar || ch;
      }
    }
  };

  // Base 24x24 body with silhouette, shading, hands and anatomy
  const body = [
    "000000000000000000000000", // 0
    "000000001111110000000000", // 1 top of head
    "00000011SSSSSS1100000000", // 2 forehead top
    "000001SSSSSSSSSS10000000", // 3 forehead
    "00001SSSSSSSSSSSS1000000", // 4 temples
    "00001sSSSSSSSSSSs1000000", // 5 brows
    "00001sSSSSSSSSSSs1000000", // 6 eyes top
    "0001sSSSSSSSSSSSSs100000", // 7 eyes / ears
    "0001sSSSSSSSSSSSSs100000", // 8 cheeks / nose
    "00001sSSSSSSSSSSs1000000", // 9 mouth
    "000011sSSSSSSSSs11000000", // 10 jaw
    "00000011ssssss1100000000", // 11 chin
    "000000001kssk10000000000", // 12 neck shadow
    "000000001SSSS10000000000", // 13 neck
    "000000111SSSS11100000000", // 14 collarbone
    "000001SSSSSSSSSS10000000", // 15 chest
    "00001SSSSSSSSSSSS1000000", // 16 torso
    "0001SSSSSSSSSSSSSS100000", // 17 waist / arms
    "0001Ss0SSSSSSSS0sS100000", // 18 hands / hips
    "0001sS01SSSSSS10Ss100000", // 19 hands
    "00001101SSSSSS1011000000", // 20 waist
    "00000001SS00SS1000000000", // 21 legs top
    "00000001SS00SS1000000000", // 22 legs
    "000000111001111000000000", // 23 feet
  ];
  drawPattern(body);

  // Eyes in 24x24: Sparkling eyes with whites, iris, deep pupil and catchlight
  const eyeStyle = avatar.eyeStyle || 'normal';
  if (eyeStyle === 'normal') {
    // Eyelash upper line
    set(7,5,'1'); set(8,5,'1'); set(9,5,'1');
    set(14,5,'1'); set(15,5,'1'); set(16,5,'1');
    // Row 6: left sclera + pupil + sparkle, right sparkle + pupil + sclera
    set(7,6,'W'); set(8,6,'e'); set(9,6,'W');
    set(14,6,'W'); set(15,6,'e'); set(16,6,'W');
    // Row 7: lower iris & shade
    set(7,7,'w'); set(8,7,'E'); set(9,7,'E');
    set(14,7,'E'); set(15,7,'E'); set(16,7,'w');
  } else if (eyeStyle === 'feliz') {
    // Anime joyful arc eyes (^ ^)
    set(7,6,'1'); set(8,5,'1'); set(9,5,'1'); set(10,6,'1');
    set(13,6,'1'); set(14,5,'1'); set(15,5,'1'); set(16,6,'1');
  } else if (eyeStyle === 'piscando') {
    // Left eye open & sparkling, right eye wink (~)
    set(7,5,'1'); set(8,5,'1'); set(9,5,'1');
    set(7,6,'W'); set(8,6,'e'); set(9,6,'W');
    set(7,7,'w'); set(8,7,'E'); set(9,7,'E');
    // Right wink line
    set(13,6,'1'); set(14,6,'1'); set(15,6,'1'); set(16,7,'1');
  } else if (eyeStyle === 'sonolento') {
    // Relaxed half-lidded eyes
    set(7,6,'1'); set(8,6,'1'); set(9,6,'1');
    set(14,6,'1'); set(15,6,'1'); set(16,6,'1');
    set(7,7,'W'); set(8,7,'E'); set(9,7,'E');
    set(14,7,'E'); set(15,7,'E'); set(16,7,'W');
  } else if (eyeStyle === 'bravo') {
    // Fierce sharp angled eyes
    set(7,5,'1'); set(8,6,'1'); set(9,6,'1');
    set(14,6,'1'); set(15,6,'1'); set(16,5,'1');
    set(8,7,'e'); set(9,7,'E');
    set(14,7,'E'); set(15,7,'e');
  }

  // Female extra lash flick
  if (avatar.gender === 'female' && eyeStyle === 'normal') {
    set(6,5,'1'); set(17,5,'1');
  }

  // Eyebrows
  const eyebrowStyle = avatar.eyebrowStyle || 'normal';
  if (eyebrowStyle === 'normal') {
    set(7,4,'h'); set(8,4,'H'); set(9,4,'H');
    set(14,4,'H'); set(15,4,'H'); set(16,4,'h');
  } else if (eyebrowStyle === 'brava') {
    set(7,3,'h'); set(8,4,'H'); set(9,4,'1');
    set(14,4,'1'); set(15,4,'H'); set(16,3,'h');
  } else if (eyebrowStyle === 'triste') {
    set(7,4,'1'); set(8,4,'H'); set(9,3,'h');
    set(14,3,'h'); set(15,4,'H'); set(16,4,'1');
  } else if (eyebrowStyle === 'arqueada') {
    set(7,4,'h'); set(8,3,'H'); set(9,3,'H');
    set(14,4,'h'); set(15,4,'H'); set(16,4,'h');
  }

  // Cute blush on cheeks
  set(5,8,'B'); set(6,8,'B');
  set(17,8,'B'); set(18,8,'B');

  // Subtle 3D nose shading
  set(11,8,'s'); set(12,8,'k');

  // Mouth
  const mouthStyle = avatar.mouthStyle || 'normal';
  if (mouthStyle === 'normal') {
    set(11,10,'M'); set(12,10,'M'); set(10,10,'m'); set(13,10,'m');
  } else if (mouthStyle === 'sorriso') {
    set(10,9,'m'); set(11,9,'W'); set(12,9,'W'); set(13,9,'m');
    set(11,10,'3'); set(12,10,'3');
    set(11,11,'m'); set(12,11,'m');
  } else if (mouthStyle === 'surpreso') {
    set(11,9,'m'); set(12,9,'m');
    set(11,10,'m'); set(12,10,'m');
  } else if (mouthStyle === 'triste') {
    set(11,9,'M'); set(12,9,'M');
    set(10,10,'m'); set(13,10,'m');
  } else if (mouthStyle === 'grito') {
    set(10,9,'m'); set(11,9,'m'); set(12,9,'m'); set(13,9,'m');
    set(10,10,'m'); set(11,10,'W'); set(12,10,'W'); set(13,10,'m');
    set(11,11,'3'); set(12,11,'3');
  }

  // ── 24x24 Clothes Styles ──
  const clothesStyles = {
    'casual': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001WW100000000000",
      "0000001111WW111100000000",
      "000001TRRRRRRRRT10000000",
      "00001TRRRRRRRRRRT1000000",
      "0001TRRRR1RR1RRRRT100000",
      "0001rrRRRRRRRRRRrr100000",
      "0001sS11DDDDDD11Ss100000",
      "0000111pDDDDDDp111000000",
      "00000001DD00DD1000000000",
      "0000001pDD00DDp100000000",
      "0000011CCX00XCC110000000",
    ],
    'esportivo': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001WW100000000000",
      "0000001111WW111100000000",
      "000001WWRRRRRRWW10000000",
      "00001RWRRRWWRRRWR1000000",
      "0001RRWRRRWWRRRWRR100000",
      "0001rrWRRRWWRRRWrr100000",
      "0001sS11DDWWD11Ss1000000",
      "0000111WDDDDDDW111000000",
      "00000001WD00DW1000000000",
      "00000011WD00DW1100000000",
      "0000011WWX00XWW110000000",
    ],
    'elegante': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000133100000000000",
      "000000111W33W11100000000",
      "000001TRRW33WRRT10000000",
      "00001TRRRW33WRRRT1000000",
      "0001TRRRRW33WRRRRT100000",
      "0001rrRRRR33RRRRrr100000",
      "0001sS11DDYYDD11Ss100000",
      "0000111pDDDDDDp111000000",
      "00000001DD00DD1000000000",
      "0000001pDD00DDp100000000",
      "00000111CC00CC1110000000",
    ],
    'aventura': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000177100000000000",
      "000000111177111100000000",
      "00000177RR77RR7710000000",
      "0000177RRR77RRR771000000",
      "000177RRR7YY7RRR77100000",
      "000188RRR7777RRR88100000",
      "0001sS1177YY7711Ss100000",
      "0000111pDDDDDDp111000000",
      "00000001pD00Dp1000000000",
      "0000001pDD00DDp100000000",
      "000001177C00C77110000000",
    ],
    'vestido': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001WW100000000000",
      "0000001111WW111100000000",
      "000001TRRRRRRRRT10000000",
      "00001TRRRRRRRRRRT1000000",
      "0001TRRRRWWWWWWRRT100000",
      "0001sS1RRRRRRRRRR1Ss1000",
      "000011RRRRrRRrRRRR110000",
      "0001RRRRRRrRRrRRRRRR1000",
      "0001RRRRRRRRRRRRRRRR1000",
      "00000001SS00SS1000000000",
      "00000011CC00CC1100000000",
    ],
    'vestido-real': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001YY100000000000",
      "0000001111YY111100000000",
      "000001YYRR33RRYY10000000",
      "00001YYRRRYYYRRRYY100000",
      "0001YYRRRRYYYRRRRYY10000",
      "0001sSYYYYYYYYYYYYSs1000",
      "00011RRYYYYYYYYYYRR11000",
      "001RRRRYYRRYYRRYYRRRR100",
      "01RRRRRYYRRYYRRYYRRRRR10",
      "00000001SS00SS1000000000",
      "00000011YY00YY1100000000",
    ],
    'armadura': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001WW100000000000",
      "0000001111WW111100000000",
      "000001WW1WWWW1WW10000000",
      "00001WW1WWWWWW1WW1000000",
      "0001wW1WWwYYwWW1Ww100000",
      "0001ww1WWWWWWWW1ww100000",
      "0001111111YY111111110000",
      "00001111WWWWWW1111000000",
      "00000001Ww00wW1000000000",
      "00000011Ww00wW1100000000",
      "00000111ww00ww1110000000",
    ],
    'mago': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001YY100000000000",
      "0000001111YY111100000000",
      "000001TRRYYYYRRT10000000",
      "00001TRRRRYYYYRRRT100000",
      "0001YYRRRR22RRRRYY100000",
      "001YYYRRRRYYYYRRRYYY1000",
      "0001sS1YYYYYYYY11Ss10000",
      "000011RRRRrRRrRRRR110000",
      "0001RRRRRRrRRrRRRRRR1000",
      "0001RRRYYRRRRRRYYRRR1000",
      "00000111YY00YY1110000000",
    ],
    'ninja': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000111100000000000",
      "000000111111111100000000",
      "0000011RRRRRRRR110000000",
      "000011RRRR11RRRR11000000",
      "00011RRRRR11RRRRR1100000",
      "0001wwRRRRRRRRRRww100000",
      "0001sS1113333111Ss100000",
      "0000111pRRRRRRp111000000",
      "00000001RR00RR1000000000",
      "00000011ww00ww1100000000",
      "000001111100111110000000",
    ],
    'samurai': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001YY100000000000",
      "0000001111YY111100000000",
      "000001YYRRRRRRYY10000000",
      "00001YY1RR33RR1YY1000000",
      "0001YY1RRR33RRR1YY100000",
      "0001rr1RRRYYRRR1rr100000",
      "0001sS111YYYY111Ss100000",
      "0000111pRRRRRRp111000000",
      "00000001RR00RR1000000000",
      "0000001pRR00RRp100000000",
      "000001177100177110000000",
    ],
    'hacker': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "0000000001GG100000000000",
      "0000001111GG111100000000",
      "0000011RRRGGGRRR11000000",
      "000011RRGGRRRGGRR1100000",
      "00011RRGRRRGRRRGRR110000",
      "0001rrRRRRGGGGRRRRrr10000",
      "0001sS111GGGG1111Ss10000",
      "0000111p1111111p11100000",
      "000000011G00G11000000000",
      "000000111G00G11100000000",
      "00000111GG00GG1110000000",
    ],
  };
  drawPattern(clothesStyles[avatar.clothingStyle] || clothesStyles['casual']);

  // ── 24x24 Hairstyles (with highlights 'L', shadows 'h', deep lines 'd') ──
  const hairStyles = {
    'liso': [
      "00000000dddddd0000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "000dhHHhhhhhhhhHHhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "0000dhH00000000Hhd000000",
      "00000dd00000000dd0000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'comprido': [
      "00000000dddddd0000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "000dhHHhhhhhhhhHHhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "000dhLH00000000HLhd00000",
      "000dhLH00000000HLhd00000",
      "000dhLH00000000HLhd00000",
      "0000dhH00000000Hhd000000",
      "00000dd00000000dd0000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'espetado': [
      "000000dd00dd00dd00000000",
      "00000dhLd0dhLddhLd0000000",
      "0000dhLLHdLLLLhdhLd000000",
      "000dhLLLLLLLLLLLLhd00000",
      "0000dhHHHHhhhhhHHhd000000",
      "0000dhH000000000Hhd000000",
      "00000dd000000000dd0000000",
      "000000000000000000000000",
    ],
    'cacheado': [
      "00000ddhLLhdhLLhdd000000",
      "0000dhLLLLLLLLLLhd000000",
      "000dhLLhdhLLhdhLLhd00000",
      "00dhLLh00000000hLLhd0000",
      "00dhHh0000000000hHhd0000",
      "000dh000000000000hd00000",
      "0000dd0000000000dd000000",
      "000000000000000000000000",
    ],
    'rabo-de-cavalo': [
      "00000000dddddd0000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "000dhHHhhhhhhhhHHhd00000",
      "000dhH0000000000Hhdddd00",
      "0000dh0000000000hd33hhd0",
      "00000dd000000000dhLLLHd0",
      "00000000000000000dhLLHd0",
      "000000000000000000dhHd00",
      "0000000000000000000dd000",
      "000000000000000000000000",
    ],
    'trancas': [
      "00000000dddddd0000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "000dhHHhhhhhhhhHHhd00000",
      "000dhH0000000000Hhd00000",
      "000dhH0000000000Hhd00000",
      "000dhLhd0000000dhLhd0000",
      "000dhHhd0000000dhHhd0000",
      "0000dhLhd000000dhLhd0000",
      "0000dhHhd000000dhHhd0000",
      "00000d33d0000000d33d0000",
      "000000dd000000000dd00000",
      "000000000000000000000000",
    ],
    'moicano': [
      "0000000000dd000000000000",
      "000000000dhLd00000000000",
      "00000000dhLLhd0000000000",
      "00000000dhLLhd0000000000",
      "0000000dhLLLLhd000000000",
      "000000ddhHHHHhdd00000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'chonmage': [
      "000000000011100000000000",
      "0000000001hhh10000000000",
      "000000001hLLh10000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "0000dhH000000000Hhd000000",
      "00000dd000000000dd0000000",
    ],
    'afro': [
      "000000dddddddddd00000000",
      "0000ddhLLLLLLLLhdd000000",
      "000dhLLLLLLLLLLLLhd00000",
      "00dhLLLLLLLLLLLLLLhd0000",
      "00dhLLLLLLLLLLLLLLhd0000",
      "000dhLL00000000LLhd00000",
      "0000dhH00000000Hhd000000",
      "00000dd00000000dd0000000",
    ],
    'curto': [
      "00000000dddddd0000000000",
      "000000ddhHHHHhdd00000000",
      "00000dhLLLLLLLLhd0000000",
      "0000dhLLLLLLLLLLhd000000",
      "0000dhHHhhhhhhHHhd000000",
      "00000dd00000000dd0000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
  };

  const hair = hairStyles[avatar.hairstyle] || hairStyles['liso'];
  // Keep eyes/face clear
  const hairClean = hair.map((r, y) => {
    if (y >= 5 && y <= 8) {
      return r.substring(0, 5) + '00000000000000' + r.substring(19);
    }
    return r;
  });
  drawPattern(hairClean);

  // ── 24x24 Hats ──
  const hatPatterns = {
    'chapeu-mago': [
      "000000000012210000000000",
      "000000000122221000000000",
      "000000001222222100000000",
      "00000001222YY22210000000",
      "000000122222222221000000",
      "000111222222222222111000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'chapeu-pirata': [
      "000000000000000000000000",
      "000000011111111000000000",
      "0000011111WW111110000000",
      "0001111WWWWWWWW111100000",
      "001YY111111111111YY10000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'coroa': [
      "000000000000000000000000",
      "000001Y001Y001Y001Y00000",
      "00001YZ11YZ11YZ11YZ10000",
      "00001Y3YYY4YYY5YYY3Y10000",
      "00001YYYYYYYYYYYYYY10000",
      "000001111111111111100000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'elmo': [
      "000000000133310000000000",
      "000000001133311000000000",
      "00000011wwwwww1100000000",
      "000001wwwwWWwwww10000000",
      "00001wwwwWWWWwwww1000000",
      "000011111111111111000000",
      "00001wwww1111wwww1000000",
      "000001111000011110000000",
    ],
    'chapeu-cowboy': [
      "000000000000000000000000",
      "000000000777770000000000",
      "000000007788877000000000",
      "000000077788877700000000",
      "0000001777yyy77710000000",
      "001777777777777777771000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'tiara': [
      "000000000000000000000000",
      "0000000001W0W10000000000",
      "000000001WW4WW1000000000",
      "00000001YYYYYYYY10000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'headband': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000013333333333333100000",
      "00001333331YY13333100000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'chapeu-chef': [
      "000000001WWWW10000000000",
      "0000001WWWWWWWW100000000",
      "000001WWWWWWWWWW10000000",
      "00001WWWWWWWWWWWW1000000",
      "00000111WWWWWW1110000000",
      "000000011111111000000000",
      "000000000000000000000000",
      "000000000000000000000000",
    ],
    'mascara-ninja': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000001111111111111000000",
      "000001111111111111000000",
      "000000111111111110000000",
      "000000000000000000000000",
    ],
  };
  if (avatar.hatStyle && hatPatterns[avatar.hatStyle]) {
    drawPattern(hatPatterns[avatar.hatStyle]);
  }

  // ── 24x24 Weapons ──
  const weaponPatterns = {
    'espada-madeira': [
      "000000000000000000000000",
      "000000000000000000011000",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000000177100",
      "000000000000000001188110",
      "000000000000000000011000",
      "000000000000000000011000",
      "000000000000000000011000",
      "000000000000000000000000",
    ],
    'espada-ferro': [
      "000000000000000000000000",
      "000000000000000000011000",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "0000000000000000001wW100",
      "000000000000000001YYYY10",
      "000000000000000000011000",
      "000000000000000000011000",
      "00000000000000000001Y100",
      "000000000000000000000000",
    ],
    'espada-ouro': [
      "000000000000000000000000",
      "000000000000000000011000",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "0000000000000000001yZ100",
      "000000000000000001Y33Y10",
      "000000000000000000011000",
      "000000000000000000011000",
      "000000000000000000013100",
      "000000000000000000000000",
    ],
    'cajado': [
      "000000000000000000011000",
      "000000000000000000144100",
      "0000000000000000014WW410",
      "000000000000000000144100",
      "000000000000000001YYYY10",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000111100",
    ],
    'varinha': [
      "000000000000000000000000",
      "000000000000000000011000",
      "0000000000000000001ZZ100",
      "000000000000000001ZWWZ10",
      "0000000000000000001ZZ100",
      "0000000000000000001YY100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000188100",
      "000000000000000000111100",
    ],
    'arco': [
      "000000000000000000011000",
      "000000000000000000171w00",
      "000000000000000001710w00",
      "000000000000000017100w00",
      "000000000000000171000w00",
      "000000000000001710000w00",
      "000000000000017100000w00",
      "000000000000171000000w00",
      "000000000000188100000w00",
      "000000000000171000000w00",
      "000000000000017100000w00",
      "000000000000001710000w00",
      "000000000000000171000w00",
      "000000000000000017100w00",
      "000000000000000001710w00",
      "000000000000000000171w00",
      "000000000000000000011000",
    ],
    'katana': [
      "000000000000000000000010",
      "0000000000000000000001W1",
      "000000000000000000001w10",
      "00000000000000000001w100",
      "0000000000000000001w1000",
      "000000000000000001w10000",
      "00000000000000001w100000",
      "0000000000000001w1000000",
      "000000000000001w10000000",
      "00000000000001w100000000",
      "0000000000001w1000000000",
      "000000000001w10000000000",
      "00000000001YY10000000000",
      "000000000111100000000000",
      "000000001111000000000000",
      "00000001YY10000000000000",
    ],
    'escudo': [
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "000000000000000000000000",
      "001111111111000000000000",
      "01WWWWWWWWWW100000000000",
      "01WWWWYYWWWW100000000000",
      "01WWWWYYWWWW100000000000",
      "01YYYYYYYYYY100000000000",
      "01YYYYYYYYYY100000000000",
      "01WWWWYYWWWW100000000000",
      "01WWWWYYWWWW100000000000",
      "001WWWWWWWW1000000000000",
      "0001WWWWWW10000000000000",
      "00001WWWW100000000000000",
      "000001111000000000000000",
    ],
  };
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

// ── AvatarGraphic SVG renderer ───────────────────────────────────────────────
export const AvatarGraphic = ({ avatar, viewBox }) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = buildColorMap(avatar);
  const cols = grid[0]?.length || 24;
  const rows = grid.length || 24;
  const vb = viewBox || `0 0 ${cols} ${rows}`;
  return (
    <svg width="100%" height="100%" viewBox={vb} style={{ display: 'block', shapeRendering: 'crispEdges' }}>
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

    // Load from local storage immediately so it is instant
    const saved = localStorage.getItem(`student_custom_avatar_${userId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAvatar({ ...defaultAvatar, ...parsed });
      } catch (e) {}
    } else {
      setAvatar(defaultAvatar);
    }

    // Synchronize with database
    const syncWithBackend = async () => {
      try {
        const res = await apiClient.get(`/users/${userId}`);
        if (res.data && res.data.avatar) {
          const parsedDb = JSON.parse(res.data.avatar);
          setAvatar({ ...defaultAvatar, ...parsedDb });
          localStorage.setItem(`student_custom_avatar_${userId}`, JSON.stringify(parsedDb));
          if (parsedDb.unlockedItems) {
            localStorage.setItem(`student_unlocked_items_${userId}`, JSON.stringify(parsedDb.unlockedItems));
          }
        }
      } catch (err) {
        console.error("Erro ao sincronizar avatar com o servidor:", err);
      }
    };
    syncWithBackend();
  }, [userId]);

  const handleSave = async (newAvatar) => {
    setAvatar(newAvatar);
    if (userId) {
      let currentUnlocked = [];
      try {
        const saved = localStorage.getItem(`student_unlocked_items_${userId}`);
        if (saved) currentUnlocked = JSON.parse(saved);
      } catch (e) {}

      const avatarPayload = {
        ...newAvatar,
        unlockedItems: currentUnlocked
      };

      localStorage.setItem(`student_custom_avatar_${userId}`, JSON.stringify(newAvatar));
      
      try {
        await apiClient.put(`/users/${userId}`, { avatar: JSON.stringify(avatarPayload) });
      } catch (err) {
        console.error("Erro ao salvar avatar no servidor:", err);
      }
    }
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
      if (userId) {
        try {
          const saved = localStorage.getItem(`student_unlocked_items_${userId}`);
          setUnlockedItems(saved ? JSON.parse(saved) : []);
        } catch (e) {
          setUnlockedItems([]);
        }
      }
    }
  }, [open, currentAvatar, userId]);

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
          maxHeight: { xs: '95vh', md: 'none' },
          overflow: 'hidden'
        }
      }}
    >
      {/* Header row */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        p: { xs: 2, sm: 3 },
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
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
        <Box sx={{ display: 'flex', bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: '30px', p: 0.5, mr: { xs: 0, sm: 5 } }}>
          <Button
            onClick={() => setActiveTab('personalizar')}
            sx={{
              borderRadius: '25px',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
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
              px: { xs: 2, sm: 3 },
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
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        p: { xs: 2, md: 3 },
        gap: { xs: 2, md: 2 },
        height: { xs: '380px', sm: '420px', md: '480px' },
        overflow: 'hidden'
      }}>
        {activeTab === 'personalizar' ? (
          <>
            {/* Left Column: Preview + Presets */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              justifyContent: { xs: 'space-around', md: 'flex-start' },
              alignItems: 'center',
              width: { xs: '100%', md: '148px' },
              flexShrink: 0,
              borderRight: { xs: 'none', md: '1px solid rgba(255,255,255,0.08)' },
              borderBottom: { xs: '1px solid rgba(255,255,255,0.08)', md: 'none' },
              pr: { xs: 0, md: 2 },
              pb: { xs: 2, md: 0 },
              mb: { xs: 2, md: 0 },
              gap: 2
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', mb: 1, letterSpacing: '0.8px' }}>
                  Visualização
                </Typography>
                
                <Box
                  sx={{
                    width: { xs: 100, md: 128 },
                    height: { xs: 100, md: 128 },
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: 'rgba(13, 27, 42, 0.7)',
                    border: '3px solid rgba(0, 180, 216, 0.5)',
                    boxShadow: '0 0 20px rgba(0, 180, 216, 0.2), inset 0 0 10px rgba(0,0,0,0.3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    mb: { xs: 0, md: 2.5 },
                  }}
                >
                  <Box sx={{ width: '100%', height: '100%', imageRendering: 'pixelated', animation: 'idleBob 2.5s ease-in-out infinite' }}>
                    <AvatarGraphic avatar={tempAvatar} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '120px', flexGrow: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', mb: 1, letterSpacing: '0.8px' }}>
                  Presets
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, overflowX: { xs: 'auto', md: 'visible' }, overflowY: { xs: 'hidden', md: 'auto' }, maxHeight: { xs: '60px', md: '200px' }, pb: { xs: 0.5, md: 0 } }}>
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
                        whiteSpace: 'nowrap',
                        gap: 1.5,
                        '&:hover': {
                          bgcolor: 'rgba(0, 212, 255, 0.08)',
                          borderColor: 'rgba(0, 212, 255, 0.4)',
                          transform: { xs: 'none', md: 'translateX(2px)' },
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
            </Box>

            {/* Right Column: Tab navigation + Option fields */}
            <Box sx={{ flexGrow: 1, pl: { xs: 0, md: 2 }, mt: { xs: 2, md: 0 }, display: 'flex', flexDirection: 'column', overflowY: 'auto', pr: 0.5 }}>
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
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
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
