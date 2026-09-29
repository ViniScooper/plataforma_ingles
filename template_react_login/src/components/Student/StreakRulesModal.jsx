import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function StreakRulesModal({
  open,
  onClose,
  streak = 0,
  coins = 0
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #0d1b2a, #070f19)',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          borderRadius: 4,
          color: '#fff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontSize={24}>🎯</Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffd426' }}>
            Ofensiva & Moedas
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {/* Status Atual do Aluno */}
        <Box sx={{
          display: 'flex',
          gap: 1.5,
          mb: 2.5,
          p: 1.5,
          borderRadius: 3,
          background: 'rgba(255, 215, 0, 0.06)',
          border: '1px solid rgba(255, 215, 0, 0.15)'
        }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block' }}>
              Sua Ofensiva
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#ff8fa3', mt: 0.2 }}>
              🔥 {streak} {streak === 1 ? 'dia' : 'dias'}
            </Typography>
          </Box>
          <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block' }}>
              Suas Moedas
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffd426', mt: 0.2 }}>
              🪙 {coins}
            </Typography>
          </Box>
        </Box>

        {/* Regras Claras */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'rgba(255, 143, 163, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0
            }}>
              🔥
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                Ofensiva Diária (+2 Moedas)
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 0.3, lineHeight: 1.4 }}>
                Entre todos os dias e resolva atividades para acumular dias seguidos e ganhar <strong>+2 moedas de bônus</strong> diariamente!
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'rgba(255, 183, 77, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0
            }}>
              ⏳
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffb74d' }}>
                Inatividade (-1 Moeda)
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 0.3, lineHeight: 1.4 }}>
                Se você ficar <strong>7 dias seguidos sem acessar a plataforma</strong>, perderá 1 moeda por cada semana de ausência. Mantenha o hábito!
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{
          background: 'linear-gradient(90deg, #ffd426, #ffaa00)',
          color: '#070f19',
          fontWeight: 900,
          borderRadius: 3,
          py: 1.2
        }}>
          Entendi, continuar estudando!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
