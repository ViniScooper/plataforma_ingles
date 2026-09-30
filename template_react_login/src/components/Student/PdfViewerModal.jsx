// src/components/Student/PdfViewerModal.jsx
import React, { useState } from 'react';
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
  Divider,
  Paper,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import VerifiedIcon from '@mui/icons-material/Verified';
import SchoolIcon from '@mui/icons-material/School';

export default function PdfViewerModal({ open, onClose, lesson }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!lesson || !lesson.pdfDocument) return null;
  const pdf = lesson.pdfDocument;
  const teacherName = lesson.teacher || 'Prof. Vinicius Lourenço';

  const handleZoomIn = () => {
    if (zoomLevel < 130) setZoomLevel(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 80) setZoomLevel(prev => prev - 10);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          bgcolor: '#0a0f1d',
          color: '#f8fafc',
          width: isMobile ? '100vw' : { xs: '98vw', md: '94vw' },
          maxWidth: isMobile ? '100vw' : '1350px',
          height: isMobile ? '100dvh' : '92vh',
          maxHeight: isMobile ? '100dvh' : '96vh',
          m: isMobile ? 0 : { xs: 0.5, sm: 2 },
          borderRadius: isMobile ? 0 : { xs: 2.5, sm: 4 },
          border: isMobile ? 'none' : '1.5px solid rgba(0, 180, 216, 0.3)',
          boxShadow: isMobile ? 'none' : '0 30px 80px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
    >
      {/* Top PDF Controls Toolbar */}
      <DialogTitle
        sx={{
          py: { xs: 1.2, sm: 1.8 },
          px: { xs: 1.5, sm: 3 },
          bgcolor: '#0d1b2a',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: { xs: 34, sm: 42 },
              height: { xs: 34, sm: 42 },
              borderRadius: 2.5,
              bgcolor: 'rgba(0, 180, 216, 0.15)',
              border: '1px solid rgba(0, 180, 216, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00b4d8',
              flexShrink: 0
            }}
          >
            <MenuBookIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 900, 
              color: '#fff', 
              lineHeight: 1.2, 
              fontSize: { xs: '0.9rem', sm: '1.15rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {pdf.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.2 }}>
              <Typography variant="caption" sx={{ 
                color: '#38bdf8', 
                fontWeight: 800,
                fontSize: { xs: '0.68rem', sm: '0.78rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {teacherName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                · {pdf.version || 'Material'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Toolbar action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, px: { xs: 0.5, sm: 1 } }}>
            <Tooltip title="Diminuir Zoom">
              <IconButton size="small" onClick={handleZoomOut} sx={{ color: 'rgba(255,255,255,0.7)', p: { xs: 0.5, sm: 1 } }}>
                <ZoomOutIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ px: { xs: 0.5, sm: 1 }, fontWeight: 800, color: '#38bdf8', fontSize: { xs: '0.72rem', sm: '0.8rem' } }}>
              {zoomLevel}%
            </Typography>
            <Tooltip title="Aumentar Zoom">
              <IconButton size="small" onClick={handleZoomIn} sx={{ color: 'rgba(255,255,255,0.7)', p: { xs: 0.5, sm: 1 } }}>
                <ZoomInIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Button
            size="small"
            startIcon={<PrintIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            onClick={handlePrint}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 2,
              px: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
            }}
          >
            Imprimir
          </Button>

          <IconButton 
            size="small" 
            onClick={onClose} 
            sx={{ 
              color: 'rgba(255,255,255,0.7)', 
              bgcolor: 'rgba(255,255,255,0.06)', 
              p: { xs: 0.6, sm: 1 },
              '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } 
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* PDF Document Render Container (Quase tela cheia com estilo de papel e leitura confortável) */}
      <DialogContent
        sx={{
          p: { xs: 0.5, sm: 2.5, md: 4 },
          bgcolor: '#070b14',
          overflowY: 'auto',
          flex: 1
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 6}
          sx={{
            width: '100%',
            maxWidth: 1080,
            mx: 'auto',
            p: { xs: 1.8, sm: 4, md: 6 },
            bgcolor: '#ffffff',
            color: '#1e293b',
            borderRadius: isMobile ? 1.5 : { xs: 2, sm: 4 },
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            transform: zoomLevel === 100 ? 'none' : `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            fontFamily: "'Inter', sans-serif",
            wordBreak: 'break-word'
          }}
        >
          {/* Header of the sheet */}
          <Box sx={{ borderBottom: '3px solid #00b4d8', pb: { xs: 2, sm: 3 }, mb: { xs: 2.5, sm: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <img src="/quest_english_logo.svg" alt="Quest English" style={{ height: 36 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0077b6', letterSpacing: 0.5, textTransform: 'uppercase', lineHeight: 1.1 }}>
                    Quest English Academy
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Plataforma Oficial de Aprendizado de Inglês
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  icon={<SchoolIcon sx={{ fontSize: 16 }} />}
                  label={`Professor: ${teacherName}`}
                  sx={{ bgcolor: '#0077b6', color: '#fff', fontWeight: 800, fontSize: '0.78rem' }}
                />
                <Chip
                  label="Aula das 16:30 · Nível A2"
                  sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, fontSize: '0.75rem' }}
                />
              </Box>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mt: 1.5, letterSpacing: -0.5, fontSize: { xs: '1.4rem', sm: '1.85rem' } }}>
              {pdf.title}
            </Typography>
            <Typography variant="body1" sx={{ color: '#475569', mt: 0.5, fontSize: '0.95rem' }}>
              {pdf.subtitle} · <strong>Professor Responsável:</strong> {teacherName}
            </Typography>
          </Box>

          {/* Sections */}
          {pdf.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  mb: 1.8,
                  fontSize: { xs: '1.15rem', sm: '1.35rem' },
                  letterSpacing: -0.3
                }}
              >
                {section.title}
              </Typography>

              {section.type === 'theory' && (
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.75, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                  {section.content}
                </Typography>
              )}

              {section.type === 'rule' && (
                <Box
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    bgcolor: '#f8fafc',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    borderLeft: '6px solid #00b4d8',
                    mb: 2.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={section.badge}
                      size="small"
                      sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, fontSize: '0.78rem' }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Regra Prática
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, border: '1.5px dashed #cbd5e1', my: 2 }}>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
                      📐 {section.formula}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ color: '#334155', mb: 2, lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {section.explanation}
                  </Typography>

                  {section.note && (
                    <Box sx={{ p: 2, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 2, mb: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#b45309', fontWeight: 700, fontSize: '0.9rem' }}>
                        {section.note}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5, fontSize: '0.95rem' }}>
                    Exemplos Fáceis:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {section.examples.map((ex, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: '#0077b6' }}>
                          🇬🇧 "{ex.en}"
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', display: 'block', mt: 0.3 }}>
                          🇧🇷 {ex.pt}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {section.type === 'cards' && section.techniques && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                  {section.techniques.map((tech, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2.5,
                        bgcolor: '#f0fdf4',
                        borderRadius: 3,
                        border: '1px solid #bbf7d0',
                        borderLeft: '6px solid #16a34a'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.8 }}>
                        <Typography fontSize={24}>{tech.icon}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#166534', fontSize: '1.05rem' }}>
                          {tech.name}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6, fontSize: '0.95rem' }}>
                        {tech.desc}
                      </Typography>
                      {tech.tip && (
                        <Box sx={{ mt: 1.5, p: 1.2, bgcolor: '#ffffff', borderRadius: 2, border: '1px dashed #86efac' }}>
                          <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 700 }}>
                            💡 <strong>Dica do {teacherName}:</strong> {tech.tip}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {section.type === 'text_box' && (
                <Box
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    bgcolor: '#faf5ff',
                    borderRadius: 3.5,
                    border: '1px solid #e9d5ff',
                    borderLeft: '6px solid #9333ea',
                    my: 2
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#6b21a8', mb: 1.5 }}>
                    📖 {section.textTitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#374151',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.85,
                      fontSize: '1rem',
                      fontFamily: 'serif'
                    }}
                  >
                    {section.textContent}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

          {/* Footer note inside the sheet */}
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 800 }}>
                Quest English · Professor Vinicius Lourenço
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Material exclusivo para os alunos da turma das 16:30
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#16a34a' }}>
              <VerifiedIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 800 }}>
                Conteúdo Pedagógico Aprovado (Nível A2)
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ py: 2, px: 3, bgcolor: '#0d1b2a', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button onClick={handlePrint} startIcon={<PrintIcon />} sx={{ color: '#38bdf8', fontWeight: 800 }}>
          Imprimir Apostila
        </Button>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#00b4d8', color: '#fff', fontWeight: 800, borderRadius: 2.5, px: 3, '&:hover': { bgcolor: '#0096c7' } }}>
          Fechar Leitor
        </Button>
      </DialogActions>
    </Dialog>
  );
}
