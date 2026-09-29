// src/components/Student/LessonSlidesModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function LessonSlidesModal({ open, onClose, lesson }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = lesson?.slides || [];
  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const teacherName = lesson?.teacher || 'Prof. Vinicius Lourenço';

  // Reset to first slide whenever modal opens
  useEffect(() => {
    if (open) {
      setCurrentSlideIndex(0);
    }
  }, [open]);

  // Keyboard navigation (ArrowLeft and ArrowRight)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentSlideIndex, totalSlides]);

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  if (!open || totalSlides === 0) return null;

  const progressPercent = Math.round(((currentSlideIndex + 1) / totalSlides) * 100);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#070f1e',
          color: '#ffffff',
          width: { xs: '98vw', md: '92vw' },
          maxWidth: '1280px',
          height: { xs: '96vh', md: '90vh' },
          maxHeight: '96vh',
          m: { xs: 0.5, sm: 2 },
          borderRadius: { xs: 2.5, sm: 4.5 },
          border: '1.5px solid rgba(0, 180, 216, 0.35)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header com indicador de progresso */}
      <DialogTitle
        sx={{
          py: 1.5,
          px: { xs: 2, sm: 3 },
          bgcolor: '#0d1b2a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              bgcolor: 'rgba(0, 180, 216, 0.18)',
              border: '1px solid rgba(0, 180, 216, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00b4d8'
            }}
          >
            <SlideshowIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
              Apresentação da Aula das 16:30
            </Typography>
            <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700 }}>
              {teacherName} · 10 Slides Interativos (Nível A2)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={`Slide ${currentSlideIndex + 1} de ${totalSlides}`}
            size="small"
            sx={{
              bgcolor: 'rgba(0, 180, 216, 0.18)',
              color: '#38bdf8',
              border: '1px solid rgba(0, 180, 216, 0.4)',
              fontWeight: 900,
              fontSize: '0.78rem'
            }}
          />

          <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Barra de Progresso do Slide */}
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 4,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #00b4d8, #48c78e)'
          }
        }}
      />

      {/* Área Central do Slide (Tela do Projetor) */}
      <DialogContent
        sx={{
          p: { xs: 2, sm: 4, md: 5 },
          bgcolor: '#070b14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto'
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 1000,
            minHeight: { xs: 'auto', md: 460 },
            p: { xs: 3, sm: 5, md: 6 },
            bgcolor: '#0e1e32',
            color: '#f8fafc',
            borderRadius: { xs: 3, sm: 5 },
            border: `2px solid ${currentSlide.color || '#00b4d8'}`,
            boxShadow: `0 15px 50px rgba(0, 0, 0, 0.8), 0 0 30px ${currentSlide.color || '#00b4d8'}25`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Tag & Slide Number */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label={currentSlide.tag || `Slide ${currentSlideIndex + 1}`}
              size="small"
              sx={{
                bgcolor: `${currentSlide.color || '#00b4d8'}25`,
                color: currentSlide.color || '#38bdf8',
                border: `1px solid ${currentSlide.color || '#00b4d8'}50`,
                fontWeight: 900,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 700 }}>
              Use as setas ⬅️ ➡️ do teclado para navegar
            </Typography>
          </Box>

          {/* Título e Subtítulo */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#ffffff',
                mb: 1,
                fontSize: { xs: '1.35rem', sm: '1.85rem', md: '2.1rem' },
                letterSpacing: -0.5,
                lineHeight: 1.2
              }}
            >
              {currentSlide.title}
            </Typography>
            {currentSlide.subtitle && (
              <Typography variant="subtitle1" sx={{ color: '#94a3b8', fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                {currentSlide.subtitle}
              </Typography>
            )}
          </Box>

          {/* Fórmula se existir */}
          {currentSlide.formula && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: 'rgba(0, 0, 0, 0.35)',
                borderRadius: 3,
                border: '1.5px dashed rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <Typography fontSize={24}>📐</Typography>
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  color: '#38bdf8',
                  fontSize: { xs: '0.95rem', sm: '1.15rem' }
                }}
              >
                {currentSlide.formula}
              </Typography>
            </Box>
          )}

          {/* Lista de Bullets */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.6, mb: 3 }}>
            {currentSlide.bullets?.map((bullet, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: currentSlide.color || '#00b4d8', fontSize: 20, mt: 0.3, flexShrink: 0 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.65,
                    fontSize: { xs: '0.95rem', sm: '1.05rem' }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: bullet.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff;">$1</strong>')
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Dica de Destaque no Rodapé do Slide */}
          {currentSlide.highlight && (
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2.5,
                bgcolor: 'rgba(0, 180, 216, 0.1)',
                border: '1px solid rgba(0, 180, 216, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2
              }}
            >
              <Typography fontSize={20}>💡</Typography>
              <Typography variant="body2" sx={{ color: '#e0f2fe', fontWeight: 600, fontSize: '0.92rem' }}>
                {currentSlide.highlight}
              </Typography>
            </Box>
          )}
        </Paper>
      </DialogContent>

      {/* Barra de Navegação Inferior (Anterior, Próximo e Pílulas de Seleção Direta) */}
      <DialogActions
        sx={{
          py: 2,
          px: { xs: 2, sm: 4 },
          bgcolor: '#0d1b2a',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Button
          variant="outlined"
          disabled={currentSlideIndex === 0}
          onClick={handlePrev}
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 2.5,
            fontWeight: 800,
            textTransform: 'none',
            px: 2.5,
            '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0, 180, 216, 0.1)' }
          }}
        >
          Anterior
        </Button>

        {/* Pílulas de slides (1, 2, 3 ... 10) */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.8, alignItems: 'center' }}>
          {slides.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              sx={{
                width: currentSlideIndex === idx ? 28 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: currentSlideIndex === idx ? '#00b4d8' : 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                '&:hover': { bgcolor: 'rgba(0, 180, 216, 0.6)' }
              }}
            />
          ))}
        </Box>

        {currentSlideIndex < totalSlides - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            sx={{
              bgcolor: '#00b4d8',
              color: '#fff',
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 15px rgba(0, 180, 216, 0.4)',
              '&:hover': { bgcolor: '#0096c7' }
            }}
          >
            Próximo Slide
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: '#48c78e',
              color: '#fff',
              borderRadius: 2.5,
              fontWeight: 900,
              textTransform: 'none',
              px: 3.5,
              boxShadow: '0 4px 15px rgba(72, 199, 142, 0.4)',
              '&:hover': { bgcolor: '#36b37e' }
            }}
          >
            Concluir Apresentação 🎉
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
