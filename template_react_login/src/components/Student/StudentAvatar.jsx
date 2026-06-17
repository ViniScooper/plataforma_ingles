import React, { useState, useEffect } from 'react';
import { Box, Dialog, IconButton, Grid, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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

const presets = {
  'Pirata': { gender: 'male', hairstyle: 'comprido', hairColor: '#FFD700', skinTone: '#D4A574', eyeColor: '#000000', clothingStyle: 'aventura', clothingColor: '#8B4513', pantsColor: '#1A1A1A', shoesColor: '#111111' },
  'Ninja': { gender: 'male', hairstyle: 'espetado', hairColor: '#4A2C15', skinTone: '#C4B8A0', eyeColor: '#2C1810', clothingStyle: 'elegante', clothingColor: '#1A1A1A', pantsColor: '#1A1A1A', shoesColor: '#111111' },
  'Mago': { gender: 'female', hairstyle: 'cacheado', hairColor: '#86C06E', skinTone: '#E6B89A', eyeColor: '#FFD700', clothingStyle: 'elegante', clothingColor: '#9B59B6', pantsColor: '#34495E', shoesColor: '#1e293b' },
  'Casual': { gender: 'male', hairstyle: 'liso', hairColor: '#6B4423', skinTone: '#E6B89A', eyeColor: '#000000', clothingStyle: 'casual', clothingColor: '#E74C3C', pantsColor: '#3E4A4E', shoesColor: '#ffffff' }
};

const HAIRSTYLES = ['liso', 'comprido', 'espetado', 'cacheado', 'rabo-de-cavalo', 'trancas'];
const CLOTHING_STYLES = ['casual', 'esportivo', 'elegante', 'aventura', 'vestido'];

const SKIN_TONES = [
  { name: 'Muito Clara', color: '#F5DEB3' },
  { name: 'Clara', color: '#E6B89A' },
  { name: 'Média Clara', color: '#F4C4A0' },
  { name: 'Morena', color: '#D9A584' },
  { name: 'Morena Escura', color: '#A0826D' },
  { name: 'Escura', color: '#8B6D5C' },
  { name: 'Muito Escura', color: '#6B5D52' },
];

const HAIR_COLORS = [
  '#2C1810', '#6B4423', '#8B6F47', '#D4A574', '#FFD700',
  '#C0504D', '#000000', '#D9A4DC', '#5C8A9F', '#86C06E',
];

const EYE_COLORS = [
  '#000000', '#4A2C15', '#6B5D52', '#3E6A8C', '#2D5A3D',
  '#6C3A7C', '#8B4513', '#1A1A1A', '#4A4A4A', '#2C3335',
];

const CLOTHING_COLORS = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  '#1ABC9C', '#34495E', '#ECF0F1', '#C0504D', '#8B4513',
];

const PANTS_COLORS = [
  '#3E4A4E', '#1A1A1A', '#5C6F7E', '#6B4423', '#34495E',
  '#8B6F47', '#4A3F35', '#7F8C8D', '#2C3335', '#5C4D38',
];

const SHOE_COLORS = [
  '#1e293b', '#111111', '#ffffff', '#E74C3C', '#8B4513', '#7F8C8D',
];

