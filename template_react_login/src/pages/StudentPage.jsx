import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Button,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Collapse,
  Divider,
  LinearProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import ExerciseCard from '../components/Student/ExerciseCard';

export default function StudentPage() {
  const { user, logout } = useContext(AuthContext);

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCards, setOpenCards] = useState({});

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [progRes, attRes] = await Promise.all([
        apiClient.get(`/progress/${user.id}`),
        apiClient.get(`/attendance/${user.id}`)
      ]);
      const progress = progRes.data;
      setAssignedExercises(progress);
      setAttendanceRecords(attRes.data);
      const firstPending = progress.find(p => p.status !== 'completed');
      if (firstPending) setOpenCards({ [firstPending.id]: true });
    } catch (err) {
      setError('Falha ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (id) => {
    setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = assignedExercises.filter(p => p.status === 'completed').length;
  const pendingCount = assignedExercises.length - completedCount;
  const progressPercent = assignedExercises.length > 0
    ? Math.round((completedCount / assignedExercises.length) * 100)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7ff' }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 8,
          pt: 4,
          px: 3,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                🎓 English Learning Platform
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, mt: 0.5 }}>
                {pendingCount > 0
                  ? `Você tem ${pendingCount} atividade${pendingCount > 1 ? 's' : ''} para completar hoje!`
                  : '🎉 Parabéns! Você concluiu todas as atividades!'}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Sair
            </Button>
          </Box>

          {/* Progress bar in header */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Seu progresso geral</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{progressPercent}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#fff',
                  borderRadius: 5,
                }
              }}
            />
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
              {completedCount} de {assignedExercises.length} atividades concluídas
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stat cards floating over banner */}
      <Container maxWidth="md" sx={{ mt: -4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ bgcolor: '#ede7f6', p: 1.5, borderRadius: 2 }}>
                <SchoolIcon sx={{ color: '#7c4dff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>ATIVIDADES</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{pendingCount}</Typography>
                <Typography variant="caption" color="textSecondary">pendentes</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ bgcolor: '#e8f5e9', p: 1.5, borderRadius: 2 }}>
                <EmojiEventsIcon sx={{ color: '#43a047', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>CONCLUÍDAS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{completedCount}</Typography>
                <Typography variant="caption" color="textSecondary">de {assignedExercises.length} total</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: 2 }}>
                <EventAvailableIcon sx={{ color: '#1e88e5', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>AULAS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{attendanceRecords.length}</Typography>
                <Typography variant="caption" color="textSecondary">realizadas</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        )}

        {!loading && (
          <Box>
            {/* Activities Section */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>
              📚 Suas Atividades
            </Typography>

            {assignedExercises.length === 0 ? (
              <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #d0d0ff', bgcolor: '#f8f8ff', mb: 4 }}>
                <Typography fontSize={56}>📭</Typography>
                <Typography variant="h6" sx={{ color: '#666', mt: 1 }}>Nenhuma atividade ainda</Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>Aguarde seu professor enviar novas tarefas!</Typography>
              </Card>
            ) : (
              <Box sx={{ mb: 4 }}>
                {assignedExercises.map((p, idx) => {
                  const isCompleted = p.status === 'completed';
                  const isOpen = !!openCards[p.id];
                  const answers = p.result?.answers || {};
                  const questions = p.exercise?.content?.questions;

                  return (
                    <Card
                      key={p.id}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: isOpen ? '0 8px 32px rgba(102,126,234,0.18)' : '0 2px 8px rgba(0,0,0,0.07)',
                        border: `1.5px solid ${isCompleted ? '#a5d6a7' : isOpen ? '#c5cae9' : '#e0e0e0'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Header */}
                      <Box
                        onClick={() => toggleCard(p.id)}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2.5,
                          cursor: 'pointer',
                          background: isCompleted
                            ? 'linear-gradient(90deg, #f1f8f1, #e8f5e9)'
                            : isOpen
                            ? 'linear-gradient(90deg, #ede7f6, #f3e5f5)'
                            : '#fafafa',
                          '&:hover': { filter: 'brightness(0.97)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: isCompleted ? '#e8f5e9' : '#ede7f6',
                              display: 'flex',
                            }}
                          >
                            {isCompleted
                              ? <CheckCircleIcon sx={{ color: '#43a047', fontSize: 24 }} />
                              : <PendingIcon sx={{ color: '#7c4dff', fontSize: 24 }} />
                            }
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                              {p.exercise?.title || `Atividade ${idx + 1}`}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {isCompleted
                                ? `✅ Concluída · ${p.score}/${p.totalQuestions} acertos`
                                : `Nível: ${p.exercise?.level || 'Geral'} · ${p.exercise?.type === 'quiz' ? '🧠 Quiz' : p.exercise?.type === 'text' ? '📖 Leitura' : '✏️ Lacunas'}`
                              }
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={isCompleted ? '✓ Concluída' : 'Pendente'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: isCompleted ? '#e8f5e9' : '#ede7f6',
                              color: isCompleted ? '#2e7d32' : '#6a1b9a',
                              border: 'none',
                            }}
                          />
                          <Button 
                            size="small" 
                            variant={isOpen ? "outlined" : "contained"} 
                            color={isCompleted ? "success" : "primary"}
                            endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            sx={{ fontWeight: 'bold', ml: 1, borderRadius: 2, textTransform: 'none' }}
                          >
                            {isOpen ? 'Fechar' : 'Abrir'}
                          </Button>
                        </Box>
                      </Box>

                      {/* Body */}
                      <Collapse in={isOpen}>
                        <Divider />
                        <Box sx={{ p: 3 }}>
                          {isCompleted ? (
                            <Box>
                              <Alert
                                severity={
                                  p.totalQuestions === 0         ? 'success'
                                  : p.score === p.totalQuestions  ? 'success'
                                  : p.score >= p.totalQuestions / 2 ? 'warning'
                                  : 'error'
                                }
                                sx={{ mb: 3, borderRadius: 2 }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {p.score === p.totalQuestions
                                    ? `🏆 Perfeito! Você acertou tudo! (${p.score}/${p.totalQuestions})`
                                    : p.totalQuestions === 0
                                    ? '✅ Leitura concluída com sucesso!'
                                    : `Você acertou ${p.score} de ${p.totalQuestions} questões. Continue praticando!`
                                  }
                                </Typography>
                              </Alert>

                              {/* O Texto base foi removido da visualização de conclusão conforme solicitado, mostrando apenas os resultados. */}

                              {Array.isArray(questions) && questions.map((q, qIdx) => {
                                const studentAns = answers[qIdx] || '';
                                const correct = q.correct || q.a || '';
                                const isCorrect = studentAns.trim().toLowerCase() === correct.trim().toLowerCase();
                                return (
                                  <Card key={qIdx} sx={{ p: 2, mb: 2, borderRadius: 2, borderLeft: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: isCorrect ? '#f9fff9' : '#fff9f9' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                                      {isCorrect ? '✅' : '❌'} {qIdx + 1}. {q.question}
                                    </Typography>
                                    {q.options?.map((opt, oIdx) => {
                                      const isStudentChoice = opt === studentAns;
                                      const isCorrectOpt = opt === correct;
                                      let bg = 'transparent';
                                      let fontWeight = 400;
                                      if (isCorrectOpt) { bg = '#e8f5e9'; fontWeight = 700; }
                                      if (isStudentChoice && !isCorrectOpt) bg = '#ffebee';
                                      return (
                                        <Box key={oIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.6, borderRadius: 1.5, bgcolor: bg, mb: 0.4 }}>
                                          <Typography variant="body2" sx={{ fontWeight }}>
                                            {isStudentChoice && !isCorrectOpt ? '👉 ' : isCorrectOpt ? '✅ ' : '     '}
                                            {opt}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                  </Card>
                                );
                              })}

                              {!Array.isArray(questions) && p.totalQuestions === 0 && (
                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                  <Typography fontSize={40}>🌟</Typography>
                                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 700 }}>Texto lido e concluído!</Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <ExerciseCard
                              exercise={{ ...(p.exercise || {}), userId: user?.id }}
                              onComplete={loadData}
                            />
                          )}
                        </Box>
                      </Collapse>
                    </Card>
                  );
                })}
              </Box>
            )}

            {/* Attendance Section */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>
              🕒 Histórico de Aulas
            </Typography>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', mb: 4 }}>
              {(!attendanceRecords || attendanceRecords.length === 0) ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography fontSize={36}>📅</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Nenhuma aula registrada ainda.</Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {attendanceRecords.map((att) => (
                    <Grid item xs={12} sm={6} md={4} key={att.id}>
                      <Box sx={{
                        p: 2,
                        borderRadius: 2.5,
                        background: 'linear-gradient(135deg, #667eea22, #764ba222)',
                        border: '1px solid #c5cae9',
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center'
                      }}>
                        <Box sx={{ bgcolor: '#ede7f6', p: 1, borderRadius: 1.5 }}>
                          <EventAvailableIcon sx={{ color: '#7c4dff', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {new Date(att.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">⏰ {att.time}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
}
