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
  Avatar,
  TextField,
  InputAdornment,
  ThemeProvider,
  createTheme,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import LogoutIcon from '@mui/icons-material/Logout';
import ReplayIcon from '@mui/icons-material/Replay';
import FireIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import MedalIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import ExerciseCard from '../components/Student/ExerciseCard';
import GamesZone from '../components/Student/GamesZone';

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

// Creating a premium cosmic theme isolated for the student experience
const studentTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
      light: '#33c3e0',
      dark: '#0077b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#b388ff',
      light: '#d1c4e9',
      dark: '#7c4dff',
    },
    success: {
      main: '#48c78e',
      contrastText: '#000000',
    },
    warning: {
      main: '#ffb74d',
    },
    error: {
      main: '#ff8fa3',
    },
    background: {
      default: '#070f19',
      paper: '#0d1b2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13, 27, 42, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: 20,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '10px 24px',
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 180, 216, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00b4d8',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          textTransform: 'none',
          fontSize: '0.9rem',
          borderRadius: 12,
          minHeight: 44,
          padding: '6px 16px',
        },
      },
    },
  },
});

export default function StudentPage() {
  const { user, logout } = useContext(AuthContext);

  const [assignedExercises, setAssignedExercises] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openCards, setOpenCards] = useState({});
  
  // Dashboard Tabs: 0 = Atividades, 1 = Jogos, 2 = Histórico
  const [dashboardTab, setDashboardTab] = useState(0);
  
  // Mobile Hamburger Menu States
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const handleOpenMenu = (event) => setMenuAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setMenuAnchorEl(null);
  
  // Activity Filters (sub-tab)
  const [activityTab, setActivityTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Persistent bonus XP earned through minigames
  const [bonusXP, setBonusXP] = useState(() => {
    return parseInt(localStorage.getItem(`bonus_xp_${user?.id}`) || '0');
  });

  const handleEarnBonusXP = (amount) => {
    setBonusXP(prev => {
      const next = prev + amount;
      localStorage.setItem(`bonus_xp_${user?.id}`, String(next));
      return next;
    });
  };

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
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamically calculate gamified levels and XP
  const xpPerExercise = 100;
  const totalXP = (completedCount * xpPerExercise) + bonusXP;
  const xpPerLevel = 300;
  const currentLevel = Math.floor(totalXP / xpPerLevel) + 1;
  const xpInCurrentLevel = totalXP % xpPerLevel;
  const levelPercent = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

  // Generate badges dynamically based on progress
  const badges = [
    {
      id: 'first_step',
      name: 'Primeiro Passo',
      desc: 'Completou sua 1ª atividade',
      icon: '🎓',
      active: completedCount >= 1
    },
    {
      id: 'streak_five',
      name: 'Foco Total',
      desc: 'Completou 5+ atividades',
      icon: '🔥',
      active: completedCount >= 5
    },
    {
      id: 'perfect_attendance',
      name: 'Presença VIP',
      desc: 'Registrou 3+ aulas presenciais',
      icon: '📅',
      active: attendanceRecords.length >= 3
    },
    {
      id: 'monster_hunter',
      name: 'Caçador de Monstros',
      desc: 'Ganhou bônus na Área de Jogos',
      icon: '⚔️',
      active: bonusXP >= 100
    }
  ];

  const filterExercises = (exercises) => {
    const isWriting = (p) => p.exercise?.type === 'writing' || (p.exercise?.type === 'text' && p.exercise?.content?.prompt);
    const isFlashcard = (p) => p.exercise?.type === 'flashcards' || (p.exercise?.type === 'text' && p.exercise?.content?.cards);
    
    // First filter by type / tab selection
    let filtered = exercises;
    switch (activityTab) {
      case 1: filtered = exercises.filter(p => p.status !== 'completed'); break;
      case 2: filtered = exercises.filter(p => p.status === 'completed'); break;
      case 3: filtered = exercises.filter(p => isWriting(p)); break;
      case 4: filtered = exercises.filter(p => p.exercise?.type === 'quiz'); break;
      case 5: filtered = exercises.filter(p => isFlashcard(p)); break;
      case 6: filtered = exercises.filter(p => ['true-false', 'sentence-order', 'matching', 'gap-fill', 'text'].includes(p.exercise?.type) && !isWriting(p) && !isFlashcard(p)); break;
      default: break;
    }

    // Then filter by text search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        (p.exercise?.title || '').toLowerCase().includes(term) ||
        (p.exercise?.type || '').toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const renderCompletedBody = (p) => {
    const answers = p.result?.answers || {};
    const questions = p.exercise?.content?.questions;

    return (
      <Box sx={{ animation: 'fadeIn 0.4s ease' }}>
        {p.exercise?.type === 'writing' ? (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(72, 199, 142, 0.12)', border: '1px solid rgba(72, 199, 142, 0.25)', color: '#a5d6a7' }}>
            <Typography variant="subtitle2" fontWeight={800}>✅ Texto enviado com sucesso para o professor!</Typography>
          </Alert>
        ) : (
          <Alert
            severity={
              p.totalQuestions === 0 ? 'success'
              : p.score === p.totalQuestions ? 'success'
              : p.score >= p.totalQuestions / 2 ? 'warning'
              : 'error'
            }
            sx={{
              mb: 3,
              borderRadius: 3,
              bgcolor: p.score === p.totalQuestions ? 'rgba(72, 199, 142, 0.12)' : 'rgba(239, 108, 0, 0.12)',
              border: `1px solid ${p.score === p.totalQuestions ? 'rgba(72, 199, 142, 0.25)' : 'rgba(239, 108, 0, 0.25)'}`,
              color: p.score === p.totalQuestions ? '#a5d6a7' : '#ffb74d'
            }}
          >
            <Typography variant="subtitle2" fontWeight={800}>
              {p.totalQuestions === 0
                ? '✅ Atividade concluída com sucesso!'
                : p.score === p.totalQuestions
                ? `🏆 Perfeito! Você acertou tudo! (${p.score}/${p.totalQuestions})`
                : `Você acertou ${p.score} de ${p.totalQuestions}. Continue praticando!`
              }
            </Typography>
          </Alert>
        )}

        {p.exercise?.type === 'writing' && p.result?.answers?.[0] && (
          <Box sx={{ p: 2.5, bgcolor: 'rgba(179, 136, 255, 0.07)', border: '1px solid rgba(179, 136, 255, 0.15)', borderRadius: 3, mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#b388ff', textTransform: 'uppercase', display: 'block', mb: 1, letterSpacing: 0.5 }}>
              Sua resposta enviada:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: '"Inter", sans-serif', lineHeight: 1.8, color: '#eee' }}>
              {p.result.answers[0]}
            </Typography>
          </Box>
        )}

        {p.exercise?.type === 'true-false' && Array.isArray(p.result?.validation) && p.result.validation.map((r, i) => (
          <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="body2" fontWeight={700} color="#eee">{r.isCorrect ? '✅' : '❌'} {r.statement}</Typography>
            {!r.isCorrect && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', fontWeight: 600 }}>Correto: {r.correctAnswer ? 'True' : 'False'}</Typography>}
          </Card>
        ))}

        {p.exercise?.type === 'sentence-order' && Array.isArray(p.result?.validation) && p.result.validation.map((r, i) => (
          <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}`, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="caption" fontWeight={800} color={r.isCorrect ? 'success.main' : 'error'}>
              {r.isCorrect ? '✅ Correto' : '❌ Errado'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#ddd' }}>Sua resposta: <em>{r.userAnswer}</em></Typography>
            {!r.isCorrect && <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>Correto: {r.sentence}</Typography>}
          </Card>
        ))}

        {p.exercise?.type === 'quiz' && Array.isArray(questions) && questions.map((q, qIdx) => {
          const studentAns = answers[qIdx] || '';
          const correct = q.correct || q.a || '';
          const isCorrect = studentAns.trim().toLowerCase() === correct.trim().toLowerCase();
          return (
            <Card key={qIdx} sx={{ p: 2.5, mb: 2, borderRadius: 3, border: `1px solid ${isCorrect ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`, bgcolor: 'rgba(255,255,255,0.01)' }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: '#eee' }}>
                {isCorrect ? '✅' : '❌'} {qIdx + 1}. {q.question}
              </Typography>
              {q.options?.map((opt, oIdx) => {
                const isStudentChoice = opt === studentAns;
                const isCorrectOpt = opt === correct;
                let bg = 'transparent';
                let fw = 500;
                let color = '#94a3b8';
                if (isCorrectOpt) { bg = 'rgba(76, 175, 80, 0.12)'; fw = 750; color = '#a5d6a7'; }
                if (isStudentChoice && !isCorrectOpt) { bg = 'rgba(244, 67, 54, 0.12)'; color = '#ef9a9a'; }
                return (
                  <Box key={oIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: 2.5, bgcolor: bg, mb: 0.8 }}>
                    <Typography variant="body2" sx={{ fontWeight: fw, color }}>
                      {isStudentChoice && !isCorrectOpt ? '👉 ' : isCorrectOpt ? '✅ ' : ''}{opt}
                    </Typography>
                  </Box>
                );
              })}
            </Card>
          );
        })}

        {!['writing', 'true-false', 'sentence-order', 'quiz'].includes(p.exercise?.type) && p.totalQuestions === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography fontSize={48}>🌟</Typography>
            <Typography variant="h6" color="success.main" fontWeight={800} sx={{ mt: 1 }}>Atividade de leitura concluída com sucesso!</Typography>
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
          mb: 2.5,
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(13, 27, 42, 0.35)',
          border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.2)' : isOpen ? 'rgba(0, 180, 216, 0.35)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isOpen ? '0 12px 30px rgba(0, 180, 216, 0.1)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.35)' : 'rgba(0, 180, 216, 0.5)'}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        {/* Card Header Clickable to Toggle */}
        <Box
          onClick={() => toggleCard(p.id)}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            p: 2.5,
            cursor: 'pointer',
            background: isCompleted
              ? 'linear-gradient(90deg, rgba(72, 199, 142, 0.05), rgba(72, 199, 142, 0.01))'
              : isOpen
              ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.06), rgba(0, 180, 216, 0.01))'
              : 'transparent',
            '&:hover': { filter: 'brightness(1.1)' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1.2,
              borderRadius: 3.5,
              bgcolor: isCompleted ? 'rgba(72, 199, 142, 0.12)' : 'rgba(0, 180, 216, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isCompleted ? '0 0 10px rgba(72, 199, 142, 0.15)' : 'none'
            }}>
              {isCompleted
                ? <CheckCircleIcon sx={{ color: '#48c78e', fontSize: 24 }} />
                : <PendingIcon sx={{ color: '#00b4d8', fontSize: 24 }} />
              }
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                {p.exercise?.title || `Atividade ${idx + 1}`}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.2, mt: 0.8 }}>
                <Chip
                  label={TYPE_LABELS[p.exercise?.type] || p.exercise?.type}
                  size="small"
                  sx={{ height: 22, fontSize: '0.72rem', fontWeight: 800, bgcolor: 'rgba(255,255,255,0.06)', color: '#eee' }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
                  {isCompleted
                    ? (p.totalQuestions > 0 ? `Resultado: ${p.score}/${p.totalQuestions}` : 'Concluída')
                    : `Nível: ${p.exercise?.level ? p.exercise.level.toUpperCase() : 'GERAL'}`
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
            gap: 2
          }}>
            <Chip
              label={isCompleted ? 'Concluída' : 'Pendente'}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.72rem',
                height: 24,
                bgcolor: isCompleted ? 'rgba(72, 199, 142, 0.12)' : 'rgba(255, 183, 77, 0.12)',
                color: isCompleted ? '#48c78e' : '#ffb74d',
                border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.25)' : 'rgba(255, 183, 77, 0.25)'}`
              }}
            />
            <Button
              size="small"
              variant="contained"
              sx={{
                fontWeight: 800,
                borderRadius: 2.5,
                textTransform: 'none',
                px: 2.5,
                background: isCompleted 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))' 
                  : 'linear-gradient(135deg, #00b4d8, #0077b6)',
                border: isCompleted ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
                color: '#fff',
                '&:hover': {
                  background: isCompleted 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'linear-gradient(135deg, #00c0f0, #0096c7)',
                  boxShadow: isCompleted ? 'none' : '0 4px 12px rgba(0, 180, 216, 0.3)'
                }
              }}
            >
              {isOpen ? 'Fechar' : 'Abrir'}
            </Button>
          </Box>
        </Box>

        {/* Expandable Workspace */}
        <Collapse in={isOpen}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
          <Box sx={{ p: 3, bgcolor: 'rgba(0, 0, 0, 0.15)' }}>
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
    <ThemeProvider theme={studentTheme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #090f1e 0%, #060b13 100%)',
        color: '#fff',
        pb: 10,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating animated cosmic orbs */}
        <Box sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 180, 216, 0.06) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <Box sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(179, 136, 255, 0.05) 0%, transparent 70%)',
          bottom: '10%',
          left: '-100px',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          
          * {
            font-family: 'Outfit', 'Inter', sans-serif !important;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Global Navigation Header (Glassmorphic Top-Bar) */}
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(13, 27, 42, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          py: 2,
          mb: 4
        }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Logo / Brand */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <img
                  src="/quest_english_logo.png"
                  alt="Quest English"
                  style={{
                    height: '38px',
                    mixBlendMode: 'screen',
                    filter: 'drop-shadow(0 2px 10px rgba(0,180,216,0.3))'
                  }}
                />
                <Typography variant="h6" sx={{
                  background: 'linear-gradient(90deg, #fff, #94a3b8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  letterSpacing: 0.5,
                  display: { xs: 'none', sm: 'block' }
                }}>
                  QUEST ENGLISH
                </Typography>
              </Box>

              {/* Center Navigation - Desktop view */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                <Button
                  onClick={() => setDashboardTab(0)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: dashboardTab === 0 ? 'rgba(0, 180, 216, 0.12)' : 'transparent',
                    border: `1px solid ${dashboardTab === 0 ? 'rgba(0, 180, 216, 0.25)' : 'transparent'}`,
                    color: dashboardTab === 0 ? '#00b4d8' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 180, 216, 0.08)',
                      color: '#00b4d8'
                    }
                  }}
                  startIcon={<SchoolIcon />}
                >
                  Atividades
                </Button>
                <Button
                  onClick={() => setDashboardTab(1)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: dashboardTab === 1 ? 'rgba(179, 136, 255, 0.12)' : 'transparent',
                    border: `1px solid ${dashboardTab === 1 ? 'rgba(179, 136, 255, 0.25)' : 'transparent'}`,
                    color: dashboardTab === 1 ? '#b388ff' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(179, 136, 255, 0.08)',
                      color: '#b388ff'
                    }
                  }}
                  startIcon={<SportsEsportsIcon />}
                >
                  Jogos
                </Button>
                <Button
                  onClick={() => setDashboardTab(2)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: dashboardTab === 2 ? 'rgba(72, 199, 142, 0.12)' : 'transparent',
                    border: `1px solid ${dashboardTab === 2 ? 'rgba(72, 199, 142, 0.25)' : 'transparent'}`,
                    color: dashboardTab === 2 ? '#48c78e' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(72, 199, 142, 0.08)',
                      color: '#48c78e'
                    }
                  }}
                  startIcon={<EventAvailableIcon />}
                >
                  Histórico
                </Button>
              </Box>

              {/* Mobile Hamburger Menu */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                <IconButton
                  onClick={handleOpenMenu}
                  sx={{ 
                    color: '#fff', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: 2.5,
                    p: 1
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    style: {
                      background: 'rgba(13, 27, 42, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      color: '#fff',
                      minWidth: 160
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { setDashboardTab(0); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: dashboardTab === 0 ? '#00b4d8' : '#fff', gap: 10 }}
                  >
                    <SchoolIcon fontSize="small" /> Atividades
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { setDashboardTab(1); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: dashboardTab === 1 ? '#b388ff' : '#fff', gap: 10 }}
                  >
                    <SportsEsportsIcon fontSize="small" /> Jogos
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { setDashboardTab(2); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: dashboardTab === 2 ? '#48c78e' : '#fff', gap: 10 }}
                  >
                    <EventAvailableIcon fontSize="small" /> Histórico
                  </MenuItem>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  <MenuItem 
                    onClick={() => { logout(); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: '#ff5a79', gap: 10 }}
                  >
                    <LogoutIcon fontSize="small" /> Sair
                  </MenuItem>
                </Menu>
              </Box>

              {/* Desktop Logout Button */}
              <Button
                variant="outlined"
                onClick={logout}
                size="small"
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: 2.5,
                  px: 2,
                  py: 0.8,
                  '&:hover': {
                    borderColor: '#ff8fa3',
                    bgcolor: 'rgba(255, 143, 163, 0.08)',
                    color: '#ff8fa3'
                  }
                }}
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
              >
                Sair
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4}>
            
            {/* LEFT COLUMN: Student Profile & Gamification Stats */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* 1. Student Profile Card */}
                <Card sx={{ p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  {/* Decorative mesh */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '80px',
                    background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                    opacity: 0.15,
                    zIndex: 0
                  }} />
                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{
                      width: 80, height: 80,
                      mb: 2,
                      border: '3px solid #00b4d8',
                      boxShadow: '0 0 20px rgba(0, 180, 216, 0.3)',
                      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: '#00b4d8'
                    }}>
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ST'}
                    </Avatar>
                    <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', mb: 0.5 }}>
                      Student Account
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mb: 2 }}>
                      {user?.email}
                    </Typography>

                    <Divider sx={{ width: '100%', borderColor: 'rgba(255,255,255,0.07)', my: 2 }} />

                    {/* Streak flame */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      bgcolor: 'rgba(255, 183, 77, 0.08)',
                      border: '1px solid rgba(255, 183, 77, 0.25)',
                      borderRadius: 3.5,
                      px: 3,
                      py: 1,
                      boxShadow: '0 0 15px rgba(255, 183, 77, 0.08)',
                      animation: 'fadeIn 0.6s ease'
                    }}>
                      <FireIcon sx={{ color: '#ff9800', fontSize: 28 }} />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#ff9800', lineHeight: 1.1 }}>
                          {attendanceRecords.length > 0 ? attendanceRecords.length : 1}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 183, 77, 0.7)', fontWeight: 800, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Aulas Ativas
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>

                {/* 2. Gamified Level / XP Tracker Card */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: '#00b4d8' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>Progresso de Nível</Typography>
                    </Box>
                    <Chip
                      label={`Nível ${currentLevel}`}
                      size="small"
                      sx={{
                        fontWeight: 900,
                        bgcolor: 'rgba(0, 180, 216, 0.15)',
                        color: '#00b4d8',
                        border: '1px solid rgba(0, 180, 216, 0.3)',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>XP Geral</Typography>
                      <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 900 }}>{xpInCurrentLevel} / {xpPerLevel} XP</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={levelPercent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 1, fontStyle: 'italic' }}>
                    Ganhe 100 XP por cada atividade completada ou minijogo vencido! Falta pouco para o nível {currentLevel + 1}!
                  </Typography>
                </Card>

                {/* 3. Achievements / Badges locker */}
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <MedalIcon sx={{ color: '#b388ff' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>Seus Conquistas</Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {badges.map((badge) => (
                      <Grid item xs={6} key={badge.id}>
                        <Box sx={{
                          p: 1.8,
                          borderRadius: 4,
                          border: badge.active ? '1px solid rgba(179, 136, 255, 0.25)' : '1px solid rgba(255,255,255,0.04)',
                          bgcolor: badge.active ? 'rgba(179, 136, 255, 0.04)' : 'rgba(0,0,0,0.2)',
                          textAlign: 'center',
                          opacity: badge.active ? 1 : 0.45,
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography fontSize={32} sx={{
                            mb: 0.8,
                            filter: badge.active ? 'drop-shadow(0 0 8px rgba(179,136,255,0.4))' : 'grayscale(100%)'
                          }}>
                            {badge.icon}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: badge.active ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.2 }}>
                            {badge.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', mt: 0.5, lineHeight: 1.2 }}>
                            {badge.desc}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Card>

              </Box>
            </Grid>

            {/* RIGHT COLUMN: Activities View, Games Zone, or Attendance Records */}
            <Grid item xs={12} md={8}>
              
              {dashboardTab === 0 && (
                // TAB 0: ACTIVITIES PANEL
                <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                  
                  {/* Title and stats bar */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, sm: 'alignItems: center', justifyContent: 'space-between', gap: 2, mb: 3.5 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
                        📚 Atividades Atribuídas
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                        Gerencie suas tarefas e submeta suas respostas.
                      </Typography>
                    </Box>

                    {/* Simple summary progress bar */}
                    <Box sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800 }}>Progresso de Conclusão</Typography>
                        <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 900 }}>{progressPercent}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#48c78e',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Empty state or list */}
                  {assignedExercises.length === 0 ? (
                    <Card sx={{
                      p: 8,
                      textAlign: 'center',
                      border: '2px dashed rgba(255,255,255,0.1)',
                      bgcolor: 'rgba(255,255,255,0.01)',
                    }}>
                      <Typography fontSize={64} sx={{ mb: 1.5 }}>📭</Typography>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800 }}>Nenhuma atividade atribuída</Typography>
                      <Typography variant="body2" sx={{ color: '#b3c5d7', mt: 0.5 }}>Aguarde seu professor enviar novas tarefas!</Typography>
                    </Card>
                  ) : (
                    <>
                      {/* Sub-Filters and Search Bar */}
                      <Grid container spacing={2} sx={{ mb: 3.5 }}>
                        <Grid item xs={12} sm={8}>
                          <Card sx={{
                            display: 'flex',
                            bgcolor: 'rgba(0, 0, 0, 0.15)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 3.5,
                            overflow: 'hidden'
                          }}>
                            <Tabs
                              value={activityTab}
                              onChange={(_, v) => setActivityTab(v)}
                              variant="scrollable"
                              scrollButtons="auto"
                              sx={{
                                minHeight: 48,
                                '& .MuiTabs-indicator': { height: 3, bgcolor: '#00b4d8', borderRadius: '3px 3px 0 0' },
                                '& .MuiTab-root': {
                                  minHeight: 48,
                                  color: 'rgba(255,255,255,0.5)',
                                  '&.Mui-selected': { color: '#00b4d8' }
                                },
                              }}
                            >
                              <Tab label={`Todas (${assignedExercises.length})`} />
                              <Tab label={`Pendentes (${pendingCount})`} />
                              <Tab label={`Concluídas (${completedCount})`} />
                              <Tab label="Escritas ✍️" />
                              <Tab label="Quizzes 🧠" />
                              <Tab label="Flashcards 🎴" />
                              <Tab label="Outros 🧩" />
                            </Tabs>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar atividade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: 48,
                                borderRadius: 3.5,
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </Grid>
                      </Grid>

                      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                          <CircularProgress size={44} sx={{ color: '#00b4d8' }} />
                        </Box>
                      ) : filteredExercises.length === 0 ? (
                        <Card sx={{
                          p: 6,
                          textAlign: 'center',
                          border: '1.5px dashed rgba(255,255,255,0.08)',
                          bgcolor: 'rgba(255,255,255,0.01)'
                        }}>
                          <Typography fontSize={48}>🔍</Typography>
                          <Typography variant="body1" sx={{ color: '#b3c5d7', mt: 1, fontWeight: 700 }}>
                            Nenhuma atividade encontrada.
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                            Tente mudar a aba de filtros ou limpar a pesquisa.
                          </Typography>
                        </Card>
                      ) : (
                        filteredExercises.map((p, idx) => renderActivityCard(p, idx))
                      )}
                    </>
                  )}
                </Box>
              )}

              {dashboardTab === 1 && (
                // TAB 1: GAMES ZONE
                <Box>
                  <GamesZone onEarnXP={handleEarnBonusXP} />
                </Box>
              )}

              {dashboardTab === 2 && (
                // TAB 2: ATTENDANCE HISTORY PANEL
                <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
                      🕒 Histórico de Aulas
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                      Acompanhe suas aulas presenciais e frequências confirmadas.
                    </Typography>
                  </Box>

                  <Card sx={{
                    p: 4,
                    background: 'rgba(13, 27, 42, 0.35)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 5
                  }}>
                    {(!attendanceRecords || attendanceRecords.length === 0) ? (
                      <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography fontSize={52} sx={{ mb: 1.5 }}>📅</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 800 }}>Nenhuma aula registrada ainda</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>Seu histórico de presenças aparecerá aqui assim que o professor registrar.</Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2.5}>
                        {attendanceRecords.map((att) => (
                          <Grid item xs={12} sm={6} key={att.id}>
                            <Box sx={{
                              p: 2.5,
                              borderRadius: 4,
                              background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.06), rgba(179, 136, 255, 0.06))',
                              border: '1px solid rgba(255,255,255,0.06)',
                              display: 'flex',
                              gap: 2,
                              alignItems: 'center',
                              transition: 'all 0.25s ease',
                              '&:hover': {
                                border: '1px solid rgba(0, 180, 216, 0.25)',
                                bgcolor: 'rgba(0,180,216,0.04)',
                                transform: 'translateY(-2px)'
                              }
                            }}>
                              <Box sx={{
                                bgcolor: 'rgba(179, 136, 255, 0.12)',
                                p: 1.5,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <EventAvailableIcon sx={{ color: '#b388ff', fontSize: 24 }} />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                                  {new Date(att.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', mt: 0.3 }}>
                                  ⏰ Horário: {att.time}
                                </Typography>
                                <Chip
                                  label="Presença Confirmada"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.62rem',
                                    fontWeight: 900,
                                    bgcolor: 'rgba(72, 199, 142, 0.12)',
                                    color: '#48c78e',
                                    border: '1px solid rgba(72, 199, 142, 0.2)',
                                    mt: 1
                                  }}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Card>
                </Box>
              )}

            </Grid>

          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
