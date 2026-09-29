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
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function PdfViewerModal({ open, onClose, lesson }) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!lesson || !lesson.pdfDocument) return null;
  const pdf = lesson.pdfDocument;

  const handleZoomIn = () => {
    if (zoomLevel < 140) setZoomLevel(prev => prev + 10);
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
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          bgcolor: '#0f172a',
          color: '#f8fafc',
          borderRadius: { xs: 2, sm: 4 },
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Top PDF Controls Toolbar */}
      <DialogTitle
        sx={{
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              bgcolor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}
          >
            <MenuBookIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              {pdf.title}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Leitor Oficial In-App · {pdf.version || 'Material Didático'}
            </Typography>
          </Box>
        </Box>

        {/* Toolbar action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, px: 1 }}>
            <Tooltip title="Diminuir Zoom">
              <IconButton size="small" onClick={handleZoomOut} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ px: 1, fontWeight: 700, color: '#38bdf8' }}>
              {zoomLevel}%
            </Typography>
            <Tooltip title="Aumentar Zoom">
              <IconButton size="small" onClick={handleZoomIn} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Imprimir / Salvar como PDF">
            <IconButton size="small" onClick={handlePrint} sx={{ color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.06)' }}>
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* PDF Document Render Container (Paper Document Style) */}
      <DialogContent
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: '#0a0f1d',
          overflowY: 'auto'
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: 780,
            mx: 'auto',
            p: { xs: 2.5, sm: 5 },
            bgcolor: '#ffffff',
            color: '#1e293b',
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {/* Header of the sheet */}
          <Box sx={{ borderBottom: '2px solid #0284c7', pb: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src="/quest_english_logo.svg" alt="Quest English" style={{ height: 32 }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0369a1', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Quest English Academy
                </Typography>
              </Box>
              <Chip
                label="Material da Aula das 16:30"
                size="small"
                sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 800, fontSize: '0.72rem' }}
              />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 1, letterSpacing: -0.5 }}>
              {pdf.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              {pdf.subtitle} · Instrutor: {lesson.teacher}
            </Typography>
          </Box>

          {/* Sections */}
          {pdf.sections.map((section) => (
            <Box key={section.id} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.5,
                  fontSize: '1.15rem'
                }}
              >
                {section.title}
              </Typography>

              {section.type === 'theory' && (
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {section.content}
                </Typography>
              )}

              {section.type === 'rule' && (
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderRadius: 2.5,
                    border: '1px solid #e2e8f0',
                    borderLeft: '5px solid #0284c7',
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={section.badge}
                      size="small"
                      sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0284c7' }}>
                      Estrutura Padrão
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px dashed #cbd5e1', my: 1.5 }}>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      📐 {section.formula}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6 }}>
                    {section.explanation}
                  </Typography>

                  {section.note && (
                    <Box sx={{ p: 1.5, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#b45309', fontWeight: 600, fontSize: '0.85rem' }}>
                        {section.note}
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                    Exemplos Práticos:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {section.examples.map((ex, idx) => (
                      <Box key={idx} sx={{ p: 1.2, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>
                          🇬🇧 "{ex.en}"
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic', display: 'block', mt: 0.3 }}>
                          🇧🇷 {ex.pt}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {section.type === 'cards' && section.techniques && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 1.5 }}>
                  {section.techniques.map((tech, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        bgcolor: '#f0fdf4',
                        borderRadius: 2.5,
                        border: '1px solid #bbf7d0',
                        borderLeft: '5px solid #16a34a'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography fontSize={20}>{tech.icon}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                          {tech.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.6 }}>
                        {tech.desc}
                      </Typography>
                      {tech.tip && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px dashed #86efac' }}>
                          <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600 }}>
                            💡 <strong>Dica de ouro:</strong> {tech.tip}
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
                    p: 3,
                    bgcolor: '#faf5ff',
                    borderRadius: 3,
                    border: '1px solid #e9d5ff',
                    borderLeft: '5px solid #9333ea'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#6b21a8', mb: 1 }}>
                    📖 {section.textTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#374151',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.8,
                      fontSize: '0.95rem'
                    }}
                  >
                    {section.textContent}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

          {/* Footer note inside the sheet */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              Quest English Academy · Todos os direitos reservados
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#16a34a' }}>
              <VerifiedIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Material Validado Pedagogicamente
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button onClick={handlePrint} startIcon={<PrintIcon />} sx={{ color: '#38bdf8', fontWeight: 700 }}>
          Imprimir / Baixar
        </Button>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#0284c7', color: '#fff', fontWeight: 700, borderRadius: 2 }}>
          Fechar Leitor
        </Button>
      </DialogActions>
    </Dialog>
  );
}
