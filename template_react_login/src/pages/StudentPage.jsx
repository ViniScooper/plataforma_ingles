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
  Tabs,
  Tab,
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

const TYPE_LABELS = {
  quiz: '🧠 Quiz',
  text: '📖 Leitura',
  'gap-fill': '✏️ Lacunas',
  writing: '✍️ Escrita',
  'true-false': '✅ V/F',
  'sentence-order': '🧩 Frases',
  matching: '🔗 Relacionar',
  flashcards: '🎴 Flashcards',
};

export default function StudentPage() {
  const { user, logout } = useContext(AuthContext);

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCards, setOpenCards] = useState({});
  const [activityTab, setActivityTab] = useState(0);

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

  // Filter logic per tab
  const filterExercises = (exercises) => {
    const isWriting = (p) => p.exercise?.type === 'writing' || (p.exercise?.type === 'text' && p.exercise?.content?.prompt);
    const isFlashcard = (p) => p.exercise?.type === 'flashcards' || (p.exercise?.type === 'text' && p.exercise?.content?.cards);
    switch (activityTab) {
      case 1: return exercises.filter(p => p.status !== 'completed');
      case 2: return exercises.filter(p => p.status === 'completed');
      case 3: return exercises.filter(p => isWriting(p));
      case 4: return exercises.filter(p => p.exercise?.type === 'quiz');
      case 5: return exercises.filter(p => isFlashcard(p));
      case 6: return exercises.filter(p => ['true-false', 'sentence-order', 'matching', 'gap-fill', 'text'].includes(p.exercise?.type) && !isWriting(p) && !isFlashcard(p));
      default: return exercises;
    }
  };

  const renderCompletedBody = (p) => {
    const answers = p.result?.answers || {};
    const questions = p.exercise?.content?.questions;

    return (
      <Box>
        {/* Score/status alert */}
        {p.exercise?.type === 'writing' ? (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={700}>✅ Texto enviado para o professor!</Typography>
          </Alert>
        ) : (
          <Alert
            severity={
              p.totalQuestions === 0 ? 'success'
              : p.score === p.totalQuestions ? 'success'
              : p.score >= p.totalQuestions / 2 ? 'warning'
              : 'error'
            }
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              {p.totalQuestions === 0
                ? '✅ Atividade concluída com sucesso!'
                : p.score === p.totalQuestions
                ? `🏆 Perfeito! Você acertou tudo! (${p.score}/${p.totalQuestions})`
                : `Você acertou ${p.score} de ${p.totalQuestions}. Continue praticando!`
              }
            </Typography>
          </Alert>
        )}

        {/* Writing submitted text */}
        {p.exercise?.type === 'writing' && p.result?.answers?.[0] && (
          <Box sx={{ p: 2.5, bgcolor: '#f9f4ff', border: '1px solid #ce93d8', borderRadius: 2, mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#7b1fa2', textTransform: 'uppercase' }}>
              Sua resposta enviada:
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontFamily: 'Georgia, serif', lineHeight: 1.8 }}>
              {p.result.answers[0]}
            </Typography>
          </Box>
        )}

        {/* True/False results */}
        {p.exercise?.type === 'true-false' && Array.isArray(p.result?.validation) && p.result.validation.map((r, i) => (
          <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: r.isCorrect ? '#f9fff9' : '#fff9f9' }}>
            <Typography variant="body2" fontWeight={700}>{r.isCorrect ? '✅' : '❌'} {r.statement}</Typography>
            {!r.isCorrect && <Typography variant="caption" color="error">Correto: {r.correctAnswer ? 'Verdadeiro' : 'Falso'}</Typography>}
          </Card>
        ))}

        {/* Sentence order results */}
        {p.exercise?.type === 'sentence-order' && Array.isArray(p.result?.validation) && p.result.validation.map((r, i) => (
          <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: r.isCorrect ? '#f9fff9' : '#fff9f9' }}>
            <Typography variant="caption" fontWeight={700} color={r.isCorrect ? 'success.main' : 'error'}>
              {r.isCorrect ? '✅ Correto' : '❌ Errado'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>Sua resposta: <em>{r.userAnswer}</em></Typography>
            {!r.isCorrect && <Typography variant="body2" color="success.main">Correto: <strong>{r.sentence}</strong></Typography>}
          </Card>
        ))}

        {/* Quiz results */}
        {p.exercise?.type === 'quiz' && Array.isArray(questions) && questions.map((q, qIdx) => {
          const studentAns = answers[qIdx] || '';
          const correct = q.correct || q.a || '';
          const isCorrect = studentAns.trim().toLowerCase() === correct.trim().toLowerCase();
          return (
            <Card key={qIdx} sx={{ p: 2, mb: 2, borderRadius: 2, borderLeft: `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: isCorrect ? '#f9fff9' : '#fff9f9' }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                {isCorrect ? '✅' : '❌'} {qIdx + 1}. {q.question}
              </Typography>
              {q.options?.map((opt, oIdx) => {
                const isStudentChoice = opt === studentAns;
                const isCorrectOpt = opt === correct;
                let bg = 'transparent';
                let fw = 400;
                if (isCorrectOpt) { bg = '#e8f5e9'; fw = 700; }
                if (isStudentChoice && !isCorrectOpt) bg = '#ffebee';
                return (
                  <Box key={oIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.6, borderRadius: 1.5, bgcolor: bg, mb: 0.4 }}>
                    <Typography variant="body2" sx={{ fontWeight: fw }}>
                      {isStudentChoice && !isCorrectOpt ? '👉 ' : isCorrectOpt ? '✅ ' : '     '}{opt}
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          );
        })}

        {/* Fallback for text/reading */}
        {!['writing', 'true-false', 'sentence-order', 'quiz'].includes(p.exercise?.type) && p.totalQuestions === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography fontSize={40}>🌟</Typography>
            <Typography variant="body1" color="success.main" fontWeight={700}>Atividade concluída!</Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderActivityCard = (p, idx) => {
    const isCompleted = p.status === 'completed';
    const isOpen = !!openCards[p.id];

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
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: isCompleted ? '#e8f5e9' : '#ede7f6', display: 'flex' }}>
              {isCompleted
                ? <CheckCircleIcon sx={{ color: '#43a047', fontSize: 24 }} />
                : <PendingIcon sx={{ color: '#7c4dff', fontSize: 24 }} />
              }
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {p.exercise?.title || `Atividade ${idx + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                <Chip
                  label={TYPE_LABELS[p.exercise?.type] || p.exercise?.type}
                  size="small"
                  sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#f0f0f0', color: '#555' }}
                />
                <Typography variant="caption" color="textSecondary">
                  {isCompleted
                    ? (p.totalQuestions > 0 ? `${p.score}/${p.totalQuestions} acertos` : 'Concluída')
                    : `Nível: ${p.exercise?.level || 'Geral'}`
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={isCompleted ? '✓ Concluída' : 'Pendente'}
              size="small"
              sx={{ fontWeight: 700, bgcolor: isCompleted ? '#e8f5e9' : '#ede7f6', color: isCompleted ? '#2e7d32' : '#6a1b9a' }}
            />
            <Button
              size="small"
              variant={isOpen ? 'outlined' : 'contained'}
              color={isCompleted ? 'success' : 'primary'}
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
            {isCompleted ? renderCompletedBody(p) : (
              <ExerciseCard
                exercise={{ ...(p.exercise || {}), userId: user?.id }}
                onComplete={loadData}
              />
            )}
          </Box>
        </Collapse>
      </Card>
    );
  };

  const filteredExercises = filterExercises(assignedExercises);

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

          {/* Progress bar */}
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
                '& .MuiLinearProgress-bar': { backgroundColor: '#fff', borderRadius: 5 }
              }}
            />
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: 'block' }}>
              {completedCount} de {assignedExercises.length} atividades concluídas
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stat cards */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#333' }}>
                📚 Suas Atividades
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {completedCount}/{assignedExercises.length} concluídas
              </Typography>
            </Box>

            {assignedExercises.length === 0 ? (
              <Card sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '2px dashed #d0d0ff', bgcolor: '#f8f8ff', mb: 4 }}>
                <Typography fontSize={56}>📭</Typography>
                <Typography variant="h6" sx={{ color: '#666', mt: 1 }}>Nenhuma atividade ainda</Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>Aguarde seu professor enviar novas tarefas!</Typography>
              </Card>
            ) : (
              <Box sx={{ mb: 4 }}>
                {/* Filter Tabs */}
                <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                  <Tabs
                    value={activityTab}
                    onChange={(_, v) => setActivityTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      bgcolor: 'white',
                      '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                      '& .MuiTab-root': { minHeight: 52, fontWeight: 700, fontSize: '0.83rem', textTransform: 'none' },
                    }}
                  >
                    <Tab label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        📋 Todas <Chip label={assignedExercises.length} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                      </Box>
                    } />
                    <Tab label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        ⏳ Pendentes <Chip label={pendingCount} size="small" color={pendingCount > 0 ? 'warning' : 'default'} sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                      </Box>
                    } />
                    <Tab label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        ✅ Concluídas <Chip label={completedCount} size="small" color={completedCount > 0 ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                      </Box>
                    } />
                    <Tab label="✍️ Escrita" />
                    <Tab label="🧠 Quiz" />
                    <Tab label="🎴 Flashcards" />
                    <Tab label="🧩 Outros" />
                  </Tabs>
                </Card>

                {filteredExercises.length === 0 ? (
                  <Card sx={{ p: 5, textAlign: 'center', borderRadius: 4, border: '2px dashed #e0e0ff', bgcolor: '#fafaff' }}>
                    <Typography fontSize={40}>🔍</Typography>
                    <Typography variant="body1" sx={{ color: '#888', mt: 1 }}>Nenhuma atividade nesta categoria ainda.</Typography>
                  </Card>
                ) : (
                  filteredExercises.map((p, idx) => renderActivityCard(p, idx))
                )}
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