export const getAvatarGrid = (avatar) => {
  let grid = Array.from({length: 16}, () => Array(16).fill('0'));

  const drawPattern = (pattern, charToReplace) => {
    for(let y=0; y<pattern.length; y++) {
      for(let x=0; x<pattern[y].length; x++) {
        if(pattern[y][x] !== '0' && pattern[y][x] !== '.') {
          grid[y][x] = charToReplace || pattern[y][x];
        }
      }
    }
  };

  const baseBody = [
    "0000000000000000",
    "0000000000000000",
    "000000SSSS000000",
    "00000SSSSSS00000",
    "0000SSSSSSSS0000",
    "0000SSSSSSSS0000",
    "0000SSSSSSSS0000",
    "00000SSSSSS00000",
    "0000000SS0000000",
    "00000SSSSSS00000",
    "000SS0SSSS0SS000",
    "000SS0SSSS0SS000",
    "000SS0SSSS0SS000",
    "000000SSSS000000",
    "000000SSSS000000",
    "0000000000000000",
  ];
  drawPattern(baseBody, 'S');

  // Eye styles
  const eyeStyle = avatar.eyeStyle || 'normal';
  if (eyeStyle === 'normal') {
    grid[4][6] = '1'; grid[5][6] = 'E';
    grid[4][9] = '1'; grid[5][9] = 'E';
  } else if (eyeStyle === 'feliz') {
    grid[4][6] = '1'; grid[4][9] = '1';
  } else if (eyeStyle === 'piscando') {
    grid[4][6] = '1'; grid[5][6] = 'E'; // left normal
    grid[5][9] = '1'; // right closed line
  }

  if (avatar.gender === 'female') {
    if (eyeStyle !== 'feliz') {
      grid[4][5] = '1';
      if (eyeStyle !== 'piscando') grid[4][10] = '1';
    }
  }

  // Mouth styles
  const mouthStyle = avatar.mouthStyle || 'normal';
  if (mouthStyle === 'normal') {
    grid[6][7] = 'M'; grid[6][8] = 'M';
  } else if (mouthStyle === 'sorriso') {
    grid[6][6] = 'M'; grid[7][7] = 'M'; grid[7][8] = 'M'; grid[6][9] = 'M';
  } else if (mouthStyle === 'surpreso') {
    grid[6][7] = 'M'; grid[7][7] = 'M'; grid[6][8] = 'M'; grid[7][8] = 'M';
  } else if (mouthStyle === 'triste') {
    grid[7][6] = 'M'; grid[6][7] = 'M'; grid[6][8] = 'M'; grid[7][9] = 'M';
  }

  // Eyebrow styles
  const eyebrowStyle = avatar.eyebrowStyle || 'nenhuma';
  if (eyebrowStyle === 'normal') {
    grid[3][6] = 'H'; grid[3][9] = 'H';
  } else if (eyebrowStyle === 'brava') {
    grid[3][6] = 'H'; grid[2][5] = 'H';
    grid[3][9] = 'H'; grid[2][10] = 'H';
  } else if (eyebrowStyle === 'triste') {
    grid[2][6] = 'H'; grid[3][5] = 'H';
    grid[2][9] = 'H'; grid[3][10] = 'H';
  }

  const clothesStyles = {
    'casual': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "00000rRRRr000000", "000RrRrrrrRr0000", "000000rRRr000000",
      "000000RRRR000000", "00000dDDDDd00000", "000000dDDd000000", "00000cC00Cc00000",
    ],
    'esportivo': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "00000WWWW0000000", "0000RRRRRR000000", "0000R0RR00R00000", "000000RWRR000000",
      "000000RRWR000000", "00000DDDDDD00000", "0000000000000000", "00000CC00CC00000",
    ],
    'elegante': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000RR0000000", "00000RRRR0000000", "000RR0RRRR0RR000", "000RR0RWRR0RR000",
      "000RR0RRWR0RR000", "00000DDDDDD00000", "000000DDDD000000", "00000CC00CC00000",
    ],
    'aventura': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000R7777R000000", "000RR0770RR00000", "000000RRRR000000",
      "000000R77R000000", "00000DDDDDD00000", "0000000000000000", "00000CC00CC00000",
    ],
    'vestido': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000RR00RR000000", "00000RRRR0000000", "00000RRRR0000000",
      "00000RRRR0000000", "0000RRRRRR000000", "0000RRRRRR000000", "00000C0000C00000",
    ]
  };
  drawPattern(clothesStyles[avatar.clothingStyle] || clothesStyles['casual']);

  const hairStyles = {
    'liso': [
      "0000000000000000", "00000hhhhhh00000", "0000hHHHHHHh0000", "000hHHHHHHHHh000",
      "000hH000000Hh000", "000hH000000Hh000", "000hh000000hh000",
    ],
    'comprido': [
      "0000000000000000", "00000hhhhhh00000", "0000hHHHHHHh0000", "000hHHHHHHHHh000",
      "000hH000000Hh000", "000hH000000Hh000", "000hH000000Hh000", "000hH000000Hh000", 
      "000hH000000Hh000", "0000h000000h0000", "0000000000000000"
    ],
    'espetado': [
      "00000H0000H00000", "0000H0H00H0H0000", "0000HHHHHHHH0000", "000HHHHHHHHHH000",
      "000HH000000HH000",
    ],
    'cacheado': [
      "00000HHHHHH00000", "0000HHHHHHHH0000", "000HHHHHHHHHH000", "00HHHHHHHHHHHH00",
      "000HH000000HH000", "000H00000000H000",
    ],
    'rabo-de-cavalo': [
      "0000000000000000", "00000HHHHHH00000", "0000HHHHHHHH0000", "000HHHHHHHHHH000",
      "000HH000000HH000", "000H00000000H000", "00000000000HHH00", "000000000000HH00", 
      "000000000000HH00", "000000000000H000"
    ],
    'trancas': [
      "0000000000000000", "00000HHHHHH00000", "0000HHHHHHHH0000", "000HHHHHHHHHH000",
      "000HH000000HH000", "000HH000000HH000", "000H00000000H000", "00H0H000000H0H00", 
      "000H00000000H000", "00H0H000000H0H00", "000H00000000H000"
    ]
  };
  
  // Clean row 4 columns used by eyes
  const hair = hairStyles[avatar.hairstyle] || hairStyles['liso'];
  const hairClean = hair.map((r, y) => y === 4 ? r.substring(0, 3) + '00' + r.substring(5, 7) + '00' + r.substring(9) : r);
  drawPattern(hairClean, 'H');

  return grid.map(row => row.join(''));
};

