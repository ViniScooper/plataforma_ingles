import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

export default function AchievementsModal({
  open,
  onClose,
  badges = [],
  currentLevel = 1,
  xpInCurrentLevel = 0,
  xpPerLevel = 100,
  levelPercent = 0
}) {
  const unlockedCount = badges.filter(b => b.active).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #0d1b2a, #070f19)',
          border: '1px solid rgba(179, 136, 255, 0.25)',
          borderRadius: 4,
          color: '#fff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'rgba(179, 136, 255, 0.15)',
            color: '#b388ff'
          }}>
            <EmojiEventsIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
              Suas Conquistas
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {unlockedCount} de {badges.length} desbloqueadas
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', py: 2.5 }}>
        {/* Nível e Barra de XP */}
        <Box sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: 'rgba(0, 180, 216, 0.08)',
          border: '1px solid rgba(0, 180, 216, 0.2)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon sx={{ color: '#00b4d8', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                Progresso de Nível
              </Typography>
            </Box>
            <Chip
              label={`Nível ${currentLevel}`}
              size="small"
              sx={{
                fontWeight: 900,
                bgcolor: 'rgba(0, 180, 216, 0.2)',
                color: '#00b4d8',
                border: '1px solid rgba(0, 180, 216, 0.4)',
                fontSize: '0.75rem'
              }}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                XP para o próximo nível
              </Typography>
              <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 900 }}>
                {xpInCurrentLevel} / {xpPerLevel} XP
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={levelPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                  borderRadius: 4
                }
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', display: 'block', fontStyle: 'italic' }}>
            Cada atividade concluída concede +100 XP para subir de nível!
          </Typography>
        </Box>

        {/* Grade de Conquistas */}
        <Grid container spacing={1.5}>
          {badges.map((badge) => (
            <Grid item xs={6} sm={6} key={badge.id}>
              <Box sx={{
                p: 1.8,
                borderRadius: 3,
                border: badge.active ? '1px solid rgba(179, 136, 255, 0.35)' : '1px solid rgba(255,255,255,0.06)',
                bgcolor: badge.active ? 'rgba(179, 136, 255, 0.08)' : 'rgba(0,0,0,0.3)',
                textAlign: 'center',
                opacity: badge.active ? 1 : 0.45,
                transition: 'all 0.25s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {badge.active && (
                  <Box sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#48c78e',
                    boxShadow: '0 0 6px #48c78e'
                  }} />
                )}
                <Typography fontSize={32} sx={{
                  mb: 0.5,
                  filter: badge.active ? 'drop-shadow(0 0 8px rgba(179,136,255,0.5))' : 'grayscale(100%)'
                }}>
                  {badge.icon}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: badge.active ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.2 }}>
                  {badge.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', mt: 0.5, lineHeight: 1.2 }}>
                  {badge.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{
          background: 'linear-gradient(90deg, #7c4dff, #00b4d8)',
          color: '#fff',
          fontWeight: 800,
          borderRadius: 3,
          py: 1.2
        }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
