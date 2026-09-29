// src/components/Student/ClassroomHub.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  Radio,
  RadioGroup,
  FormControl,
  LinearProgress,
  Divider,
  Tooltip
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ReplayIcon from '@mui/icons-material/Replay';
import PrintIcon from '@mui/icons-material/Print';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SlideshowIcon from '@mui/icons-material/Slideshow';

import { CLASSROOM_LESSONS, getTodayDateString, getFormattedDate } from '../../data/classroomsData';
import PdfViewerModal from './PdfViewerModal';
import LessonSlidesModal from './LessonSlidesModal';

export default function ClassroomHub({ user, attendanceRecords = [], onRewardEarned }) {
  const [selectedLessonId, setSelectedLessonId] = useState(CLASSROOM_LESSONS[0]?.id || 'lesson_today_1630');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [slidesModalOpen, setSlidesModalOpen] = useState(false);
  
  // Selected answers for each activity: { [activityId]: chosenOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Submitted answers for each activity: { [activityId]: { isSubmitted: true, isCorrect: true/false, chosenIndex: number } }
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const storageKey = user?.id ? `classroom_answers_v2_${user.id}` : 'classroom_answers_v2_guest';

  // Load saved answers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSubmittedAnswers(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error loading classroom activity answers:', e);
    }
  }, [storageKey]);

  // Current active lesson
  const currentLesson = CLASSROOM_LESSONS.find(l => l.id === selectedLessonId) || CLASSROOM_LESSONS[0];
  const teacherName = currentLesson?.teacher || 'Prof. Vinicius Lourenço';

  // Activities completion stats
  const totalActivities = currentLesson?.activities?.length || 0;
  const completedActivitiesCount = currentLesson?.activities?.filter(
    a => submittedAnswers[a.id]?.isSubmitted && submittedAnswers[a.id]?.isCorrect
  ).length || 0;
  const progressPercent = totalActivities > 0 ? Math.round((completedActivitiesCount / totalActivities) * 100) : 0;

  const handleSelectOption = (actId, optIndex) => {
    if (submittedAnswers[actId]?.isSubmitted) return; // Locked once answered until retry
    setSelectedAnswers(prev => ({ ...prev, [actId]: Number(optIndex) }));
  };

  const handleSubmitAnswer = (act) => {
    const chosenIndex = selectedAnswers[act.id];
    if (chosenIndex === undefined || chosenIndex === null) return;

    const isCorrect = Number(chosenIndex) === Number(act.correctIndex);
    const newSubmissions = {
      ...submittedAnswers,
      [act.id]: {
        isSubmitted: true,
        isCorrect,
        chosenIndex: Number(chosenIndex),
        answeredAt: new Date().toISOString()
      }
    };

    setSubmittedAnswers(newSubmissions);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSubmissions));
    } catch (e) {
      console.warn('Error saving answer to localStorage:', e);
    }

    if (isCorrect && onRewardEarned) {
      onRewardEarned({ xp: act.xp, coins: act.coins });
    }
  };

  const handleRetryQuestion = (actId) => {
    const updated = { ...submittedAnswers };
    delete updated[actId];
    setSubmittedAnswers(updated);

    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[actId];
      return copy;
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error updating answers in localStorage:', e);
    }
  };

  const handleResetAllQuestions = () => {
    if (window.confirm('Deseja reiniciar todas as atividades desta aula para fazer de novo?')) {
      setSubmittedAnswers({});
      setSelectedAnswers({});
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn('Error removing answers from localStorage:', e);
      }
    }
  };

  const handlePrintExercises = () => {
    window.print();
  };

  return (
    <>
      {/* Estilos específicos para impressão apenas da folha de exercícios */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-exercise-sheet, #printable-exercise-sheet * {
            visibility: visible !important;
          }
          #printable-exercise-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 30px !important;
            display: block !important;
            font-family: 'Arial', sans-serif !important;
          }
        }
      `}</style>

      <Box sx={{ animation: 'fadeIn 0.5s ease', width: '100%', pb: 8 }}>
        {/* Top Header */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
                📚 Central de Aulas & Conteúdos
              </Typography>
              <Chip
                label="Ao Vivo 16:30"
                size="small"
                sx={{
                  bgcolor: 'rgba(239, 68, 68, 0.18)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  fontWeight: 900,
                  fontSize: '0.72rem'
                }}
              />
              <Chip
                icon={<SchoolIcon sx={{ fontSize: 16 }} />}
                label={teacherName}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 180, 216, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(0, 180, 216, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Aulas planejadas pelo <strong>{teacherName}</strong> com revisão do Present Simple, Conditionals passo a passo e leitura simplificada (Nível A2).
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrintExercises}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0, 180, 216, 0.08)' }
              }}
            >
              🖨️ Imprimir Exercícios
            </Button>

            <Button
              variant="contained"
              startIcon={<SlideshowIcon />}
              onClick={() => setSlidesModalOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #7209b7 0%, #4361ee 100%)',
                color: '#fff',
                fontWeight: 800,
                px: 2.5,
                py: 1.2,
                borderRadius: 2.5,
                boxShadow: '0 8px 24px rgba(114, 9, 183, 0.35)',
                textTransform: 'none',
                fontSize: '0.92rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #b5179e 0%, #4895ef 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              📽️ Slides da Aula (10 Páginas)
            </Button>

            <Button
              variant="contained"
              startIcon={<MenuBookIcon />}
              onClick={() => setPdfModalOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
                color: '#fff',
                fontWeight: 800,
                px: 3,
                py: 1.2,
                borderRadius: 2.5,
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.35)',
                textTransform: 'none',
                fontSize: '0.92rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #48cae4 0%, #023e8a 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              📖 Abrir Apostila em PDF (Tela Cheia)
            </Button>
          </Box>
        </Box>

        {/* Date Navigation Timeline */}
        <Card
          sx={{
            p: { xs: 2, sm: 2.5 },
            mb: 4,
            background: 'rgba(13, 27, 42, 0.45)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon sx={{ color: '#00b4d8', fontSize: 22 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.78rem' }}>
                Cronograma de Aulas & Calendário
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
              Clique em qualquer data para revisar o material estudado
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {CLASSROOM_LESSONS.map((lesson) => {
              const isSelected = lesson.id === selectedLessonId;
              const isToday = lesson.isToday;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson.id}>
                  <Box
                    onClick={() => setSelectedLessonId(lesson.id)}
                    sx={{
                      p: 2,
                      borderRadius: 3.5,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(13, 27, 42, 0.8) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: isSelected
                        ? '1.5px solid #00b4d8'
                        : '1px solid rgba(255,255,255,0.06)',
                      boxShadow: isSelected ? '0 8px 24px rgba(0, 180, 216, 0.2)' : 'none',
                      '&:hover': {
                        background: 'rgba(0, 180, 216, 0.12)',
                        border: '1px solid rgba(0, 180, 216, 0.4)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={isToday ? '🔥 HOJE · 16:30' : 'Concluída'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          bgcolor: isToday ? 'rgba(239, 68, 68, 0.2)' : 'rgba(72, 199, 142, 0.15)',
                          color: isToday ? '#ef4444' : '#48c78e',
                          border: isToday ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(72, 199, 142, 0.3)'
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>
                        ⏰ {lesson.time}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', mb: 0.5, lineHeight: 1.3 }}>
                      {lesson.title}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      📅 {getFormattedDate(lesson.date)}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Card>

        {/* Spotlight: Current Selected Class Banner (100% largura) */}
        <Card
          sx={{
            p: { xs: 2.5, sm: 4 },
            mb: 4,
            width: '100%',
            background: currentLesson.isToday
              ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(13, 27, 42, 0.9) 60%, rgba(114, 9, 183, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(72, 199, 142, 0.08) 0%, rgba(13, 27, 42, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 5,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 2 }}>
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                label={`Horário: ${currentLesson.time} (${currentLesson.duration})`}
                sx={{ bgcolor: 'rgba(0, 180, 216, 0.15)', color: '#38bdf8', fontWeight: 800, fontSize: '0.75rem' }}
              />
              <Chip
                icon={<SchoolIcon sx={{ fontSize: 16 }} />}
                label={currentLesson.level}
                sx={{ bgcolor: 'rgba(179, 136, 255, 0.15)', color: '#b388ff', fontWeight: 800, fontSize: '0.75rem' }}
              />
              <Chip
                label={`Instrutor: ${teacherName}`}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}
              />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mb: 1, letterSpacing: -0.5, fontSize: { xs: '1.4rem', sm: '1.85rem' } }}>
              {currentLesson.title}
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 3, maxWidth: 900, lineHeight: 1.6, fontSize: '0.98rem' }}>
              {currentLesson.summary}
            </Typography>

            {/* Cronograma Pills de Aprendizado */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 3 }}>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(0, 180, 216, 0.12)', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
                <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                  1️⃣ Cronograma 1: Revisão do Present Simple (Rotinas & He/She/It)
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(72, 199, 142, 0.12)', border: '1px solid rgba(72, 199, 142, 0.3)' }}>
                <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800 }}>
                  2️⃣ Zero & First Conditionals (Causa & Efeito com "If")
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(255, 183, 77, 0.12)', border: '1px solid rgba(255, 183, 77, 0.3)' }}>
                <Typography variant="caption" sx={{ color: '#ffb74d', fontWeight: 800 }}>
                  3️⃣ Second Conditional (Sonhos com Would e Dica "If I were you")
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(179, 136, 255, 0.12)', border: '1px solid rgba(179, 136, 255, 0.3)' }}>
                <Typography variant="caption" sx={{ color: '#b388ff', fontWeight: 800 }}>
                  4️⃣ Leitura Fácil: Lucas & Sparky (Skimming & Scanning)
                </Typography>
              </Box>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<SlideshowIcon />}
                onClick={() => setSlidesModalOpen(true)}
                sx={{
                  bgcolor: '#7209b7',
                  color: '#fff',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(114, 9, 183, 0.4)',
                  '&:hover': { bgcolor: '#560bad' }
                }}
              >
                📽️ Slides da Aula (10 Páginas)
              </Button>

              <Button
                variant="contained"
                startIcon={<MenuBookIcon />}
                onClick={() => setPdfModalOpen(true)}
                sx={{
                  bgcolor: '#00b4d8',
                  color: '#fff',
                  fontWeight: 800,
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)',
                  '&:hover': { bgcolor: '#0096c7' }
                }}
              >
                📖 Abrir Apostila da Aula ({teacherName})
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                  Progresso das Atividades:
                </Typography>
                <Chip
                  label={`${completedActivitiesCount} / ${totalActivities} Feitas`}
                  size="small"
                  sx={{
                    bgcolor: completedActivitiesCount === totalActivities ? 'rgba(72,199,142,0.25)' : 'rgba(0,180,216,0.2)',
                    color: completedActivitiesCount === totalActivities ? '#48c78e' : '#38bdf8',
                    fontWeight: 900
                  }}
                />
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                mt: 2.5,
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: completedActivitiesCount === totalActivities ? '#48c78e' : '#00b4d8',
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </Card>

        {/* Activities Section - TELA TODA (Full Width) */}
        <Box sx={{ mb: 5, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AutoStoriesIcon sx={{ color: '#00b4d8', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                🎯 Exercícios Práticos da Aula (Nível A2)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ReplayIcon />}
                onClick={handleResetAllQuestions}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  '&:hover': { color: '#ffb74d', borderColor: '#ffb74d' }
                }}
              >
                Reiniciar Todas as Questões
              </Button>

              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                {totalActivities} Questões
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
            {currentLesson.activities?.map((act, index) => {
              const submission = submittedAnswers[act.id];
              const isSubmitted = submission?.isSubmitted;
              const isCorrect = submission?.isCorrect;
              const chosenIndex = isSubmitted ? submission.chosenIndex : selectedAnswers[act.id];

              return (
                <Grid size={{ xs: 12 }} key={act.id} sx={{ p: '0 !important', mb: 3 }}>
                  <Card
                    sx={{
                      p: { xs: 2.5, sm: 4 },
                      width: '100%',
                      background: isSubmitted
                        ? isCorrect
                          ? 'rgba(72, 199, 142, 0.08)'
                          : 'rgba(239, 68, 68, 0.08)'
                        : 'rgba(13, 27, 42, 0.55)',
                      border: isSubmitted
                        ? isCorrect
                          ? '1.5px solid rgba(72, 199, 142, 0.45)'
                          : '1.5px solid rgba(239, 68, 68, 0.45)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 4.5,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`Questão ${index + 1}`}
                          size="small"
                          sx={{ bgcolor: 'rgba(0, 180, 216, 0.2)', color: '#38bdf8', fontWeight: 900, fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={act.category}
                          size="small"
                          sx={{ bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#e2e8f0', fontWeight: 700, fontSize: '0.72rem' }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                          label={`+${act.xp} XP`}
                          size="small"
                          sx={{ bgcolor: 'rgba(179, 136, 255, 0.18)', color: '#b388ff', fontWeight: 800 }}
                        />
                        <Chip
                          label={`+${act.coins} 🪙`}
                          size="small"
                          sx={{ bgcolor: 'rgba(255, 183, 77, 0.18)', color: '#ffb74d', fontWeight: 800 }}
                        />
                        {isSubmitted && (
                          <Chip
                            icon={isCorrect ? <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> : <CancelOutlinedIcon sx={{ fontSize: 16 }} />}
                            label={isCorrect ? 'Você Acertou!' : 'Incorreto'}
                            size="small"
                            sx={{
                              bgcolor: isCorrect ? 'rgba(72, 199, 142, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                              color: isCorrect ? '#48c78e' : '#ef4444',
                              fontWeight: 900
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1.2, fontSize: '1.1rem' }}>
                      {act.title}
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '1rem' }}>
                      {act.question}
                    </Typography>

                    {/* Radio Options */}
                    <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                      <RadioGroup
                        value={chosenIndex !== undefined && chosenIndex !== null ? Number(chosenIndex) : ''}
                        onChange={(e) => handleSelectOption(act.id, Number(e.target.value))}
                      >
                        {act.options.map((opt, optIdx) => {
                          let optBg = 'rgba(255, 255, 255, 0.02)';
                          let optBorder = '1px solid rgba(255, 255, 255, 0.08)';

                          if (isSubmitted) {
                            if (optIdx === act.correctIndex) {
                              optBg = 'rgba(72, 199, 142, 0.22)';
                              optBorder = '2px solid #48c78e';
                            } else if (optIdx === chosenIndex && !isCorrect) {
                              optBg = 'rgba(239, 68, 68, 0.22)';
                              optBorder = '2px solid #ef4444';
                            }
                          } else if (chosenIndex === optIdx) {
                            optBg = 'rgba(0, 180, 216, 0.15)';
                            optBorder = '2px solid #00b4d8';
                          }

                          return (
                            <Box
                              key={optIdx}
                              onClick={() => !isSubmitted && handleSelectOption(act.id, optIdx)}
                              sx={{
                                p: 1.8,
                                mb: 1.5,
                                borderRadius: 3.5,
                                bgcolor: optBg,
                                border: optBorder,
                                cursor: isSubmitted ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s ease',
                                '&:hover': !isSubmitted ? { bgcolor: 'rgba(0, 180, 216, 0.1)', borderColor: 'rgba(0, 180, 216, 0.4)' } : {}
                              }}
                            >
                              <Radio
                                value={optIdx}
                                checked={chosenIndex === optIdx}
                                disabled={isSubmitted}
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  '&.Mui-checked': {
                                    color: isSubmitted ? (isCorrect ? '#48c78e' : '#ef4444') : '#00b4d8'
                                  }
                                }}
                              />
                              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, ml: 1.2, fontSize: '0.96rem' }}>
                                {opt}
                              </Typography>
                            </Box>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>

                    {/* Actions: Confirmar Resposta OU Tentar Novamente com Explicação */}
                    {!isSubmitted ? (
                      <Button
                        variant="contained"
                        disabled={chosenIndex === undefined || chosenIndex === null}
                        onClick={() => handleSubmitAnswer(act)}
                        sx={{
                          bgcolor: '#00b4d8',
                          color: '#fff',
                          fontWeight: 800,
                          borderRadius: 2.5,
                          px: 3.5,
                          py: 1.2,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          boxShadow: '0 4px 15px rgba(0, 180, 216, 0.35)',
                          '&:hover': { bgcolor: '#0096c7' }
                        }}
                      >
                        Confirmar Resposta
                      </Button>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: isCorrect ? 'rgba(72, 199, 142, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            border: isCorrect ? '1px solid rgba(72, 199, 142, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
                            mb: 2
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: isCorrect ? '#48c78e' : '#ef4444', mb: 0.5, fontSize: '0.98rem' }}>
                            {isCorrect ? '🎉 Resposta Correta!' : '💡 Explicação do Prof. Vinicius Lourenço:'}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, fontSize: '0.95rem' }}>
                            {act.explanation}
                          </Typography>
                        </Box>

                        {/* Botão de Tentar Novamente / Refazer Questão */}
                        <Button
                          variant="outlined"
                          startIcon={<ReplayIcon />}
                          onClick={() => handleRetryQuestion(act.id)}
                          sx={{
                            color: '#fff',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: 2.5,
                            fontWeight: 800,
                            textTransform: 'none',
                            px: 2.5,
                            py: 0.8,
                            '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0, 180, 216, 0.12)' }
                          }}
                        >
                          Tentar Novamente / Refazer Questão
                        </Button>
                      </Box>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Attendance Log Box (Registros do Professor) */}
        <Card
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            width: '100%',
            background: 'rgba(13, 27, 42, 0.35)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <HistoryEduIcon sx={{ color: '#b388ff', fontSize: 24 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff' }}>
              Frequências Oficiais Registradas pelo {teacherName}
            </Typography>
          </Box>

          {(!attendanceRecords || attendanceRecords.length === 0) ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography fontSize={40} sx={{ mb: 1 }}>📅</Typography>
              <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
                Sua frequência da aula das 16:30 será confirmada pelo {teacherName} na chamada.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {attendanceRecords.map((att) => (
                <Grid size={{ xs: 12, sm: 6 }} key={att.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: 'rgba(179, 136, 255, 0.06)',
                      border: '1px solid rgba(179, 136, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <EventAvailableIcon sx={{ color: '#b388ff', fontSize: 24 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                        {new Date(att.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                        Horário: {att.time} · Presença Confirmada pelo {teacherName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>

        {/* PDF In-App Reader Modal (Quase Tela Cheia) */}
        <PdfViewerModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          lesson={currentLesson}
        />

        {/* Modal de Apresentação de Slides (10 Páginas) */}
        <LessonSlidesModal
          open={slidesModalOpen}
          onClose={() => setSlidesModalOpen(false)}
          lesson={currentLesson}
        />
      </Box>

      {/* ÁREA EXCLUSIVA DE IMPRESSÃO (Mostra APENAS a folha de exercícios com Prof. Vinicius Lourenço) */}
      <div id="printable-exercise-sheet" style={{ display: 'none' }}>
        <div style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>QUEST ENGLISH ACADEMY</h2>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>NÍVEL INICIANTE (A2)</span>
          </div>
          <h3 style={{ margin: '6px 0 2px 0', fontSize: '17px' }}>Folha Oficial de Exercícios: Present Simple & Conditionals</h3>
          <div style={{ fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>
            <p style={{ margin: '2px 0' }}><strong>Professor:</strong> {teacherName}</p>
            <p style={{ margin: '2px 0' }}><strong>Horário da Aula:</strong> {currentLesson.time} ({currentLesson.duration})</p>
            <p style={{ margin: '2px 0' }}><strong>Data:</strong> {getFormattedDate(currentLesson.date)}</p>
            <p style={{ margin: '8px 0 2px 0' }}><strong>Nome do(a) Aluno(a):</strong> __________________________________________________</p>
          </div>
        </div>

        {/* Texto de Leitura de Apoio */}
        <div style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>📖 Texto de Apoio: Lucas and His Smart Pet</h4>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            Lucas is 14 years old and lives in a friendly small city. Every day, Lucas wakes up at 7:00 AM and studies English before breakfast.
            Lucas has a very special pet: a friendly robot dog named Sparky. Lucas created Sparky in 2024 for his school science project.
            If Lucas says "Sit", Sparky sits immediately. If Lucas throws a small ball, Sparky runs happily to catch it.
            Lucas loves technology and often says: "If I study hard today, I will become a computer engineer in the future. And if I had a spaceship, I would take Sparky to visit the stars!"
          </p>
        </div>

        {/* Lista de Exercícios para Preenchimento à Caneta */}
        <div>
          <h4 style={{ margin: '0 0 14px 0', fontSize: '16px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
            Atividades de Fixação (Assinale a alternativa correta):
          </h4>

          {currentLesson.activities?.map((act, index) => (
            <div key={act.id} style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {index + 1}. {act.title}
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px', whiteSpace: 'pre-line' }}>
                {act.question}
              </p>
              <div style={{ paddingLeft: '12px' }}>
                {act.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '1.5px solid #000', borderRadius: '3px', marginRight: '8px' }}></span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #ccc', marginTop: '30px', paddingTop: '10px', textAlign: 'center', fontSize: '12px', color: '#555' }}>
          Quest English · {teacherName} · Todos os direitos reservados
        </div>
      </div>
    </>
  );
}