export const renderAvatarPixels = (ctx, avatar, startX, startY, pixelSize) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = {
    'H': avatar.hairColor, 'S': avatar.skinTone, 'E': avatar.eyeColor || '#111111', 
    'W': '#ffffff', 'M': '#8b4513', 'R': avatar.clothingColor, 'D': avatar.pantsColor,
    '1': '#111111', '7': '#8b4513', 'C': avatar.shoesColor || '#1e293b'
  };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const char = grid[y][x];
      if (char !== '0') {
        ctx.fillStyle = colorMap[char];
        ctx.fillRect(startX + x * pixelSize, startY + y * pixelSize, pixelSize, pixelSize);
      }
    }
  }
};

export const StudentAvatar = ({ size = 80, editable = false, onChange }) => {
  const [open, setOpen] = useState(false);
  
  const defaultAvatar = {
    gender: 'male',
    hairstyle: 'liso',
    hairColor: '#6B4423',
    skinTone: '#E6B89A',
    eyeColor: '#000000',
    clothingStyle: 'casual',
    clothingColor: '#E74C3C',
    pantsColor: '#3E4A4E',
    shoesColor: '#1e293b'
  };

  const [avatar, setAvatar] = useState(defaultAvatar);

  useEffect(() => {
    const saved = localStorage.getItem('student_custom_avatar');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAvatar({ ...defaultAvatar, ...parsed });
      } catch (e) {}
    }
  }, []);

  const handleSave = (newAvatar) => {
    setAvatar(newAvatar);
    localStorage.setItem('student_custom_avatar', JSON.stringify(newAvatar));
    setOpen(false);
    if (onChange) onChange(newAvatar);
  };

  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <Box 
        sx={{ 
          width: size, height: size, 
          borderRadius: '16px', 
          overflow: 'hidden', 
          bgcolor: 'rgba(13, 27, 42, 0.6)',
          border: '3px solid rgba(0, 180, 216, 0.4)',
          boxShadow: '0 0 20px rgba(0, 180, 216, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          cursor: editable ? 'pointer' : 'default',
          imageRendering: 'pixelated',
          animation: 'idleBob 2s infinite ease-in-out',
          '@keyframes idleBob': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-4px)' }
          }
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
            position: 'absolute', 
            bottom: -5, 
            right: -5, 
            bgcolor: '#7c4dff', 
            color: '#fff',
            '&:hover': { bgcolor: '#b388ff' }
          }}
        >
          <EditIcon fontSize="small" sx={{ width: 16, height: 16 }} />
        </IconButton>
      )}

      <AvatarEditorDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        currentAvatar={avatar} 
        onSave={handleSave} 
      />
    </Box>
  );
};

const AvatarGraphic = ({ avatar, viewBox = "0 0 16 16" }) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = {
    'H': avatar.hairColor, 'S': avatar.skinTone, 'E': avatar.eyeColor || '#111111', 
    'W': '#ffffff', 'M': '#8b4513', 'R': avatar.clothingColor, 'D': avatar.pantsColor,
    '1': '#111111', '7': '#8b4513', 'C': avatar.shoesColor || '#1e293b',
    'h': darkenColor(avatar.hairColor, 0.25),
    's': darkenColor(avatar.skinTone, 0.15),
    'r': darkenColor(avatar.clothingColor, 0.25),
    'd': darkenColor(avatar.pantsColor, 0.25),
    'c': darkenColor(avatar.shoesColor || '#1e293b', 0.25)
  };

  return (
    <svg width="100%" height="100%" viewBox={viewBox} style={{ display: 'block', shapeRendering: 'crispEdges' }}>
      {grid.map((row, y) => 
        row.split('').map((char, x) => {
          if (char === '0') return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={colorMap[char]} />
        })
      )}
    </svg>
  );
};

