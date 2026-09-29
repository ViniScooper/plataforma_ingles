import React, { useState, Fragment } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { LIBRARY_BOOKS } from '../../data/librarySlidesData';

export default function SlideLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeBook, setActiveBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readBooks, setReadBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('student_library_read_books');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const categories = ['Todas', 'Gramática', 'Vocabulário', 'Conversação & Escrita'];

  const filteredBooks = LIBRARY_BOOKS.filter(book => {
    const matchCategory = selectedCategory === 'Todas' || book.category === selectedCategory;
    const matchSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleOpenBook = (book) => {
    setActiveBook(book);
    setCurrentPage(0);
  };

  const handleCloseBook = () => {
    setActiveBook(null);
    setCurrentPage(0);
  };

  const handleMarkAsRead = (bookId) => {
    if (!readBooks.includes(bookId)) {
      const updated = [...readBooks, bookId];
      setReadBooks(updated);
      try {
        localStorage.setItem('student_library_read_books', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Helper text formatter for slides markdown
  const renderFormattedText = (text) => {
    if (!text) return '';

    // Check for tables
    if (text.includes('|') && text.includes('---')) {
      const lines = text.trim().split('\n').filter(l => l.includes('|'));
      if (lines.length >= 2) {
        const headers = lines[0].split('|').map(s => s.trim()).filter(Boolean);
        const rows = lines.slice(2).map(line => line.split('|').map(s => s.trim()).filter(Boolean));

        return (
          <Box sx={{ overflowX: 'auto', my: 2 }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <Box component="th" key={i} sx={{ borderBottom: '2px solid rgba(0, 180, 216, 0.4)', p: 1.2, color: '#00b4d8', fontWeight: 900 }}>
                      {h}
                    </Box>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    {row.map((cell, cIdx) => (
                      <Box component="td" key={cIdx} sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)', p: 1.2, color: '#cbd5e1' }}>
                        {renderFormattedText(cell)}
                      </Box>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        );
      }
    }

    const boldChunks = text.split('**');
    return boldChunks.map((boldChunk, bIdx) => {
      const isBold = bIdx % 2 === 1;
      const italicChunks = boldChunk.split('*');
      const renderedItalics = italicChunks.map((italicChunk, iIdx) => {
        const isItalic = iIdx % 2 === 1;
        if (isItalic) {
          return <em key={iIdx} style={{ color: '#b388ff', fontStyle: 'italic', fontWeight: 600 }}>{italicChunk}</em>;
        }
        return italicChunk;
      });

      if (isBold) {
        return <strong key={bIdx} style={{ color: '#fff', fontWeight: 800 }}>{renderedItalics}</strong>;
      }
      return <Fragment key={bIdx}>{renderedItalics}</Fragment>;
    });
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease', pb: 8 }}>
      {/* Header Banner */}
      <Box sx={{
        mb: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 5,
        background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.9) 0%, rgba(30, 27, 75, 0.6) 100%)',
        border: '1px solid rgba(179, 136, 255, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 3
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Typography fontSize={32}>📚</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              Biblioteca de Slides & Resumos
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '750px', lineHeight: 1.6 }}>
            Sua estante virtual de estudos. Acesse os slides interativos de <strong>10 páginas</strong> organizados por tema para estudar para provas, revisar regras gramaticais e expandir seu vocabulário quando quiser!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Chip
            icon={<BookmarkIcon sx={{ color: '#b388ff !important' }} />}
            label={`${readBooks.length} de ${LIBRARY_BOOKS.length} lidos`}
            sx={{
              bgcolor: 'rgba(179, 136, 255, 0.12)',
              border: '1px solid rgba(179, 136, 255, 0.3)',
              color: '#b388ff',
              fontWeight: 800,
              px: 1,
              py: 2.2
            }}
          />
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        mb: 4
      }}>
        {/* Category Pills */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: { xs: 1, sm: 0 } }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <Button
                key={cat}
                size="small"
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  borderRadius: 3.5,
                  px: 2.2,
                  py: 0.8,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  bgcolor: isSelected ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.6)',
                  border: `1.5px solid ${isSelected ? 'rgba(0, 180, 216, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  '&:hover': {
                    bgcolor: isSelected ? 'rgba(0, 180, 216, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(0, 180, 216, 0.4)'
                  }
                }}
              >
                {cat}
              </Button>
            );
          })}
        </Box>

        {/* Search input */}
        <TextField
          size="small"
          placeholder="Buscar tema, regra ou palavra-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            minWidth: { xs: '100%', sm: 280 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'rgba(13, 27, 42, 0.6)',
              color: '#fff',
              fontSize: '0.88rem',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '&:hover fieldset': { borderColor: 'rgba(0, 180, 216, 0.4)' },
              '&.Mui-focused fieldset': { borderColor: '#00b4d8' }
            }
          }}
        />
      </Box>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <Card sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: 'rgba(13, 27, 42, 0.4)',
          border: '1px dashed rgba(255, 255, 255, 0.15)'
        }}>
          <Typography fontSize={48} sx={{ mb: 1 }}>🔍</Typography>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>Nenhum material encontrado</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
            Tente buscar com outros termos ou limpe o filtro de categoria.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredBooks.map((book) => {
            const isRead = readBooks.includes(book.id);

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={book.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  bgcolor: 'rgba(13, 27, 42, 0.55)',
                  border: `1.5px solid ${isRead ? 'rgba(72, 199, 142, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: book.color,
                    boxShadow: `0 12px 32px ${book.color}25`
                  }
                }}>
                  {/* Book Top Header Banner */}
                  <Box sx={{
                    p: 2.5,
                    background: book.gradient,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        bgcolor: 'rgba(0, 0, 0, 0.35)',
                        border: `1.5px solid ${book.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22
                      }}>
                        {book.icon}
                      </Box>
                      <Box>
                        <Chip
                          size="small"
                          label={book.category}
                          sx={{
                            height: 20,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            bgcolor: `${book.color}20`,
                            color: book.color,
                            border: `1px solid ${book.color}40`,
                            mb: 0.5
                          }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                          {book.level}
                        </Typography>
                      </Box>
                    </Box>

                    {isRead ? (
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#48c78e !important' }} />}
                        label="Lido"
                        sx={{ bgcolor: 'rgba(72, 199, 142, 0.15)', color: '#48c78e', fontWeight: 800, fontSize: '0.72rem' }}
                      />
                    ) : (
                      <Chip
                        size="small"
                        icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#ffd426 !important' }} />}
                        label="Novo"
                        sx={{ bgcolor: 'rgba(255, 212, 38, 0.12)', color: '#ffd426', fontWeight: 800, fontSize: '0.72rem' }}
                      />
                    )}
                  </Box>

                  {/* Book Body */}
                  <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff', mb: 0.8, lineHeight: 1.3 }}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.65)', mb: 2, fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {book.subtitle}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.45)', mb: 2.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {book.description}
                    </Typography>

                    {/* Metadata Footer */}
                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700 }}>
                          <MenuBookIcon sx={{ fontSize: 16, color: book.color }} />
                          {book.totalPages} Slides
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700 }}>
                          <AccessTimeIcon sx={{ fontSize: 16 }} />
                          {book.readTime}
                        </Box>
                      </Box>
                    </Box>

                    {/* Open Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleOpenBook(book)}
                      sx={{
                        mt: 2,
                        py: 1.2,
                        borderRadius: 3,
                        fontWeight: 900,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        background: `linear-gradient(90deg, ${book.color}, #7c4dff)`,
                        color: '#fff',
                        boxShadow: `0 4px 16px ${book.color}35`,
                        '&:hover': {
                          background: `linear-gradient(90deg, ${book.color}, #9c27b0)`,
                          boxShadow: `0 6px 20px ${book.color}50`,
                          transform: 'translateY(-1px)'
                        }
                      }}
                      startIcon={<MenuBookIcon />}
                    >
                      📖 Abrir Slides (10 Páginas)
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Slide Reader Modal Dialog */}
      {activeBook && (
        <Dialog
          open={Boolean(activeBook)}
          onClose={handleCloseBook}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: 'rgba(10, 20, 35, 0.96)',
              backdropFilter: 'blur(24px)',
              border: `2px solid ${activeBook.color}50`,
              borderRadius: 5,
              color: '#fff',
              boxShadow: `0 0 40px ${activeBook.color}25`,
              overflow: 'hidden'
            }
          }}
        >
          {(() => {
            const rawParts = activeBook.content.split('###').map(p => p.trim()).filter(Boolean);
            const totalPages = rawParts.length || 1;
            const currentPageRaw = rawParts[currentPage] || '';
            const pageLines = currentPageRaw.split('\n');
            const pageTitle = pageLines[0] || 'Slide';
            const pageContentText = pageLines.slice(1).join('\n');
            const paragraphs = pageContentText.split('\n\n').map(p => p.trim()).filter(Boolean);

            return (
              <>
                {/* Dialog Header */}
                <DialogTitle sx={{ p: 3, pb: 1.5, background: 'rgba(0, 0, 0, 0.25)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ pr: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography fontSize={20}>{activeBook.icon}</Typography>
                        <Typography variant="caption" sx={{ color: activeBook.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          {activeBook.category} • {activeBook.title}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 950, color: '#fff', lineHeight: 1.2 }}>
                        {pageTitle}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={handleCloseBook}
                      sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Top Progress Bar & Counter */}
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                        Progresso de Leitura
                      </Typography>
                      <Chip
                        size="small"
                        label={`Página ${currentPage + 1} de ${totalPages}`}
                        sx={{
                          bgcolor: `${activeBook.color}20`,
                          color: activeBook.color,
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          border: `1px solid ${activeBook.color}40`
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((currentPage + 1) / totalPages) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${activeBook.color}, #7c4dff)`,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>

                  {/* Dot step shortcuts */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.8, mt: 1.5 }}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setCurrentPage(idx)}
                        sx={{
                          width: idx === currentPage ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: idx === currentPage ? activeBook.color : idx < currentPage ? '#48c78e' : 'rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { bgcolor: activeBook.color }
                        }}
                        title={`Ir para Página ${idx + 1}`}
                      />
                    ))}
                  </Box>
                </DialogTitle>

                {/* Dialog Content */}
                <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', p: { xs: 2.5, sm: 4 }, minHeight: '360px', maxHeight: '60vh' }}>
                  <Box sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${activeBook.color}25`,
                    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.4)'
                  }}>
                    {paragraphs.map((para, pIdx) => {
                      if (para.includes('*') && !para.includes('|')) {
                        const lines = para.split('\n');
                        const isList = lines.some(l => l.trim().startsWith('*'));
                        if (isList) {
                          return (
                            <Box component="ul" key={pIdx} sx={{ mb: 2.5, pl: 3 }}>
                              {lines.map((li, lIdx) => {
                                const cleanLi = li.replace(/^\*\s*/, '').trim();
                                return (
                                  <Box component="li" key={lIdx} sx={{ mb: 1, color: '#cbd5e1', lineHeight: 1.7 }}>
                                    {renderFormattedText(cleanLi)}
                                  </Box>
                                );
                              })}
                            </Box>
                          );
                        }
                      }

                      return (
                        <Typography key={pIdx} variant="body1" sx={{ mb: 2.2, color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.98rem' }}>
                          {renderFormattedText(para)}
                        </Typography>
                      );
                    })}
                  </Box>
                </DialogContent>

                {/* Dialog Footer Actions */}
                <DialogActions sx={{ p: 2.5, px: 3, background: 'rgba(0, 0, 0, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      textTransform: 'none',
                      px: 2.5,
                      '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' }
                    }}
                    startIcon={<ArrowBackIcon />}
                  >
                    Anterior
                  </Button>

                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>
                    {currentPage + 1} / {totalPages}
                  </Typography>

                  {currentPage < totalPages - 1 ? (
                    <Button
                      variant="contained"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 900,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        background: `linear-gradient(90deg, ${activeBook.color}, #7c4dff)`,
                        color: '#fff',
                        boxShadow: `0 4px 14px ${activeBook.color}35`,
                        '&:hover': { background: `linear-gradient(90deg, ${activeBook.color}, #9c27b0)` }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Próxima Página
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleMarkAsRead(activeBook.id);
                        handleCloseBook();
                      }}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 900,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        bgcolor: '#48c78e',
                        color: '#071018',
                        boxShadow: '0 4px 14px rgba(72, 199, 142, 0.4)',
                        '&:hover': { bgcolor: '#36b37e' }
                      }}
                      startIcon={<CheckCircleIcon />}
                    >
                      Concluir Leitura
                    </Button>
                  )}
                </DialogActions>
              </>
            );
          })()}
        </Dialog>
      )}
    </Box>
  );
}
