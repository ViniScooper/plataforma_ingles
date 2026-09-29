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
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  Tooltip
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import { CLASSROOM_LESSONS, getTodayDateString, getFormattedDate } from '../../data/classroomsData';
import PdfViewerModal from './PdfViewerModal';

export default function ClassroomHub({ user, attendanceRecords = [], onRewardEarned }) {
  const [selectedLessonId, setSelectedLessonId] = useState(CLASSROOM_LESSONS[0]?.id || 'lesson_today_1630');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  
  // Selected answers for each activity: { [activityId]: chosenOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // Submitted answers for each activity: { [activityId]: { isSubmitted: true, isCorrect: true/false } }
  const [submittedAnswers, setSubmittedAnswers] = useState({});

  const storageKey = user?.id ? `classroom_answers_${user.id}` : 'classroom_answers_guest';

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

  // Activities completion stats
  const totalActivities = currentLesson?.activities?.length || 0;
  const completedActivitiesCount = currentLesson?.activities?.filter(
    a => submittedAnswers[a.id]?.isSubmitted && submittedAnswers[a.id]?.isCorrect
  ).length || 0;
  const progressPercent = totalActivities > 0 ? Math.round((completedActivitiesCount / totalActivities) * 100) : 0;

  const handleSelectOption = (actId, optIndex) => {
    if (submittedAnswers[actId]?.isSubmitted) return; // Locked once answered
    setSelectedAnswers(prev => ({ ...prev, [actId]: optIndex }));
  };

  const handleSubmitAnswer = (act) => {
    const chosenIndex = selectedAnswers[act.id];
    if (chosenIndex === undefined) return;

    const isCorrect = chosenIndex === act.correctIndex;
    const newSubmissions = {
      ...submittedAnswers,
      [act.id]: {
        isSubmitted: true,
        isCorrect,
        chosenIndex,
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

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease', width: '100%', pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              📚 Central de Aulas & Conteúdos
            </Typography>
            <Chip
              label="Ao Vivo 16:30"
              size="small"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 800,
                fontSize: '0.72rem'
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)' }}>
            Acesse o conteúdo da aula de hoje, leia a apostila em PDF e pratique as atividades dedicadas de cada dia.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<MenuBookIcon />}
          onClick={() => setPdfModalOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)',
            color: '#fff',
            fontWeight: 800,
            px: 3,
            py: 1.3,
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 180, 216, 0.35)',
            textTransform: 'none',
            fontSize: '0.92rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #48cae4 0%, #023e8a 100%)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          📖 Abrir Apostila em PDF (16:30)
        </Button>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonthIcon sx={{ color: '#00b4d8', fontSize: 22 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.78rem' }}>
            Cronograma de Aulas & Calendário
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {CLASSROOM_LESSONS.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isToday = lesson.isToday;

            return (
              <Grid size={{ xs: 12, sm: 4 }} key={lesson.id}>
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

      {/* Spotlight: Current Selected Class Banner */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 4 },
          mb: 4,
          background: currentLesson.isToday
            ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(13, 27, 42, 0.85) 60%, rgba(114, 9, 183, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(72, 199, 142, 0.08) 0%, rgba(13, 27, 42, 0.85) 100%)',
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
              label={currentLesson.room}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', color: '#e2e8f0', fontWeight: 700, fontSize: '0.75rem' }}
            />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mb: 1, letterSpacing: -0.5 }}>
            {currentLesson.title}
          </Typography>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 850, lineHeight: 1.6 }}>
            {currentLesson.summary}
          </Typography>

          {/* Quick Highlight Pills */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mb: 3 }}>
            <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(0, 180, 216, 0.1)', border: '1px solid rgba(0, 180, 216, 0.25)' }}>
              <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 800 }}>
                ⚡ Zero Conditional (Fatos Científicos)
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(72, 199, 142, 0.1)', border: '1px solid rgba(72, 199, 142, 0.25)' }}>
              <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800 }}>
                🎯 First Conditional (Probabilidade Futura)
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(255, 183, 77, 0.1)', border: '1px solid rgba(255, 183, 77, 0.25)' }}>
              <Typography variant="caption" sx={{ color: '#ffb74d', fontWeight: 800 }}>
                👑 Second Conditional (Hipóteses & Were)
              </Typography>
            </Box>
            <Box sx={{ px: 2, py: 0.8, borderRadius: 2.5, bgcolor: 'rgba(179, 136, 255, 0.1)', border: '1px solid rgba(179, 136, 255, 0.25)' }}>
              <Typography variant="caption" sx={{ color: '#b388ff', fontWeight: 800 }}>
                🦅 Skimming & Scanning
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
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
              📖 Ler Material da Aula (Apostila In-App)
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
                Progresso nas Atividades:
              </Typography>
              <Chip
                label={`${completedActivitiesCount} / ${totalActivities} Feitas`}
                size="small"
                sx={{
                  bgcolor: completedActivitiesCount === totalActivities ? 'rgba(72,199,142,0.2)' : 'rgba(0,180,216,0.15)',
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

      {/* Activities Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoStoriesIcon sx={{ color: '#00b4d8', fontSize: 26 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
              🎯 Atividades & Desafios da Aula ({currentLesson.time})
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>
            {currentLesson.activities?.length || 0} Questões Interativas
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {currentLesson.activities?.map((act, index) => {
            const submission = submittedAnswers[act.id];
            const isSubmitted = submission?.isSubmitted;
            const isCorrect = submission?.isCorrect;
            const chosenIndex = isSubmitted ? submission.chosenIndex : selectedAnswers[act.id];

            return (
              <Grid size={{ xs: 12 }} key={act.id}>
                <Card
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    background: isSubmitted
                      ? isCorrect
                        ? 'rgba(72, 199, 142, 0.06)'
                        : 'rgba(239, 68, 68, 0.06)'
                      : 'rgba(13, 27, 42, 0.45)',
                    border: isSubmitted
                      ? isCorrect
                        ? '1px solid rgba(72, 199, 142, 0.35)'
                        : '1px solid rgba(239, 68, 68, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`Questão ${index + 1}`}
                        size="small"
                        sx={{ bgcolor: 'rgba(0, 180, 216, 0.15)', color: '#38bdf8', fontWeight: 900, fontSize: '0.72rem' }}
                      />
                      <Chip
                        label={act.category}
                        size="small"
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.06)', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                        label={`+${act.xp} XP`}
                        size="small"
                        sx={{ bgcolor: 'rgba(179, 136, 255, 0.15)', color: '#b388ff', fontWeight: 800 }}
                      />
                      <Chip
                        label={`+${act.coins} 🪙`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255, 183, 77, 0.15)', color: '#ffb74d', fontWeight: 800 }}
                      />
                      {isSubmitted && (
                        <Chip
                          icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                          label={isCorrect ? 'Correto!' : 'Incorreto'}
                          size="small"
                          sx={{
                            bgcolor: isCorrect ? 'rgba(72, 199, 142, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isCorrect ? '#48c78e' : '#ef4444',
                            fontWeight: 900
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', mb: 1, fontSize: '1.05rem' }}>
                    {act.title}
                  </Typography>

                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2.5, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {act.question}
                  </Typography>

                  {/* Options */}
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                    <RadioGroup
                      value={chosenIndex !== undefined ? chosenIndex : ''}
                      onChange={(e) => handleSelectOption(act.id, Number(e.target.value))}
                    >
                      {act.options.map((opt, optIdx) => {
                        let optBg = 'rgba(255, 255, 255, 0.02)';
                        let optBorder = '1px solid rgba(255, 255, 255, 0.08)';

                        if (isSubmitted) {
                          if (optIdx === act.correctIndex) {
                            optBg = 'rgba(72, 199, 142, 0.18)';
                            optBorder = '1.5px solid #48c78e';
                          } else if (optIdx === chosenIndex && !isCorrect) {
                            optBg = 'rgba(239, 68, 68, 0.18)';
                            optBorder = '1.5px solid #ef4444';
                          }
                        } else if (chosenIndex === optIdx) {
                          optBg = 'rgba(0, 180, 216, 0.12)';
                          optBorder = '1.5px solid #00b4d8';
                        }

                        return (
                          <Box
                            key={optIdx}
                            onClick={() => !isSubmitted && handleSelectOption(act.id, optIdx)}
                            sx={{
                              p: 1.5,
                              mb: 1.2,
                              borderRadius: 3,
                              bgcolor: optBg,
                              border: optBorder,
                              cursor: isSubmitted ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.2s ease',
                              '&:hover': !isSubmitted ? { bgcolor: 'rgba(0, 180, 216, 0.08)', borderColor: 'rgba(0, 180, 216, 0.3)' } : {}
                            }}
                          >
                            <Radio
                              checked={chosenIndex === optIdx}
                              disabled={isSubmitted}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                                '&.Mui-checked': {
                                  color: isSubmitted ? (isCorrect ? '#48c78e' : '#ef4444') : '#00b4d8'
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, ml: 1 }}>
                              {opt}
                            </Typography>
                          </Box>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>

                  {/* Submit Button or Explanation Box */}
                  {!isSubmitted ? (
                    <Button
                      variant="contained"
                      disabled={chosenIndex === undefined}
                      onClick={() => handleSubmitAnswer(act)}
                      sx={{
                        bgcolor: '#00b4d8',
                        color: '#fff',
                        fontWeight: 800,
                        borderRadius: 2.5,
                        px: 3,
                        py: 1,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#0096c7' }
                      }}
                    >
                      Confirmar Resposta
                    </Button>
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: isCorrect ? 'rgba(72, 199, 142, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: isCorrect ? '1px solid rgba(72, 199, 142, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isCorrect ? '#48c78e' : '#ef4444', mb: 0.5 }}>
                        {isCorrect ? '🎉 Resposta Correta!' : '💡 Explicação Pedagógica:'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                        {act.explanation}
                      </Typography>
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
          background: 'rgba(13, 27, 42, 0.35)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <HistoryEduIcon sx={{ color: '#b388ff', fontSize: 24 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff' }}>
            Frequências Registradas pelo Professor
          </Typography>
        </Box>

        {(!attendanceRecords || attendanceRecords.length === 0) ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography fontSize={40} sx={{ mb: 1 }}>📅</Typography>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
              Sua frequência da aula das 16:30 será confirmada pelo professor ao início da chamada.
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
                      Horário: {att.time} · Presença Confirmada
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Card>

      {/* PDF In-App Reader Modal */}
      <PdfViewerModal
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        lesson={currentLesson}
      />
    </Box>
  );
}