const AvatarEditorDialog = ({ open, onClose, currentAvatar, onSave }) => {
  const [temp, setTemp] = useState(currentAvatar);

  useEffect(() => {
    if (open) setTemp(currentAvatar);
  }, [open, currentAvatar]);

  const applyPreset = (name) => {
    setTemp((prev) => ({ ...prev, ...presets[name] }));
  };

  const handleChange = (key, value) => {
    setTemp((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" PaperProps={{ sx: { bgcolor: '#1e1e2e', color: '#fff', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', p: 3 } }}>
      <div className="character-creator">
        <h1 style={{ margin: 0, marginBottom: '20px', fontSize: '24px', textAlign: 'center', color: '#00d4ff' }}>CRIADOR DE PERSONAGEM</h1>

        <div className="preview-container" style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="character-preview" style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', top: -12, background: '#00d4ff', color: '#000', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 'bold', border: '2px solid #0d1b2a' }}>Corpo</span>
            <div className="character-sprite-svg">
              <AvatarGraphic avatar={temp} />
            </div>
          </div>

          <div className="character-preview" style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', top: -12, background: '#e91e63', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 'bold', border: '2px solid #0d1b2a' }}>Rosto</span>
            <div className="character-sprite-svg">
              <AvatarGraphic avatar={temp} viewBox="3 0 12 9" />
            </div>
          </div>
        </div>

        {/* PRESETS */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1, justifyContent: 'center' }}>
          {Object.keys(presets).map(p => (
            <Button key={p} size="small" variant="outlined" onClick={() => applyPreset(p)} sx={{ borderRadius: 4, fontWeight: 800, borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {p}
            </Button>
          ))}
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>GÊNERO</Typography>
            <select 
              value={temp.gender || 'male'} 
              onChange={e => handleChange('gender', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>PENTEADO</Typography>
            <select 
              value={temp.hairstyle} 
              onChange={e => handleChange('hairstyle', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="liso">Liso</option>
              <option value="comprido">Comprido</option>
              <option value="espetado">Espetado</option>
              <option value="cacheado">Cacheado</option>
              <option value="rabo-de-cavalo">Rabo de Cavalo</option>
              <option value="trancas">Tranças</option>
            </select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>ESTILO ROUPA</Typography>
            <select 
              value={temp.clothingStyle} 
              onChange={e => handleChange('clothingStyle', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="casual">Casual</option>
              <option value="esportivo">Esportivo</option>
              <option value="elegante">Elegante</option>
              <option value="aventura">Aventura</option>
              <option value="vestido">Vestido</option>
            </select>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>EXPRESSÃO (OLHOS)</Typography>
            <select 
              value={temp.eyeStyle || 'normal'} 
              onChange={e => handleChange('eyeStyle', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="normal">Normal</option>
              <option value="feliz">Feliz</option>
              <option value="piscando">Piscando</option>
            </select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>EXPRESSÃO (BOCA)</Typography>
            <select 
              value={temp.mouthStyle || 'normal'} 
              onChange={e => handleChange('mouthStyle', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="normal">Normal</option>
              <option value="sorriso">Sorriso</option>
              <option value="surpreso">Surpreso</option>
              <option value="triste">Triste</option>
            </select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, mb: 1, display: 'block' }}>SOBRANCELHAS</Typography>
            <select 
              value={temp.eyebrowStyle || 'nenhuma'} 
              onChange={e => handleChange('eyebrowStyle', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', outline: 'none' }}
            >
              <option value="nenhuma">Nenhuma</option>
              <option value="normal">Normal</option>
              <option value="brava">Brava</option>
              <option value="triste">Triste</option>
            </select>
          </Grid>
        </Grid>

        <div className="swatches-container">
          <div className="swatch-group">
            <label>COR DA PELE</label>
            <div className="swatch-grid">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.color}
                  className={`swatch ${temp.skinTone === tone.color ? 'active' : ''}`}
                  style={{ backgroundColor: tone.color }}
                  onClick={() => handleChange('skinTone', tone.color)}
                  title={tone.name}
                />
              ))}
            </div>
          </div>

          <div className="swatch-group">
            <label>COR DOS OLHOS</label>
            <div className="swatch-grid">
              {EYE_COLORS.map((color) => (
                <button
                  key={color}
                  className={`swatch ${temp.eyeColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('eyeColor', color)}
                />
              ))}
            </div>
          </div>

          <div className="swatch-group">
            <label>COR DO CABELO</label>
            <div className="swatch-grid">
              {HAIR_COLORS.map((color) => (
                <button
                  key={color}
                  className={`swatch ${temp.hairColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('hairColor', color)}
                />
              ))}
            </div>
          </div>

          <div className="swatch-group">
            <label>{temp.clothingStyle === 'vestido' ? 'COR DO VESTIDO' : 'COR DA ROUPA'}</label>
            <div className="swatch-grid">
              {CLOTHING_COLORS.map((color) => (
                <button
                  key={color}
                  className={`swatch ${temp.clothingColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('clothingColor', color)}
                />
              ))}
            </div>
          </div>

          {temp.clothingStyle !== 'vestido' && (
            <div className="swatch-group">
              <label>COR DAS CALÇAS</label>
              <div className="swatch-grid">
                {PANTS_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`swatch ${temp.pantsColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange('pantsColor', color)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="swatch-group">
            <label>COR DO SAPATO</label>
            <div className="swatch-grid">
              {SHOE_COLORS.map((color) => (
                <button
                  key={color}
                  className={`swatch ${temp.shoesColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('shoesColor', color)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={() => onSave(temp)}>
            Salvar Avatar
          </button>
        </div>
      </div>
    </Dialog>
  );
};
