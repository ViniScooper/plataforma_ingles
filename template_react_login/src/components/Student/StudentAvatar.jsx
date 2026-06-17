import React, { useState, useEffect } from 'react';
import { Box, Dialog, IconButton, Grid, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import './StudentAvatar.css';

const presets = {
  'Pirata': { gender: 'male', hairstyle: 'comprido', hairColor: '#FFD700', skinTone: '#D4A574', eyeColor: '#000000', clothingStyle: 'aventura', clothingColor: '#8B4513', pantsColor: '#1A1A1A', shoesColor: '#111111' },
  'Ninja': { gender: 'male', hairstyle: 'espetado', hairColor: '#4A2C15', skinTone: '#C4B8A0', eyeColor: '#2C1810', clothingStyle: 'elegante', clothingColor: '#1A1A1A', pantsColor: '#1A1A1A', shoesColor: '#111111' },
  'Mago': { gender: 'female', hairstyle: 'cacheado', hairColor: '#86C06E', skinTone: '#E6B89A', eyeColor: '#FFD700', clothingStyle: 'elegante', clothingColor: '#9B59B6', pantsColor: '#34495E', shoesColor: '#1e293b' },
  'Casual': { gender: 'male', hairstyle: 'liso', hairColor: '#6B4423', skinTone: '#E6B89A', eyeColor: '#000000', clothingStyle: 'casual', clothingColor: '#E74C3C', pantsColor: '#3E4A4E', shoesColor: '#ffffff' }
};

const HAIRSTYLES = ['liso', 'comprido', 'espetado', 'cacheado'];
const CLOTHING_STYLES = ['casual', 'esportivo', 'elegante', 'aventura'];

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
    "0000SSSS00000000",
    "000SSSSSS0000000",
    "00SSSSSSSS000000",
    "00SSSSSSSS000000",
    "00SSSSSSSS000000",
    "000SSSSSS0000000",
    "0000SSSS00000000",
    "000SSSSSS0000000",
    "00SSSSSSSS000000",
    "0SSSSSSSSSS00000",
    "0SSSSSSSSSS00000",
    "00SSSSSSSS000000",
    "000SSSSSS0000000",
    "00SS0000SS000000",
  ];
  drawPattern(baseBody, 'S');

  // Eyes (aligned perfectly looking forward)
  grid[4][4] = '1'; // Top left (pupil)
  grid[5][4] = 'E'; // Bottom left (iris color)
  
  grid[4][7] = '1'; // Top right (pupil)
  grid[5][7] = 'E'; // Bottom right (iris color)

  // Mouth
  grid[6][5] = 'M';
  grid[6][6] = 'M';

  if (avatar.gender === 'female') {
    grid[4][3] = '1'; // eyelash left
    grid[4][8] = '1'; // eyelash right
  }

  const clothesStyles = {
    'casual': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "000RRRRRR0000000", "00RRRRRRRR000000", "0RRRRRRRRRR00000",
      "0RRRRRRRRRR00000", "00DDDDDDDD000000", "000DDDDDD0000000", "00CC0000CC000000",
    ],
    'esportivo': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000WWWW00000000", "000RRRRRR0000000", "00RWRRRRWR000000", "0RWRRRRRRWR00000",
      "0RWRRRRRRWR00000", "00DDDDDDDD000000", "000DWDWDW0000000", "00CC0000CC000000",
    ],
    'elegante': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "00000RR000000000", "000RWRRWR0000000", "00RRWRRWRR000000", "0RRRWRRWRRR00000",
      "0RRRRRRRRRR00000", "00DDDDDDDD000000", "000DDDDDD0000000", "00CC0000CC000000",
    ],
    'aventura': [
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "0000000000000000", "0000000000000000", "0000000000000000",
      "0000000000000000", "000R7777R0000000", "00RR7777RR000000", "0RRRRRRRRRR00000",
      "0RR777777RR00000", "00DDDDDDDD000000", "000DDDDDD0000000", "00CC0000CC000000",
    ]
  };
  drawPattern(clothesStyles[avatar.clothingStyle] || clothesStyles['casual']);

  const hairStyles = {
    'liso': [
      "0000000000000000", "0000HHHH00000000", "000HHHHHH0000000", "00HHHHHHHH000000",
      "00HH0000HH000000", "00H000000H000000",
    ],
    'comprido': [
      "0000000000000000", "0000HHHH00000000", "000HHHHHH0000000", "00HHHHHHHH000000",
      "00HH0000HH000000", "00HH0000HH000000", "00HH0000HH000000", "00HH0000HH000000", "00HH0000HH000000",
    ],
    'espetado': [
      "0000H00H00000000", "000H0H00H0000000", "00HHHHHHHH000000", "0HHHHHHHHHH00000",
      "00HH0000HH000000",
    ],
    'cacheado': [
      "0000000000000000", "0000HHHH00000000", "00HHHHHHHH000000", "0HHHHHHHHHH00000",
      "00HH0000HH000000", "00H000000H000000",
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

const AvatarGraphic = ({ avatar }) => {
  const grid = getAvatarGrid(avatar);
  const colorMap = {
    'H': avatar.hairColor, 'S': avatar.skinTone, 'E': avatar.eyeColor || '#111111', 
    'W': '#ffffff', 'M': '#8b4513', 'R': avatar.clothingColor, 'D': avatar.pantsColor,
    '1': '#111111', '7': '#8b4513', 'C': avatar.shoesColor || '#1e293b'
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 16 16" style={{ display: 'block', shapeRendering: 'crispEdges' }}>
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

        <div className="preview-container">
          <div className="character-preview">
            <div className="character-sprite-svg">
              <AvatarGraphic avatar={temp} />
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
            <label>COR DA ROUPA</label>
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
