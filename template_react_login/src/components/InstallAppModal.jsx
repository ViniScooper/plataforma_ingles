import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GetAppIcon from '@mui/icons-material/GetApp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function InstallAppModal({ open, onClose, installPrompt, onPromptInstall }) {
  const [platform, setPlatform] = useState('android');

  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
      setPlatform('ios');
    } else {
      setPlatform('android');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, #0d1b2a, #070f19)',
          border: '1px solid rgba(0, 180, 216, 0.3)',
          borderRadius: 4,
          color: '#fff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0, 180, 216, 0.15)',
            color: '#00b4d8'
          }}>
            <GetAppIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
            Instalar Aplicativo
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mb: 2, fontSize: '0.82rem' }}>
          Tenha o <strong>Quest English</strong> direto na tela inicial do seu celular com carregamento instantâneo e tela cheia!
        </Typography>

        {/* Tabs to switch between Android and iOS */}
        <Tabs
          value={platform}
          onChange={(_, val) => setPlatform(val)}
          variant="fullWidth"
          sx={{
            mb: 2.5,
            minHeight: 40,
            bgcolor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 3,
            p: 0.5,
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          <Tab
            value="android"
            label="Android"
            icon={<AndroidIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{
              minHeight: 36,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.5)',
              bgcolor: platform === 'android' ? 'rgba(72, 199, 142, 0.2)' : 'transparent',
              '&.Mui-selected': {
                color: '#48c78e'
              }
            }}
          />
          <Tab
            value="ios"
            label="iPhone / iPad (iOS)"
            icon={<AppleIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            sx={{
              minHeight: 36,
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.5)',
              bgcolor: platform === 'ios' ? 'rgba(0, 180, 216, 0.2)' : 'transparent',
              '&.Mui-selected': {
                color: '#00b4d8'
              }
            }}
          />
        </Tabs>

        {/* ANDROID INSTRUCTIONS & DIRECT BUTTON */}
        {platform === 'android' && (
          <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
            {/* If native install prompt is available, show big direct button */}
            {installPrompt ? (
              <Box sx={{ mb: 2.5 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onPromptInstall}
                  startIcon={<AndroidIcon />}
                  sx={{
                    py: 1.4,
                    background: 'linear-gradient(135deg, #48c78e, #00b4d8)',
                    borderRadius: 3,
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(72, 199, 142, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3bb37c, #0096c7)'
                    }
                  }}
                >
                  Baixar e Instalar no Android
                </Button>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.45)', mt: 1 }}>
                  Toque acima para instalar o app oficial pelo navegador.
                </Typography>
              </Box>
            ) : null}

            {/* Manual steps (if prompt was already shown, or browser requires manual menu) */}
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: 3,
              p: 2
            }}>
              <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
                Instalação pelo Chrome / Samsung Internet:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(72, 199, 142, 0.15)',
                    color: '#48c78e',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>1</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                    Toque no menu de <strong>três pontinhos</strong> (<MoreVertIcon sx={{ fontSize: 16, verticalAlign: 'middle', color: '#48c78e' }} />) no canto superior direito do navegador.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(72, 199, 142, 0.15)',
                    color: '#48c78e',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>2</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                    Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(72, 199, 142, 0.15)',
                    color: '#48c78e',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>3</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                    Confirme em <strong>"Instalar"</strong>. O ícone do Quest English aparecerá na gaveta de apps!
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* IOS INSTRUCTIONS */}
        {platform === 'ios' && (
          <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
            <Box sx={{
              bgcolor: 'rgba(0, 180, 216, 0.08)',
              border: '1px solid rgba(0, 180, 216, 0.25)',
              borderRadius: 3,
              p: 2,
              mb: 2
            }}>
              <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.2 }}>
                Instruções no Safari do iPhone / iPad:
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(0, 180, 216, 0.2)',
                    color: '#00b4d8',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>1</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)' }}>
                    No navegador <strong>Safari</strong>, toque no botão <strong>Compartilhar</strong> (<IosShareIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#00b4d8', mx: 0.3 }} />) na barra inferior.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(0, 180, 216, 0.2)',
                    color: '#00b4d8',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>2</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)' }}>
                    Role para baixo no menu e toque em <strong>"Adicionar à Tela de Início"</strong> (<AddBoxOutlinedIcon sx={{ fontSize: 18, verticalAlign: 'middle', color: '#00b4d8', mx: 0.3 }} />).
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(0, 180, 216, 0.2)',
                    color: '#00b4d8',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}>3</Box>
                  <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)' }}>
                    Toque em <strong>"Adicionar"</strong> no canto superior direito.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 2.5,
              p: 1.2
            }}>
              <CheckCircleOutlineIcon sx={{ color: '#48c78e', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>
                O app abrirá em tela cheia direto da sua tela de início sem barra de navegação!
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255,255,255,0.6)',
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            '&:hover': {
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.06)'
            }
          }}
        >
          Entendido / Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
