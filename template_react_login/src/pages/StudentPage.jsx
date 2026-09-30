import { useState, useEffect, useContext, Fragment, useRef, useMemo } from 'react';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import soundEffects from '../utils/soundEffects';
import speechService from '../utils/textToSpeech';
import ExerciseCard from '../components/Student/ExerciseCard';
import { StudentAvatar } from '../components/Student/StudentAvatar';
import AchievementsModal from '../components/Student/AchievementsModal';
import StreakRulesModal from '../components/Student/StreakRulesModal';
import MobileBottomNav from '../components/Student/MobileBottomNav';
import ClassroomHub from '../components/Student/ClassroomHub';
import SlideLibrary from '../components/Student/SlideLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorBoundary from '../components/ErrorBoundary';
import {
  TYPE_LABELS,
  MODULES,
  MODULE_COLORS,
  MODULE_EXPLANATIONS,
  getModuleIdForExercise,
  isRpgExerciseCompleted,
  isModuleUnlocked
} from '../data/modulesData';

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

const isWriting = (p) => p?.exercise?.type === 'writing' || (p?.exercise?.type === 'text' && p?.exercise?.content?.prompt);
const isFlashcard = (p) => p?.exercise?.type === 'flashcards' || (p?.exercise?.type === 'text' && p?.exercise?.content?.cards);

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
  const [activityViewLayout, setActivityViewLayout] = useState('focus'); // 'focus' (passando pro lado) | 'list'
  const [focusActivityIdx, setFocusActivityIdx] = useState(0);

  // Backend gamification states
  const [backendCoins, setBackendCoins] = useState(0);
  const [backendStreak, setBackendStreak] = useState(0);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [isStreakFrozen, setIsStreakFrozen] = useState(false);

  // Ranking (Leaderboard) states
  const [rankingList, setRankingList] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');

  // Badge unlock Dialog state
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [streakRulesOpen, setStreakRulesOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width:600px)');
  const [viewMode, setViewMode] = useState('rpg'); // 'rpg' | 'list' | 'speaking'
  const [speakingCategory, setSpeakingCategory] = useState('Frases Básicas');
  const speakingExercisesRef = useRef(null);
  const [rpgModuleId, setRpgModuleId] = useState(1); // 1 to 10
  const [openExplanationDialog, setOpenExplanationDialog] = useState(false);
  const [explanationPage, setExplanationPage] = useState(0);

  const slideTouchStartX = useRef(0);
  const slideTouchEndX = useRef(0);

  const handleSlideTouchStart = (e) => {
    if (e.targetTouches && e.targetTouches[0]) {
      slideTouchStartX.current = e.targetTouches[0].clientX;
    }
  };

  const handleSlideTouchEnd = (e, totalPages) => {
    if (e.changedTouches && e.changedTouches[0]) {
      slideTouchEndX.current = e.changedTouches[0].clientX;
      const diff = slideTouchStartX.current - slideTouchEndX.current;
      if (Math.abs(diff) > 45) {
        if (diff > 0 && explanationPage < totalPages - 1) {
          setExplanationPage(prev => prev + 1);
        } else if (diff < 0 && explanationPage > 0) {
          setExplanationPage(prev => prev - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (openExplanationDialog) {
      setExplanationPage(0);
    }
  }, [openExplanationDialog]);
  const [completedExplanations, setCompletedExplanations] = useState(() => {
    try {
      const saved = localStorage.getItem(`completed_explanations_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [activeFocusExercise, setActiveFocusExercise] = useState(null);
  const [timerTick, setTimerTick] = useState(0);

  // Daily Lesson Calendar states & midnight countdown timer
  const [selectedDayOffset, setSelectedDayOffset] = useState(0); // 0 = Hoje
  const [countdownToMidnight, setCountdownToMidnight] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight - now;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setCountdownToMidnight(`${hours}h ${minutes}m`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const weekCalendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const dayLessons = {
      '-4': { title: 'Módulo 3: Grammar Expansion', desc: 'Past Simple, verbos regulares e irregulares.', moduleId: 3 },
      '-3': { title: 'Módulo 4: Everyday Expressions', desc: 'Expressões idiomáticas do cotidiano.', moduleId: 4 },
      '-2': { title: 'Módulo 5: Professional Vocabulary', desc: 'Inglês para negócios, trabalho e reuniões.', moduleId: 5 },
      '-1': { title: 'Módulo 6: Narrative & Stories', desc: 'Past Continuous e Past Perfect.', moduleId: 6 },
      '0': { title: 'Módulo 7: Future & Conditionals', desc: 'Zero, First, Second e Third Conditionals.', moduleId: 7 },
      '1': { title: 'Módulo 8: Complex Text & Reading', desc: 'Leitura aprofundada e vocabulário avançado.', moduleId: 8 },
    };

    for (let offset = -4; offset <= 1; offset++) {
      const d = new Date(today);
      d.setDate(today.getDate() + offset);
      const isToday = offset === 0;
      const isPast = offset < 0;
      const isFuture = offset > 0;
      const lesson = dayLessons[offset.toString()] || { title: `Módulo ${offset + 7}`, desc: 'Lição diária de inglês', moduleId: 1 };

      days.push({
        offset,
        dateStr: d.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        isToday,
        isPast,
        isFuture,
        lesson
      });
    }
    return days;
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Persistent bonus XP earned through minigames
  const [bonusXP, setBonusXP] = useState(() => {
    return parseInt(localStorage.getItem(`bonus_xp_${user?.id}`) || '0');
  });

  const handleEarnBonusXP = async (amount) => {
    setBonusXP(prev => {
      const next = prev + amount;
      localStorage.setItem(`bonus_xp_${user?.id}`, String(next));
      return next;
    });
    try {
      setBackendCoins(prev => {
        const newCoins = prev + 1;
        apiClient.put(`/users/${user.id}`, { coins: newCoins }).catch(err => {
          console.error('Erro ao sincronizar moedas do jogo:', err);
        });
        return newCoins;
      });
    } catch (err) {
      console.error('Erro ao adicionar moedas do minigame:', err);
    }
  };

  const handleSpendCoins = async (amount) => {
    try {
      setBackendCoins(prev => {
        const newCoins = Math.max(0, prev - amount);
        apiClient.put(`/users/${user.id}`, { coins: newCoins }).catch(err => {
          console.error('Erro ao sincronizar gasto de moedas:', err);
        });
        return newCoins;
      });
    } catch (err) {
      console.error('Erro ao gastar moedas:', err);
    }
  };

  const handlePurchaseUtility = async (itemId, price) => {
    if (!user) return;
    try {
      if (itemId === 'streak-booster') {
        const newStreak = backendStreak + 1;
        setBackendStreak(newStreak);
        localStorage.setItem(`last_known_streak_${user.id}`, newStreak.toString());
        await apiClient.put(`/users/${user.id}`, { streak: newStreak });
        alert("🔥 Elixir de Ofensiva ativado! +1 dia adicionado à sua ofensiva!");
      } else if (itemId === 'streak-freeze') {
        localStorage.setItem(`streak_freeze_${user.id}`, 'true');
        setIsStreakFrozen(true);
        alert("❄️ Protetor de Ofensiva ativado! Sua ofensiva está protegida contra faltas!");
      } else if (itemId === 'restore-lives') {
        // Reset attempts and clear locks for all modules 1-10
        for (let i = 1; i <= 10; i++) {
          localStorage.removeItem(`rpg_attempts_${user.id}_${i}`);
          localStorage.removeItem(`rpg_lock_time_${user.id}_${i}`);
        }
        alert("🧪 Poção de Vidas ativada! Todas as suas vidas foram restauradas e os módulos destravados!");
      }
      loadData();
    } catch (err) {
      console.error('Erro ao realizar compra de utilitário:', err);
      alert('Houve um erro ao processar sua compra.');
    }
  };

  const loadRanking = async () => {
    try {
      setRankingLoading(true);
      setRankingError('');
      const response = await apiClient.get('/ranking');
      setRankingList(response.data);
    } catch (err) {
      setRankingError('Erro ao carregar o ranking de alunos: ' + err.message);
    } finally {
      setRankingLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardTab === 2) {
      loadRanking();
    }
  }, [dashboardTab]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError('');
      const [progRes, attRes, userRes] = await Promise.all([
        apiClient.get(`/progress/${user.id}`),
        apiClient.get(`/attendance/${user.id}`),
        apiClient.get(`/users/${user.id}`)
      ]);
      const progress = progRes.data;
      setAssignedExercises(progress);
      setAttendanceRecords(attRes.data);
      
      let userData = userRes.data;
      let finalCoins = userData.coins || 0;
      let finalStreak = userData.streak || 0;
      
      // Streak Freeze logic
      setIsStreakFrozen(localStorage.getItem(`streak_freeze_${user.id}`) === 'true');
      
      if (userData.lastActivity) {
        const now = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const diffMs = now.setHours(0,0,0,0) - new Date(userData.lastActivity).setHours(0,0,0,0);
        
        if (diffMs > oneDayMs) {
          // They missed a day. Let's see if they have streak freeze active
          const isFrozen = localStorage.getItem(`streak_freeze_${user.id}`) === 'true';
          if (isFrozen) {
            // Consume it
            localStorage.removeItem(`streak_freeze_${user.id}`);
            setIsStreakFrozen(false);
            
            // Retrieve last known streak or fall back to user's database streak
            const savedStreak = parseInt(localStorage.getItem(`last_known_streak_${user.id}`) || '0');
            const restoredStreak = savedStreak > 0 ? savedStreak : (userData.streak || 1);
            
            // Set lastActivity to yesterday so it won't reset on next activity
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            try {
              const updatedUserRes = await apiClient.put(`/users/${user.id}`, {
                lastActivity: yesterday.toISOString(),
                streak: restoredStreak
              });
              userData = updatedUserRes.data;
              finalStreak = restoredStreak;
              alert(`❄️ Seu Protetor de Ofensiva foi ativado! Sua ofensiva de ${restoredStreak} ${restoredStreak === 1 ? 'dia' : 'dias'} foi salva!`);
            } catch (err) {
              console.error("Erro ao aplicar protetor de ofensiva:", err);
            }
          }
        }
      }

      setBackendCoins(finalCoins);
      setBackendStreak(finalStreak);
      if (finalStreak > 0) {
        localStorage.setItem(`last_known_streak_${user.id}`, finalStreak.toString());
      }
      
      if (userData.message) {
        setPenaltyMessage(userData.message);
      }

      if (!silent) {
        const firstPending = progress.find(p => p.status !== 'completed');
        if (firstPending) setOpenCards({ [firstPending.id]: true });
      }
    } catch (err) {
      setError('Falha ao carregar dados: ' + err.message);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const markExplanationCompleted = (moduleId) => {
    const updated = { ...completedExplanations, [moduleId]: true };
    setCompletedExplanations(updated);
    localStorage.setItem(`completed_explanations_${user?.id || 'guest'}`, JSON.stringify(updated));
  };

  const getModuleAttempts = (moduleId) => {
    const saved = localStorage.getItem(`rpg_attempts_${user?.id || 'guest'}_${moduleId}`);
    return saved ? parseInt(saved) : 0;
  };

  const getModuleLockTime = (moduleId) => {
    const saved = localStorage.getItem(`rpg_lock_time_${user?.id || 'guest'}_${moduleId}`);
    return saved ? parseInt(saved) : null;
  };

  const getRemainingLockSeconds = (moduleId) => {
    const lockTime = getModuleLockTime(moduleId);
    if (!lockTime) return 0;
    const elapsed = Math.floor((Date.now() - lockTime) / 1000);
    const remaining = 3600 - elapsed;
    return remaining > 0 ? remaining : 0;
  };

  const checkAndResetLock = (moduleId) => {
    const remaining = getRemainingLockSeconds(moduleId);
    if (remaining === 0 && getModuleLockTime(moduleId)) {
      localStorage.removeItem(`rpg_lock_time_${user?.id || 'guest'}_${moduleId}`);
      localStorage.removeItem(`rpg_attempts_${user?.id || 'guest'}_${moduleId}`);
    }
  };

  const handleExerciseComplete = (progressEntry, validationData) => {
    // Reload the student's progress and stats from backend (silently)
    loadData(true);

    // Check if it is an RPG exercise
    const isRpg = progressEntry.exercise?.isRpg;
    if (!isRpg) {
      // For non-RPG exercises, normal completion flow
      alert("Atividade concluída com sucesso!");
      return;
    }

    const moduleId = getModuleIdForExercise(progressEntry.exercise);
    
    // Check if they got all correct (100%)
    const allCorrect = validationData ? (validationData.score === validationData.totalQuestions || validationData.totalQuestions === 0) : false;

    if (allCorrect) {
      // Reset attempts/lives for this module
      localStorage.removeItem(`rpg_attempts_${user?.id || 'guest'}_${moduleId}`);
      localStorage.removeItem(`rpg_lock_time_${user?.id || 'guest'}_${moduleId}`);
      
      alert("🏆 Incrível! Você acertou tudo e desbloqueou a próxima etapa! Parabéns!");
      setActiveFocusExercise(null);
    } else {
      // Increment attempts (consume a life)
      const currentAttempts = getModuleAttempts(moduleId);
      const newAttempts = currentAttempts + 1;
      
      localStorage.setItem(`rpg_attempts_${user?.id || 'guest'}_${moduleId}`, newAttempts.toString());
      
      if (newAttempts >= 4) {
        // Lock the module for 1 hour
        localStorage.setItem(`rpg_lock_time_${user?.id || 'guest'}_${moduleId}`, Date.now().toString());
        alert("💔 Você perdeu todas as suas 4 vidas neste módulo! O módulo foi bloqueado por 1 hora. Volte e tente novamente mais tarde!");
        setActiveFocusExercise(null);
      } else {
        alert(`⚠️ Você errou alguma questão! Você perdeu 1 vida. Você tem mais ${4 - newAttempts} vidas (tentativas) neste módulo.`);
      }
    }
  };

  const toggleCard = (id) => {
    setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const listExercises = assignedExercises.filter(p => p.exercise?.isRpg !== true && p.exercise?.type !== 'speaking');
  const rpgExercises = assignedExercises.filter(p => p.exercise?.isRpg === true && p.exercise?.type !== 'speaking');
  const speakingExercises = assignedExercises.filter(p => p.exercise?.type === 'speaking');
  const currentCategoryExercises = speakingExercises.filter(p => getSpeakingCategory(p.exercise) === speakingCategory);

  const completedCount = viewMode === 'speaking'
    ? currentCategoryExercises.filter(p => p.status === 'completed').length
    : viewMode === 'list'
    ? listExercises.filter(p => p.status === 'completed').length
    : rpgExercises.filter(p => p.status === 'completed').length;

  const pendingCount = viewMode === 'speaking'
    ? currentCategoryExercises.filter(p => p.status !== 'completed').length
    : viewMode === 'list'
    ? listExercises.filter(p => p.status !== 'completed').length
    : rpgExercises.filter(p => p.status !== 'completed').length;

  const totalCount = viewMode === 'speaking'
    ? currentCategoryExercises.length
    : viewMode === 'list'
    ? listExercises.length
    : rpgExercises.length;

  const progressPercent = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
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

  const totalCoins = backendCoins;

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
    },
    {
      id: 'coin_master',
      name: 'Mestre das Moedas',
      desc: 'Acumulou 100+ moedas',
      icon: '🪙',
      active: totalCoins >= 100
    },
    {
      id: 'streak_master',
      name: 'Fogo Puro',
      desc: 'Alcançou ofensiva de 3+ dias',
      icon: '⚡',
      active: backendStreak >= 3
    },
    {
      id: 'rpg_conqueror',
      name: 'Conquistador RPG',
      desc: 'Ganhou 200+ XP nos minijogos',
      icon: '👑',
      active: bonusXP >= 200
    },
    {
      id: 'completionist',
      name: 'Super Aluno',
      desc: 'Concluiu 10+ atividades',
      icon: '🏆',
      active: completedCount >= 10
    }
  ];

  useEffect(() => {
    if (!user) return;
    const shownKey = `badges_shown_${user.id}`;
    let shownBadges = [];
    try {
      shownBadges = JSON.parse(localStorage.getItem(shownKey) || '[]');
    } catch (e) {
      shownBadges = [];
    }

    const newlyUnlocked = badges.find(b => b.active && !shownBadges.includes(b.id));
    if (newlyUnlocked) {
      shownBadges.push(newlyUnlocked.id);
      localStorage.setItem(shownKey, JSON.stringify(shownBadges));
      setUnlockedBadge(newlyUnlocked);
    }
  }, [completedCount, attendanceRecords.length, bonusXP, totalCoins, backendStreak, user]);

  const filterExercises = (exercises) => {
    if (viewMode === 'speaking') {
      const speakingOnly = exercises.filter(p => p.exercise?.type === 'speaking');
      const categoryOnly = speakingOnly.filter(p => getSpeakingCategory(p.exercise) === speakingCategory);
      let filtered = categoryOnly;
      if (activityTab === 1) {
        filtered = categoryOnly.filter(p => p.status !== 'completed');
      } else if (activityTab === 2) {
        filtered = categoryOnly.filter(p => p.status === 'completed');
      }
      
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          (p.exercise?.title || '').toLowerCase().includes(term) ||
          (p.exercise?.type || '').toLowerCase().includes(term) ||
          (p.exercise?.sentence || p.exercise?.content?.sentence || '').toLowerCase().includes(term)
        );
      }
      return filtered;
    }

    // Only show non-RPG (classroom list) activities in list view, and filter out speaking exercises
    const listOnly = exercises.filter(p => p.exercise?.isRpg !== true && p.exercise?.type !== 'speaking');
    
    // First filter by type / tab selection
    let filtered = listOnly;
    switch (activityTab) {
      case 1: filtered = listOnly.filter(p => p.status !== 'completed'); break;
      case 2: filtered = listOnly.filter(p => p.status === 'completed'); break;
      case 3: filtered = listOnly.filter(p => isWriting(p)); break;
      case 4: filtered = listOnly.filter(p => p.exercise?.type === 'quiz'); break;
      case 5: filtered = listOnly.filter(p => isFlashcard(p)); break;
      case 6: filtered = listOnly.filter(p => ['true-false', 'sentence-order', 'matching', 'gap-fill', 'text'].includes(p.exercise?.type) && !isWriting(p) && !isFlashcard(p)); break;
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

  const handleRedoExercise = async (progressEntry) => {
    if (!window.confirm("Deseja refazer esta atividade? Seu progresso anterior será limpo.")) {
      return;
    }
    try {
      setError('');
      await apiClient.put('/progress/status', {
        userId: user.id,
        exerciseId: progressEntry.exercise.id,
        status: 'assigned',
        score: 0,
        totalQuestions: 0,
        result: null
      });
      soundEffects.playSuccess();
      setActiveFocusExercise(null);
      await loadData(true);
    } catch (err) {
      console.error("Erro ao resetar atividade:", err);
      setError("Erro ao resetar atividade: " + err.message);
    }
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
          <Card key={i} sx={{
            p: 2.5, mb: 1.8,
            borderLeft: `5px solid ${r.isCorrect ? '#48c78e' : '#ff5a79'}`,
            bgcolor: r.isCorrect ? 'rgba(72, 199, 142, 0.05)' : 'rgba(255, 90, 121, 0.05)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 3.5,
            boxShadow: r.isCorrect ? '0 0 12px rgba(72,199,142,0.1)' : 'none'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
              <Typography variant="body2" fontWeight={800} color="#eee" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                {r.isCorrect ? '✅' : '❌'} {r.statement}
              </Typography>
              <Tooltip title="Ouvir afirmação em inglês">
                <IconButton
                  size="small"
                  onClick={() => speechService.speak(r.statement, 0.85)}
                  sx={{
                    color: '#00b4d8',
                    bgcolor: 'rgba(0, 180, 216, 0.12)',
                    flexShrink: 0,
                    '&:hover': { bgcolor: '#00b4d8', color: '#fff', transform: 'scale(1.1)' }
                  }}
                >
                  <VolumeUpIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
            {!r.isCorrect && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 800, color: '#ff8fa3', fontSize: '0.78rem' }}>
                Resposta correta: {r.correctAnswer ? 'True (Verdadeiro)' : 'False (Falso)'}
              </Typography>
            )}
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

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => handleRedoExercise(p)}
          sx={{
            mt: 3,
            borderRadius: 3.5,
            py: 1.2,
            fontWeight: 800,
            textTransform: 'none',
            color: '#b388ff',
            borderColor: 'rgba(179, 136, 255, 0.4)',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#b388ff',
              bgcolor: 'rgba(179, 136, 255, 0.05)',
              transform: 'translateY(-1px)'
            }
          }}
          startIcon={<span>↺</span>}
        >
          Refazer Atividade
        </Button>
      </Box>
    );
  };

  const renderActivityCard = (p, idx, forceOpen = false) => {
    const isCompleted = p.status === 'completed';
    const isOpen = forceOpen ? (openCards[p.id] !== false) : !!openCards[p.id];
    const exType = p.exercise?.type || 'text';

    // Skill icons & color scheme
    let typeConfig = { label: '🧩 Prática', color: '#00e5ff', bg: 'rgba(0, 229, 255, 0.1)' };
    if (exType === 'speaking') {
      typeConfig = { label: '🎙️ Pronúncia', color: '#48c78e', bg: 'rgba(72, 199, 142, 0.12)' };
    } else if (exType === 'quiz') {
      typeConfig = { label: '🧠 Quiz', color: '#00b4d8', bg: 'rgba(0, 180, 216, 0.12)' };
    } else if (exType === 'true-false') {
      typeConfig = { label: '⚖️ V ou F', color: '#48c78e', bg: 'rgba(72, 199, 142, 0.12)' };
    } else if (isWriting(p)) {
      typeConfig = { label: '✍️ Escrita', color: '#b388ff', bg: 'rgba(179, 136, 255, 0.12)' };
    } else if (isFlashcard(p)) {
      typeConfig = { label: '🎴 Flashcard', color: '#ffb74d', bg: 'rgba(255, 183, 77, 0.12)' };
    }

    return (
      <Card
        key={p.id}
        sx={{
          mb: 2,
          borderRadius: 3.5,
          overflow: 'hidden',
          background: isOpen 
            ? 'linear-gradient(145deg, rgba(13, 27, 42, 0.7), rgba(7, 15, 25, 0.8))' 
            : 'rgba(13, 27, 42, 0.4)',
          border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.3)' : isOpen ? 'rgba(0, 180, 216, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: isOpen ? '0 8px 30px rgba(0, 180, 216, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.25s ease',
          '&:hover': {
            border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.5)' : 'rgba(0, 180, 216, 0.6)'}`,
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
            gap: 1.5,
            p: 2,
            cursor: 'pointer',
            background: isCompleted
              ? 'linear-gradient(90deg, rgba(72, 199, 142, 0.06), transparent)'
              : isOpen
              ? 'linear-gradient(90deg, rgba(0, 180, 216, 0.08), transparent)'
              : 'transparent'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
            {/* Status icon badge */}
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: isCompleted ? 'rgba(72, 199, 142, 0.15)' : 'rgba(0, 180, 216, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {isCompleted
                ? <CheckCircleIcon sx={{ color: '#48c78e', fontSize: 22 }} />
                : <PendingIcon sx={{ color: '#00b4d8', fontSize: 22 }} />
              }
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.exercise?.title || `Atividade ${idx + 1}`}
                </Typography>
                <Tooltip title="Ouvir em inglês (Prof. Vinicius)">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const speakText = p.exercise?.sentence || p.exercise?.content?.sentence || p.exercise?.title || '';
                      if (speakText) speechService.speak(speakText, 0.85);
                    }}
                    sx={{
                      color: '#00b4d8',
                      bgcolor: 'rgba(0, 180, 216, 0.1)',
                      p: 0.5,
                      '&:hover': {
                        bgcolor: '#00b4d8',
                        color: '#fff',
                        transform: 'scale(1.15)'
                      }
                    }}
                  >
                    <VolumeUpIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.8, mt: 0.8 }}>
                <Chip
                  label={typeConfig.label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    bgcolor: typeConfig.bg,
                    color: typeConfig.color,
                    border: `1px solid ${typeConfig.color}40`
                  }}
                />

                <Chip
                  label="+100 XP"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 850,
                    bgcolor: 'rgba(255, 215, 0, 0.12)',
                    color: '#ffd426',
                    border: '1px solid rgba(255, 215, 0, 0.25)'
                  }}
                />

                <Chip
                  label="+10 🪙"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 850,
                    bgcolor: 'rgba(255, 170, 0, 0.12)',
                    color: '#ffaa00',
                    border: '1px solid rgba(255, 170, 0, 0.25)'
                  }}
                />

                <Chip
                  label="👨‍🏫 Prof. Vinicius Lourenço"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.62rem',
                    fontWeight: 750,
                    bgcolor: 'rgba(0, 180, 216, 0.08)',
                    color: '#00b4d8',
                    border: '1px solid rgba(0, 180, 216, 0.2)'
                  }}
                />

                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', ml: 0.5 }}>
                  {isCompleted
                    ? (p.totalQuestions > 0 ? `Score: ${p.score}/${p.totalQuestions}` : '✓ Concluída')
                    : (p.exercise?.level ? `Nível ${p.exercise.level.toUpperCase()}` : 'A2 Iniciante')
                  }
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Button & Status Chip */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' },
            gap: 1.5,
            flexShrink: 0
          }}>
            <Chip
              label={isCompleted ? 'Concluída' : 'Pendente'}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '0.68rem',
                height: 22,
                bgcolor: isCompleted ? 'rgba(72, 199, 142, 0.12)' : 'rgba(255, 183, 77, 0.12)',
                color: isCompleted ? '#48c78e' : '#ffb74d',
                border: `1px solid ${isCompleted ? 'rgba(72, 199, 142, 0.25)' : 'rgba(255, 183, 77, 0.25)'}`
              }}
            />

            <Button
              size="small"
              variant="contained"
              sx={{
                fontWeight: 850,
                borderRadius: 2.5,
                textTransform: 'none',
                fontSize: '0.8rem',
                px: 2,
                py: 0.6,
                background: isCompleted
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'linear-gradient(135deg, #00b4d8, #0077b6)',
                border: isCompleted ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
                color: '#fff',
                boxShadow: isCompleted ? 'none' : '0 2px 10px rgba(0, 180, 216, 0.3)',
                '&:hover': {
                  background: isCompleted
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'linear-gradient(135deg, #00c0f0, #0096c7)'
                }
              }}
            >
              {isOpen ? 'Fechar' : isCompleted ? 'Revisar' : 'Praticar →'}
            </Button>
          </Box>
        </Box>

        {/* Expandable Workspace */}
        <Collapse in={isOpen}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
          <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'rgba(0, 0, 0, 0.2)' }}>
            {isCompleted ? renderCompletedBody(p) : (
              <ExerciseCard
                exercise={{ ...(p.exercise || {}), userId: user?.id }}
                onComplete={() => loadData(true)}
              />
            )}
          </Box>
        </Collapse>
      </Card>
    );
  };

  useEffect(() => {
    setFocusActivityIdx(0);
  }, [activityTab, searchTerm, viewMode]);

  const renderExerciseCollection = (exercises) => {
    if (exercises.length === 0) return null;
    const safeFocusIdx = Math.min(focusActivityIdx, Math.max(0, exercises.length - 1));

    return (
      <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
        {/* View Mode Bar: Modo Foco (1 por 1) vs Modo Lista */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          p: 1.5,
          px: { xs: 1.5, sm: 2.2 },
          borderRadius: 3.5,
          bgcolor: 'rgba(13, 27, 42, 0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
          gap: 1.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.88rem' }}>
              {activityViewLayout === 'focus' ? '🎯 Modo Foco: 1 por Vez (Sem Scroll)' : '📑 Modo Lista Completa'}
            </Typography>
            <Chip
              label={`${exercises.length} ${exercises.length === 1 ? 'atividade' : 'atividades'}`}
              size="small"
              sx={{ bgcolor: 'rgba(0, 180, 216, 0.15)', color: '#00b4d8', fontWeight: 800, fontSize: '0.68rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={activityViewLayout === 'focus' ? 'contained' : 'outlined'}
              onClick={() => setActivityViewLayout('focus')}
              sx={{
                borderRadius: 2.5,
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.6,
                px: 1.8,
                bgcolor: activityViewLayout === 'focus' ? '#00b4d8' : 'transparent',
                borderColor: 'rgba(0, 180, 216, 0.4)',
                color: activityViewLayout === 'focus' ? '#fff' : '#00b4d8',
                boxShadow: activityViewLayout === 'focus' ? '0 2px 10px rgba(0,180,216,0.3)' : 'none',
                '&:hover': { bgcolor: activityViewLayout === 'focus' ? '#0096c7' : 'rgba(0,180,216,0.1)' }
              }}
            >
              ⬅️ ➡️ Passando pro Lado
            </Button>
            <Button
              size="small"
              variant={activityViewLayout === 'list' ? 'contained' : 'outlined'}
              onClick={() => setActivityViewLayout('list')}
              sx={{
                borderRadius: 2.5,
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'none',
                py: 0.6,
                px: 1.8,
                bgcolor: activityViewLayout === 'list' ? '#00b4d8' : 'transparent',
                borderColor: 'rgba(255,255,255,0.2)',
                color: activityViewLayout === 'list' ? '#fff' : 'rgba(255,255,255,0.6)',
                '&:hover': { bgcolor: activityViewLayout === 'list' ? '#0096c7' : 'rgba(255,255,255,0.06)' }
              }}
            >
              📑 Ver Todas
            </Button>
          </Box>
        </Box>

        {activityViewLayout === 'focus' ? (
          <Box sx={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Top Carousel Navigation Toolbar */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2.5,
              p: 2,
              borderRadius: 3.5,
              background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.12), rgba(13, 27, 42, 0.8))',
              border: '1px solid rgba(0, 180, 216, 0.3)',
              gap: 1.5,
              flexWrap: 'wrap',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <Button
                variant="outlined"
                disabled={safeFocusIdx === 0}
                onClick={() => setFocusActivityIdx(prev => Math.max(0, prev - 1))}
                sx={{
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: 'none',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.25)',
                  px: 2.5,
                  py: 0.8,
                  fontSize: '0.85rem',
                  '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0,180,216,0.1)' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.05)' }
                }}
              >
                ⬅️ Anterior
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.6 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff', fontSize: '0.94rem' }}>
                  Atividade {safeFocusIdx + 1} de {exercises.length}
                </Typography>
                {/* Mini dot indicators */}
                <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center', maxWidth: { xs: 200, sm: 360 }, overflowX: 'auto', py: 0.5 }}>
                  {exercises.map((p, i) => {
                    const isCur = i === safeFocusIdx;
                    const isComp = p.status === 'completed';
                    return (
                      <Box
                        key={p.id}
                        onClick={() => setFocusActivityIdx(i)}
                        sx={{
                          width: isCur ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: isCur ? '#00b4d8' : isComp ? '#48c78e' : 'rgba(255,255,255,0.15)',
                          boxShadow: isCur ? '0 0 10px rgba(0,180,216,0.8)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          flexShrink: 0,
                          '&:hover': { transform: 'scale(1.25)' }
                        }}
                        title={`Ir para atividade ${i + 1}: ${p.exercise?.title || ''}`}
                      />
                    );
                  })}
                </Box>
              </Box>

              <Button
                variant="contained"
                disabled={safeFocusIdx >= exercises.length - 1}
                onClick={() => setFocusActivityIdx(prev => Math.min(exercises.length - 1, prev + 1))}
                sx={{
                  borderRadius: 3,
                  fontWeight: 800,
                  textTransform: 'none',
                  bgcolor: '#00b4d8',
                  color: '#fff',
                  px: 2.5,
                  py: 0.8,
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 15px rgba(0,180,216,0.3)',
                  '&:hover': { bgcolor: '#0096c7' },
                  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
                }}
              >
                Próxima Atividade ➡️
              </Button>
            </Box>

            {/* Render the single active card - auto opened so student doesn't need to click or scroll */}
            {exercises[safeFocusIdx] && (
              <Box key={exercises[safeFocusIdx].id} sx={{ animation: 'fadeIn 0.25s ease' }}>
                {renderActivityCard(exercises[safeFocusIdx], safeFocusIdx, true)}
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            {exercises.map((p, idx) => (
              <Box key={p.id} sx={{ mb: 2 }}>
                {renderActivityCard(p, idx)}
              </Box>
            ))}
          </Box>
        )}
      </Box>
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
                  src="/quest_english_logo.svg"
                  alt="Quest English"
                  style={{
                    height: '42px',
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
                    bgcolor: dashboardTab === 1 ? 'rgba(72, 199, 142, 0.12)' : 'transparent',
                    border: `1px solid ${dashboardTab === 1 ? 'rgba(72, 199, 142, 0.25)' : 'transparent'}`,
                    color: dashboardTab === 1 ? '#48c78e' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(72, 199, 142, 0.08)',
                      color: '#48c78e'
                    }
                  }}
                  startIcon={<EventAvailableIcon />}
                >
                  Histórico
                </Button>
                <Button
                  onClick={() => setDashboardTab(2)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: dashboardTab === 2 ? 'rgba(255, 183, 77, 0.12)' : 'transparent',
                    border: `1px solid ${dashboardTab === 2 ? 'rgba(255, 183, 77, 0.25)' : 'transparent'}`,
                    color: dashboardTab === 2 ? '#ffb74d' : 'rgba(255,255,255,0.6)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 183, 77, 0.08)',
                      color: '#ffb74d'
                    }
                  }}
                  startIcon={<EmojiEventsIcon />}
                >
                  Ranking
                </Button>
                <Button
                  onClick={() => setDashboardTab(3)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: dashboardTab === 3 ? 'rgba(179, 136, 255, 0.15)' : 'transparent',
                    border: `1px solid ${dashboardTab === 3 ? 'rgba(179, 136, 255, 0.35)' : 'transparent'}`,
                    color: dashboardTab === 3 ? '#b388ff' : 'rgba(255,255,255,0.6)',
                    fontWeight: 800,
                    '&:hover': {
                      bgcolor: 'rgba(179, 136, 255, 0.1)',
                      color: '#b388ff'
                    }
                  }}
                  startIcon={<MenuBookIcon />}
                >
                  Biblioteca
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
                      minWidth: 180
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
                    style={{ fontWeight: 700, color: dashboardTab === 1 ? '#48c78e' : '#fff', gap: 10 }}
                  >
                    <EventAvailableIcon fontSize="small" /> Histórico
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { setDashboardTab(2); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: dashboardTab === 2 ? '#ffb74d' : '#fff', gap: 10 }}
                  >
                    <EmojiEventsIcon fontSize="small" /> Ranking
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { setDashboardTab(3); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: dashboardTab === 3 ? '#b388ff' : '#fff', gap: 10 }}
                  >
                    <MenuBookIcon fontSize="small" /> Biblioteca
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { setStreakRulesOpen(true); handleCloseMenu(); }}
                    style={{ fontWeight: 700, color: '#ffd426', gap: 10 }}
                  >
                    <StarIcon fontSize="small" /> Regras de Moedas
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

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: { xs: 12, md: 6 } }}>
          {penaltyMessage && (
            <Alert 
              severity="warning" 
              onClose={() => setPenaltyMessage('')}
              sx={{ 
                mb: 4, 
                borderRadius: 4, 
                fontWeight: 800,
                border: '1px solid rgba(255, 152, 0, 0.3)',
                bgcolor: 'rgba(255, 152, 0, 0.12)',
                color: '#ff9800',
                '& .MuiAlert-icon': { color: '#ff9800' }
              }}
            >
              {penaltyMessage}
            </Alert>
          )}
          {/* TAB 0: ACTIVITIES WITH PROFILE SIDEBAR */}
          {dashboardTab === 0 && (
            <Grid container spacing={4}>
              
              {/* LEFT COLUMN: Student Profile & Gamification Stats */}
              <Grid size={{ xs: 12, md: 4 }}>
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
                    <Box sx={{ mb: 2 }}>
                      <StudentAvatar editable={true} size={90} totalCoins={totalCoins} onSpendCoins={handleSpendCoins} userId={user?.id} onPurchaseUtility={handlePurchaseUtility} />
                    </Box>
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
                    {/* Stats side-by-side */}
                    <Box sx={{ display: 'flex', gap: 1.5, width: '100%', mb: 2 }}>
                      {/* Ofensiva (clicável para ver regras) */}
                      <Box
                        onClick={() => setStreakRulesOpen(true)}
                        role="button"
                        title="Clique para ver as regras de ofensiva!"
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: isStreakFrozen ? 'rgba(0, 180, 216, 0.08)' : 'rgba(255, 112, 67, 0.08)',
                          border: isStreakFrozen ? '1px solid rgba(0, 180, 216, 0.25)' : '1px solid rgba(255, 112, 67, 0.25)',
                          borderRadius: 3.5,
                          p: 1.5,
                          cursor: 'pointer',
                          boxShadow: isStreakFrozen ? '0 0 15px rgba(0, 180, 216, 0.08)' : '0 0 15px rgba(255, 112, 67, 0.08)',
                          animation: 'fadeIn 0.6s ease',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            borderColor: isStreakFrozen ? '#00b4d8' : '#ff7043'
                          }
                        }}
                      >
                        <FireIcon sx={{ color: isStreakFrozen ? '#00b4d8' : '#ff7043', fontSize: 24 }} />
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: isStreakFrozen ? '#00b4d8' : '#ff7043', lineHeight: 1.1 }}>
                            {backendStreak} {backendStreak === 1 ? 'dia' : 'dias'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isStreakFrozen ? 'rgba(0, 180, 216, 0.7)' : 'rgba(255, 112, 67, 0.7)', fontWeight: 800, display: 'block', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Ofensiva {isStreakFrozen && '(Salva)'}
                          </Typography>
                        </Box>
                        {isStreakFrozen && (
                          <Box sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            bgcolor: '#00b4d8',
                            color: '#fff',
                            borderRadius: '50%',
                            width: 18,
                            height: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            boxShadow: '0 0 8px rgba(0,180,216,0.6)',
                            animation: 'pulse 2s infinite ease-in-out',
                            '@keyframes pulse': {
                              '0%, 100%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.2)' }
                            }
                          }} title="Protetor de Ofensiva Ativo! ❄️">
                            ❄️
                          </Box>
                        )}
                      </Box>

                      {/* Aulas Ativas */}
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: 'rgba(0, 180, 216, 0.08)',
                        border: '1px solid rgba(0, 180, 216, 0.25)',
                        borderRadius: 3.5,
                        p: 1.5,
                        boxShadow: '0 0 15px rgba(0, 180, 216, 0.08)',
                        animation: 'fadeIn 0.6s ease'
                      }}>
                        <EventAvailableIcon sx={{ color: '#00b4d8', fontSize: 24 }} />
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#00b4d8', lineHeight: 1.1 }}>
                            {attendanceRecords.length}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(0, 180, 216, 0.7)', fontWeight: 800, display: 'block', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Aulas Ativas
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Pixel Coin Box (clicável para ver regras) */}
                    <Box
                      onClick={() => setStreakRulesOpen(true)}
                      role="button"
                      title="Clique para ver como ganhar mais moedas!"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        bgcolor: 'rgba(255, 215, 0, 0.1)',
                        border: '2px solid rgba(255, 215, 0, 0.4)',
                        borderRadius: 3.5,
                        px: 3,
                        py: 1,
                        width: '100%',
                        boxSizing: 'border-box',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.15), inset 0 0 10px rgba(255,215,0,0.1)',
                        animation: 'fadeIn 0.7s ease',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                        }
                      }}
                    >
                      <svg width="36" height="36" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))' }}>
                        <path d="M5 2H11V4H13V6H14V10H13V12H11V14H5V12H3V10H2V6H3V4H5V2Z" fill="#ffaa00"/>
                        <path d="M6 4H10V6H11V10H10V12H6V10H5V6H6V4Z" fill="#ffd426"/>
                        <path d="M7 6H9V10H7V6Z" fill="#fff490"/>
                      </svg>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h5" sx={{ fontWeight: 950, color: '#ffd426', lineHeight: 1.1, textShadow: '0px 2px 2px rgba(0,0,0,0.5)' }}>
                          {totalCoins}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 215, 0, 0.8)', fontWeight: 800, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                          Moedas
                        </Typography>
                      </Box>
                    </Box>

                    {/* Botão Conquistas */}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<MedalIcon sx={{ color: '#b388ff' }} />}
                      onClick={() => setAchievementsOpen(true)}
                      sx={{
                        mt: 2,
                        py: 1.1,
                        borderRadius: 3.5,
                        borderColor: 'rgba(179, 136, 255, 0.35)',
                        color: '#b388ff',
                        fontWeight: 800,
                        textTransform: 'none',
                        fontSize: '0.88rem',
                        background: 'rgba(179, 136, 255, 0.06)',
                        '&:hover': {
                          borderColor: '#b388ff',
                          background: 'rgba(179, 136, 255, 0.15)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      🏆 Ver Minhas Conquistas
                    </Button>

                    <Button
                      fullWidth
                      size="small"
                      onClick={() => setStreakRulesOpen(true)}
                      sx={{
                        mt: 0.8,
                        color: 'rgba(255, 215, 0, 0.75)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': {
                          color: '#ffd426',
                          background: 'transparent'
                        }
                      }}
                    >
                      🎯 Regras de Ofensiva e Moedas
                    </Button>
                  </Box>
                </Card>

                {/* Gamified Level / XP Tracker Card */}
                <Card sx={{ p: 2.5, borderRadius: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: '#00b4d8', fontSize: 20 }} />
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
                        fontSize: '0.72rem'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>XP do Nível</Typography>
                      <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 900 }}>{xpInCurrentLevel} / {xpPerLevel} XP</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={levelPercent}
                      sx={{
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                </Card>

              </Box>
            </Grid>

            {/* RIGHT COLUMN: Activities View */}
            <Grid size={{ xs: 12, md: 8 }}>
              <ErrorBoundary>
                <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                  
                  {/* Title and stats bar with View Mode Switcher */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3.5 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
                        📚 Atividades Atribuídas
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                        Seu caminho de aprendizado personalizado.
                      </Typography>
                    </Box>

                    {assignedExercises.length > 0 && (
                      <Box sx={{
                        display: 'inline-flex',
                        bgcolor: 'rgba(0, 0, 0, 0.25)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 4,
                        p: 0.5,
                        alignSelf: { xs: 'flex-start', sm: 'auto' }
                      }}>
                        <Button
                          size="small"
                          onClick={() => { setViewMode('rpg'); setActivityTab(0); }}
                          sx={{
                            borderRadius: 3.5,
                            px: 2.5,
                            py: 0.8,
                            bgcolor: viewMode === 'rpg' ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                            color: viewMode === 'rpg' ? '#00b4d8' : 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 800,
                            '&:hover': { bgcolor: viewMode === 'rpg' ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)' }
                          }}
                          startIcon={<span>🗺️</span>}
                        >
                          Caminho RPG
                        </Button>
                        <Button
                          size="small"
                          onClick={() => { setViewMode('list'); setActivityTab(0); }}
                          sx={{
                            borderRadius: 3.5,
                            px: 2.5,
                            py: 0.8,
                            bgcolor: viewMode === 'list' ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                            color: viewMode === 'list' ? '#00b4d8' : 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 800,
                            '&:hover': { bgcolor: viewMode === 'list' ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)' }
                          }}
                          startIcon={<span>📋</span>}
                        >
                          Lista
                        </Button>
                        <Button
                          size="small"
                          onClick={() => { setViewMode('speaking'); setActivityTab(0); }}
                          sx={{
                            borderRadius: 3.5,
                            px: 2.5,
                            py: 0.8,
                            bgcolor: viewMode === 'speaking' ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                            color: viewMode === 'speaking' ? '#00b4d8' : 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 800,
                            '&:hover': { bgcolor: viewMode === 'speaking' ? 'rgba(0, 180, 216, 0.2)' : 'rgba(255,255,255,0.05)' }
                          }}
                          startIcon={<span>🎙️</span>}
                        >
                          Pronúncia
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {/* Daily Lesson Calendar & Midnight Rotation Bar */}
                  <Box sx={{
                    mb: 3.5,
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: 'rgba(13, 27, 42, 0.65)',
                    border: '1.5px solid rgba(0, 180, 216, 0.2)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)'
                  }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <CalendarMonthIcon sx={{ color: '#00b4d8', fontSize: 24 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                            Cronograma de Aulas Diárias
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                            Nova aula liberada todo dia à meia-noite (00:00). Clique nos dias anteriores para rever o conteúdo!
                          </Typography>
                        </Box>
                      </Box>

                      {countdownToMidnight && (
                        <Chip
                          icon={<AccessTimeIcon sx={{ fontSize: '15px !important', color: '#ffd426 !important' }} />}
                          label={`Próxima aula em ${countdownToMidnight}`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 212, 38, 0.12)',
                            color: '#ffd426',
                            fontWeight: 800,
                            border: '1px solid rgba(255, 212, 38, 0.3)',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>

                    {/* Days Horizontal Timeline Bar */}
                    <Box sx={{
                      display: 'flex',
                      gap: 1.5,
                      overflowX: 'auto',
                      pb: 1,
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }
                    }}>
                      {weekCalendarDays.map((day) => {
                        const isSelected = selectedDayOffset === day.offset;
                        let borderColor = 'rgba(255,255,255,0.08)';
                        let bgColor = 'rgba(255,255,255,0.02)';
                        let textColor = 'rgba(255,255,255,0.7)';

                        if (isSelected) {
                          borderColor = day.isToday ? '#00b4d8' : '#7c4dff';
                          bgColor = day.isToday ? 'rgba(0, 180, 216, 0.18)' : 'rgba(124, 77, 255, 0.18)';
                          textColor = '#fff';
                        } else if (day.isToday) {
                          borderColor = 'rgba(0, 180, 216, 0.4)';
                          bgColor = 'rgba(0, 180, 216, 0.08)';
                        } else if (day.isFuture) {
                          borderColor = 'rgba(255,255,255,0.05)';
                          bgColor = 'rgba(0,0,0,0.2)';
                        }

                        return (
                          <Box
                            key={day.offset}
                            onClick={() => {
                              if (day.isFuture) return;
                              setSelectedDayOffset(day.offset);
                              if (day.lesson?.moduleId) {
                                setRpgModuleId(day.lesson.moduleId);
                              }
                            }}
                            sx={{
                              minWidth: { xs: 72, sm: 84 },
                              p: 1.2,
                              borderRadius: 3.5,
                              textAlign: 'center',
                              bgcolor: bgColor,
                              border: `1.5px solid ${borderColor}`,
                              cursor: day.isFuture ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: day.isFuture ? 0.45 : 1,
                              transform: isSelected ? 'scale(1.04)' : 'none',
                              boxShadow: isSelected ? `0 0 16px ${day.isToday ? 'rgba(0,180,216,0.3)' : 'rgba(124,77,255,0.3)'}` : 'none',
                              '&:hover': !day.isFuture ? {
                                transform: 'translateY(-2px)',
                                borderColor: day.isToday ? '#00b4d8' : '#7c4dff'
                              } : {}
                            }}
                          >
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: day.isToday ? '#00b4d8' : 'rgba(255,255,255,0.45)' }}>
                              {day.dayName}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 950, color: textColor, my: 0.2, lineHeight: 1.2 }}>
                              {day.dayNumber}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>
                              {day.monthName}
                            </Typography>

                            {day.isToday ? (
                              <Chip
                                size="small"
                                label="Hoje"
                                sx={{
                                  height: 16,
                                  fontSize: '0.6rem',
                                  fontWeight: 900,
                                  bgcolor: '#00b4d8',
                                  color: '#071018',
                                  mt: 0.6,
                                  px: 0.3
                                }}
                              />
                            ) : day.isFuture ? (
                              <Box sx={{ mt: 0.6, display: 'flex', justifyContent: 'center' }}>
                                <LockIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }} />
                              </Box>
                            ) : (
                              <Box sx={{ mt: 0.6, display: 'flex', justifyContent: 'center' }}>
                                <CheckCircleIcon sx={{ fontSize: 13, color: '#48c78e' }} />
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Selected Day Content Preview Banner */}
                    {(() => {
                      const selectedDay = weekCalendarDays.find(d => d.offset === selectedDayOffset) || weekCalendarDays.find(d => d.isToday);
                      if (!selectedDay) return null;

                      return (
                        <Box sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          gap: 2
                        }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Chip
                                size="small"
                                label={selectedDay.isToday ? 'Aula de Hoje' : `Aula Passada (${selectedDay.dayName} ${selectedDay.dayNumber})`}
                                sx={{
                                  bgcolor: selectedDay.isToday ? 'rgba(0,180,216,0.15)' : 'rgba(124,77,255,0.15)',
                                  color: selectedDay.isToday ? '#00b4d8' : '#b388ff',
                                  fontWeight: 800,
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#fff' }}>
                                {selectedDay.lesson?.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
                              {selectedDay.lesson?.desc} {selectedDay.isToday ? '• Faça os exercícios para manter a ofensiva 🔥!' : '• Você pode folhear os slides explicativos e refazer exercícios desta data.'}
                            </Typography>
                          </Box>

                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              if (selectedDay.lesson?.moduleId) {
                                setRpgModuleId(selectedDay.lesson.moduleId);
                              }
                              setExplanationPage(0);
                              setOpenExplanationDialog(true);
                            }}
                            sx={{
                              flexShrink: 0,
                              borderRadius: 3,
                              px: 2.2,
                              py: 0.8,
                              fontWeight: 900,
                              textTransform: 'none',
                              fontSize: '0.82rem',
                              background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                              color: '#fff',
                              boxShadow: '0 3px 12px rgba(0, 180, 216, 0.3)',
                              '&:hover': { background: 'linear-gradient(90deg, #00c8f0, #9c27b0)' }
                            }}
                            startIcon={<MenuBookIcon />}
                          >
                            📖 Ver Slide desta Aula (10 Páginas)
                          </Button>
                        </Box>
                      );
                    })()}
                  </Box>

                  {/* General Progress Bar */}
                  {assignedExercises.length > 0 && (
                    <Box sx={{ mb: 4, bgcolor: 'rgba(13, 27, 42, 0.3)', p: 2, borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800 }}>Progresso de Conclusão Geral</Typography>
                        <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 900 }}>{progressPercent}% ({completedCount} de {assignedExercises.length} concluídas)</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#48c78e',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Empty state or list views */}
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
                  ) : viewMode === 'rpg' ? (
                    <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                      {/* Module Tabs (Módulo 1 - 10) */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1.5, 
                        overflowX: 'auto', 
                        pb: 1.5, 
                        mb: 6,
                        px: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 5,
                        p: 1.5,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }
                      }}>
                        {MODULES.map((mod, index) => {
                          const isUnlocked = isModuleUnlocked(assignedExercises, mod.id);
                          const isActive = rpgModuleId === mod.id;
                          const modColor = MODULE_COLORS[index % MODULE_COLORS.length];
                          
                          return (
                            <Button
                              key={mod.id}
                              variant={isActive ? 'contained' : 'outlined'}
                              onClick={() => {
                                if (!isUnlocked) {
                                  alert(`Este módulo está bloqueado! Conclua o ${MODULES[mod.id - 2].name.split(':')[0]} para desbloquear. 🔒`);
                                  return;
                                }
                                setRpgModuleId(mod.id);
                              }}
                              sx={{
                                minWidth: 180,
                                flexShrink: 0,
                                borderRadius: 4,
                                fontWeight: 800,
                                py: 1.5,
                                fontSize: '0.8rem',
                                bgcolor: isActive ? modColor : 'transparent',
                                borderColor: isActive ? modColor : isUnlocked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                                color: isActive ? '#000' : isUnlocked ? '#fff' : 'rgba(255,255,255,0.25)',
                                boxShadow: isActive ? `0 4px 15px ${modColor}40` : 'none',
                                opacity: isUnlocked ? 1 : 0.5,
                                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                '&:hover': { 
                                  bgcolor: isActive ? modColor : isUnlocked ? 'rgba(255,255,255,0.05)' : 'transparent',
                                  borderColor: isActive ? modColor : 'rgba(255,255,255,0.1)'
                                }
                              }}
                              startIcon={<span>{isUnlocked ? '🎒' : '🔒'}</span>}
                            >
                              {mod.name.split(':')[0]}
                            </Button>
                          );
                        })}
                      </Box>

                      {/* Lives and Lockout Indicator Panel */}
                      {(() => {
                        checkAndResetLock(rpgModuleId);
                        const remaining = getRemainingLockSeconds(rpgModuleId);
                        const attempts = getModuleAttempts(rpgModuleId);
                        const lives = Math.max(0, 4 - attempts);
                        const moduleName = MODULES.find(m => m.id === rpgModuleId)?.name || `Módulo ${rpgModuleId}`;
                        
                        return (
                          <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            p: 2.5,
                            mb: 4,
                            borderRadius: 4,
                            background: remaining > 0 
                              ? 'linear-gradient(135deg, rgba(239, 83, 80, 0.15) 0%, rgba(13, 27, 42, 0.8) 100%)' 
                              : 'linear-gradient(135deg, rgba(0, 180, 216, 0.1) 0%, rgba(13, 27, 42, 0.8) 100%)',
                            border: `1px solid ${remaining > 0 ? 'rgba(239, 83, 80, 0.4)' : 'rgba(0, 180, 216, 0.25)'}`,
                            boxShadow: remaining > 0 
                              ? '0 8px 32px rgba(239, 83, 80, 0.15)' 
                              : '0 8px 32px rgba(0, 180, 216, 0.08)',
                            backdropFilter: 'blur(10px)',
                            animation: 'fadeIn 0.4s ease'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography fontSize={32}>
                                {remaining > 0 ? '🔒' : '🎯'}
                              </Typography>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff' }}>
                                  {moduleName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.2 }}>
                                  {remaining > 0 
                                    ? 'Acesso bloqueado temporariamente por esgotar as tentativas.' 
                                    : 'Conclua cada etapa com 100% de acertos para avançar.'}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              {remaining > 0 ? (
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="caption" sx={{ color: '#ef5350', fontWeight: 900, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                                    ⏳ Liberação em
                                  </Typography>
                                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#ef5350', letterSpacing: 1, fontFamily: 'monospace' }}>
                                    {(() => {
                                      const mins = Math.floor(remaining / 60);
                                      const secs = remaining % 60;
                                      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                                    })()}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' } }}>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', mb: 0.5 }}>
                                    Vidas Disponíveis
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                      <Typography key={i} fontSize={22} sx={{ 
                                        animation: i < lives ? 'pulseHeart 2s infinite ease-in-out' : 'none',
                                        '@keyframes pulseHeart': {
                                          '0%, 100%': { transform: 'scale(1)' },
                                          '50%': { transform: 'scale(1.15)' }
                                        },
                                        opacity: i < lives ? 1 : 0.25,
                                        filter: i < lives ? 'drop-shadow(0 0 6px rgba(239,83,80,0.6))' : 'none'
                                      }}>
                                        ❤️
                                      </Typography>
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        );
                      })()}

                      {/* RPG Road Map Map wrapper */}
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        py: 12,
                        px: { xs: 2, sm: 6 },
                        gap: 12,
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        minHeight: '600px',
                        // Center vertical line representing the winding road track
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          width: '8px',
                          background: `linear-gradient(180deg, ${MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length]}aa 0%, rgba(13, 27, 42, 0.2) 100%)`,
                          borderLeft: '2px dashed rgba(255, 255, 255, 0.2)',
                          zIndex: 0
                        }
                      }}>
                        {(() => {
                          const moduleExercises = assignedExercises.filter(p => p.exercise?.isRpg && getModuleIdForExercise(p.exercise) === rpgModuleId);
                          const sortedRpgExercises = [...moduleExercises].sort((a, b) => a.exerciseId - b.exerciseId);
                          const isExplanationCompleted = completedExplanations[rpgModuleId] === true;
                          let activeStepType = 'explanation'; // 'explanation' | 'exercise' | 'completed_all'
                          let activeExerciseId = null;

                          if (!isExplanationCompleted) {
                            activeStepType = 'explanation';
                          } else {
                            const nextPending = sortedRpgExercises.find(p => !isRpgExerciseCompleted(p));
                            if (nextPending) {
                              activeStepType = 'exercise';
                              activeExerciseId = nextPending.id;
                            } else {
                              activeStepType = 'completed_all';
                            }
                          }

                          // Define unified nodes list: explanation + exercises
                          const nodes = [
                            {
                              type: 'explanation',
                              id: `explanation-${rpgModuleId}`,
                              title: 'Explicação & Exemplos',
                              isCompleted: isExplanationCompleted,
                              isLocked: false,
                              isActive: activeStepType === 'explanation',
                            },
                            ...sortedRpgExercises.map((p, index) => {
                              const isCompleted = isRpgExerciseCompleted(p);
                              const isLocked = index === 0 ? !isExplanationCompleted : !isRpgExerciseCompleted(sortedRpgExercises[index - 1]);
                              const isActive = activeStepType === 'exercise' && activeExerciseId === p.id;
                              return {
                                type: 'exercise',
                                id: p.id,
                                title: p.exercise?.title || `Atividade ${index + 1}`,
                                isCompleted,
                                isLocked,
                                isActive,
                                progressEntry: p
                              };
                            })
                          ];

                          return nodes.map((node, index) => {
                            const offset = (index % 4 === 0) ? -120 : (index % 4 === 2) ? 120 : 0;
                            const isCompleted = node.isCompleted;
                            const isActive = node.isActive;
                            const isLocked = node.isLocked;
                            const isModuleLockedByTimer = getRemainingLockSeconds(rpgModuleId) > 0;

                            return (
                              <Box
                                key={node.id}
                                sx={{
                                  position: 'relative',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  transform: {
                                    xs: `translateX(${offset * 0.4}px)`,
                                    sm: `translateX(${offset}px)`
                                  },
                                  zIndex: 1,
                                  transition: 'all 0.3s'
                                }}
                              >
                                {/* Floating customized Character Token over the active node */}
                                {isActive && !isModuleLockedByTimer && (
                                  <Box sx={{
                                    position: 'absolute',
                                    top: -85,
                                    zIndex: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    animation: 'bobAnimation 2.2s infinite ease-in-out',
                                    '@keyframes bobAnimation': {
                                      '0%, 100%': { transform: 'translateY(0)' },
                                      '50%': { transform: 'translateY(-10px)' }
                                    }
                                  }}>
                                    <StudentAvatar editable={false} size={58} userId={user?.id} />
                                    <Typography variant="caption" sx={{
                                      bgcolor: MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length],
                                      color: '#000',
                                      px: 1.2,
                                      py: 0.3,
                                      borderRadius: 2,
                                      fontWeight: 900,
                                      fontSize: '0.65rem',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                      mt: 0.6,
                                      whiteSpace: 'nowrap',
                                      border: '1px solid rgba(255,255,255,0.15)'
                                    }}>
                                      Você está aqui 🚩
                                    </Typography>
                                  </Box>
                                )}

                                {/* Node Circle */}
                                <Box
                                  onClick={() => {
                                    if (isModuleLockedByTimer) {
                                      alert(`Módulo bloqueado temporariamente! Aguarde o temporizador expirar (${Math.floor(getRemainingLockSeconds(rpgModuleId) / 60)} min restantes) para tentar novamente. 🔒`);
                                      return;
                                    }
                                    if (isLocked) {
                                      alert('Conclua os passos anteriores para progredir no caminho! 🔒');
                                      return;
                                    }
                                    if (node.type === 'explanation') {
                                      setOpenExplanationDialog(true);
                                    } else {
                                      setActiveFocusExercise(node.progressEntry);
                                    }
                                  }}
                                  sx={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: (isLocked || isModuleLockedByTimer) ? 'not-allowed' : 'pointer',
                                    background: isCompleted
                                      ? 'linear-gradient(135deg, #48c78e 0%, #2e7d32 100%)'
                                      : isActive && !isModuleLockedByTimer
                                      ? `linear-gradient(135deg, ${MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length]} 0%, rgba(13, 27, 42, 0.9) 100%)`
                                      : (isLocked || isModuleLockedByTimer)
                                      ? '#1e293b'
                                      : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                                    border: `4px solid ${
                                      isCompleted 
                                        ? '#48c78e' 
                                        : isActive && !isModuleLockedByTimer
                                        ? MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length] 
                                        : (isLocked || isModuleLockedByTimer)
                                        ? 'rgba(255,255,255,0.06)' 
                                        : '#475569'
                                    }`,
                                    boxShadow: isCompleted
                                      ? '0 0 15px rgba(72, 199, 142, 0.4)'
                                      : isActive && !isModuleLockedByTimer
                                      ? `0 0 25px ${MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length]}90`
                                      : 'none',
                                    '&:hover': {
                                      transform: (isLocked || isModuleLockedByTimer) ? 'none' : 'scale(1.1)',
                                      boxShadow: (isLocked || isModuleLockedByTimer)
                                        ? 'none' 
                                        : isCompleted 
                                        ? '0 0 25px rgba(72, 199, 142, 0.6)' 
                                        : `0 0 30px ${MODULE_COLORS[(rpgModuleId - 1) % MODULE_COLORS.length]}cc`
                                    },
                                    opacity: isModuleLockedByTimer ? 0.45 : 1,
                                    transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                  }}
                                >
                                  {isCompleted ? (
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff' }}>✓</Typography>
                                  ) : isLocked ? (
                                    <span style={{ fontSize: '1.25rem', opacity: 0.3 }}>🔒</span>
                                  ) : node.type === 'explanation' ? (
                                    <span style={{ fontSize: '1.4rem' }}>📖</span>
                                  ) : (
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff' }}>{index}</Typography>
                                  )}
                                </Box>

                                {/* Step Label */}
                                <Box sx={{
                                  mt: 1.5,
                                  textAlign: 'center',
                                  maxWidth: '160px',
                                  bgcolor: isLocked ? 'rgba(15, 23, 42, 0.4)' : 'rgba(13, 27, 42, 0.75)',
                                  p: '6px 12px',
                                  borderRadius: 3.5,
                                  border: isLocked ? '1px solid rgba(255,255,255,0.02)' : '1px solid rgba(255,255,255,0.06)',
                                  backdropFilter: 'blur(8px)',
                                  boxShadow: isActive ? '0 4px 15px rgba(0,0,0,0.3)' : 'none'
                                }}>
                                  <Typography variant="caption" sx={{
                                    fontWeight: 800,
                                    color: isLocked ? 'rgba(255,255,255,0.3)' : '#fff',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    fontSize: '0.72rem',
                                    lineHeight: 1.2
                                  }}>
                                    {node.type === 'explanation' ? 'Explicação & Exemplos' : node.title.replace(/M\d+\.\d+:\s*/, '')}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          });
                        })()}
                      </Box>
                    </Box>
                  ) : viewMode === 'speaking' ? (
                    <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                      {/* Grid of speaking modules (horizontal scroll on mobile, grid on desktop) */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: { xs: 'nowrap', md: 'wrap' },
                        gap: 3,
                        overflowX: { xs: 'auto', md: 'visible' },
                        pb: { xs: 2.5, md: 0 },
                        mb: 6,
                        scrollSnapType: { xs: 'x mandatory', md: 'none' },
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 3 },
                        // Sizing children items
                        '& > div': {
                          width: { xs: '280px', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                          flexShrink: 0,
                          scrollSnapAlign: 'start'
                        }
                      }}>
                        {SPEAKING_MODULES_METADATA.map((mod) => {
                          const moduleAll = speakingExercises.filter(p => getSpeakingCategory(p.exercise) === mod.id);
                          const moduleCompleted = moduleAll.filter(p => p.status === 'completed');
                          const moduleCount = moduleAll.length;
                          const completedCountForMod = moduleCompleted.length;
                          const percentForMod = moduleCount > 0 ? Math.round((completedCountForMod / moduleCount) * 100) : 0;
                          
                          const isActive = speakingCategory === mod.id;
                          
                          return (
                            <Box key={mod.id}>
                              <Card 
                                onClick={() => {
                                  setSpeakingCategory(mod.id);
                                  setActivityTab(0);
                                  // Auto-scroll to exercise list on mobile smoothly
                                  setTimeout(() => {
                                    speakingExercisesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }, 100);
                                }}
                                sx={{
                                  p: 3,
                                  cursor: 'pointer',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  transition: 'all 0.3s ease',
                                  background: isActive 
                                    ? `linear-gradient(135deg, rgba(0, 180, 216, 0.12) 0%, rgba(72, 199, 142, 0.05) 100%)` 
                                    : 'rgba(255, 255, 255, 0.02)',
                                  border: isActive 
                                    ? `2px solid ${mod.color}` 
                                    : '1px solid rgba(255,255,255,0.06)',
                                  boxShadow: isActive 
                                    ? `0 8px 30px rgba(0, 180, 216, 0.15)` 
                                    : 'none',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    border: isActive ? `2px solid ${mod.color}` : '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: `0 8px 30px rgba(0,0,0,0.3)`
                                  }
                                }}
                              >
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Box sx={{ 
                                      fontSize: 26, 
                                      p: 1, 
                                      borderRadius: 3.5, 
                                      bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center' 
                                    }}>
                                      {mod.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                                      {mod.name}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3.5, fontSize: '0.8rem', lineHeight: 1.4 }}>
                                    {mod.desc}
                                  </Typography>
                                </Box>
                                
                                <Box>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8, alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Conclusão</Typography>
                                    <Typography variant="caption" sx={{ color: percentForMod === 100 ? '#48c78e' : '#00b4d8', fontWeight: 800 }}>
                                      {completedCountForMod}/{moduleCount} ({percentForMod}%)
                                    </Typography>
                                  </Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={percentForMod} 
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      bgcolor: 'rgba(255,255,255,0.05)',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: percentForMod === 100 ? '#48c78e' : mod.color,
                                        borderRadius: 3
                                      }
                                    }}
                                  />
                                </Box>
                              </Card>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* Header for selected module */}
                      <Box ref={speakingExercisesRef} sx={{ 
                        mb: 4, 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' }, 
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', md: 'center' }, 
                        gap: 2 
                      }}>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                            {SPEAKING_MODULES_METADATA.find(m => m.id === speakingCategory)?.icon} Módulo: {speakingCategory}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
                            Treine sua fala repetindo as frases abaixo e enviando o áudio para análise instantânea.
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {[
                            { id: 0, label: 'Todas', count: totalCount, icon: '⚡' },
                            { id: 1, label: 'Pendentes', count: pendingCount, icon: '⏳' },
                            { id: 2, label: 'Concluídas', count: completedCount, icon: '✅' }
                          ].map((pill) => {
                            const isSelected = activityTab === pill.id;
                            return (
                              <Chip
                                key={pill.id}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <span>{pill.icon}</span>
                                    <span>{pill.label}</span>
                                    <span style={{
                                      background: isSelected ? 'rgba(0, 180, 216, 0.35)' : 'rgba(255,255,255,0.12)',
                                      padding: '1px 7px',
                                      borderRadius: 8,
                                      fontSize: '0.68rem',
                                      fontWeight: 900
                                    }}>
                                      {pill.count}
                                    </span>
                                  </Box>
                                }
                                onClick={() => setActivityTab(pill.id)}
                                clickable
                                sx={{
                                  height: 36,
                                  borderRadius: 3,
                                  px: 0.8,
                                  fontWeight: 800,
                                  fontSize: '0.8rem',
                                  bgcolor: isSelected ? 'rgba(0, 180, 216, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                                  color: isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.7)',
                                  border: `1.5px solid ${isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.08)'}`,
                                  boxShadow: isSelected ? '0 0 15px rgba(0, 180, 216, 0.2)' : 'none',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    bgcolor: isSelected ? 'rgba(0, 180, 216, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#00b4d8'
                                  }
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>

                      {/* Search Bar */}
                      <Box sx={{ mb: 3.5, maxWidth: 450 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Buscar frase ou palavra..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#00b4d8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5 }}>
                                  ✕
                                </IconButton>
                              </InputAdornment>
                            ) : null
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 44,
                              borderRadius: 3,
                              fontSize: '0.85rem',
                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                              '&:hover fieldset': { borderColor: 'rgba(0, 180, 216, 0.4)' },
                              '&.Mui-focused fieldset': { borderColor: '#00b4d8' }
                            },
                            '& .MuiInputBase-input': { color: '#fff' }
                          }}
                        />
                      </Box>

                      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                      {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                          <CircularProgress size={40} sx={{ color: '#00b4d8' }} />
                        </Box>
                      ) : filteredExercises.length === 0 ? (
                        <Card sx={{
                          p: 6,
                          textAlign: 'center',
                          border: '1.5px dashed rgba(255,255,255,0.08)',
                          bgcolor: 'rgba(255,255,255,0.01)'
                        }}>
                          <Typography fontSize={44}>🎙️</Typography>
                          <Typography variant="body2" sx={{ color: '#b3c5d7', mt: 1, fontWeight: 700 }}>
                            Nenhum exercício de pronúncia encontrado neste filtro.
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                            Tente alternar o filtro de Concluídas/Pendentes ou limpe a pesquisa.
                          </Typography>
                        </Card>
                      ) : (
                        renderExerciseCollection(filteredExercises)
                      )}
                    </Box>
                  ) : (
                    <>
                      {/* Modern Pills Filter Bar & Search */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          overflowX: 'auto',
                          pb: 1.2,
                          mb: 2,
                          '&::-webkit-scrollbar': { height: 4 },
                          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }
                        }}>
                          {[
                            { id: 0, label: 'Todas', count: totalCount, icon: '⚡' },
                            { id: 1, label: 'Pendentes', count: pendingCount, icon: '⏳' },
                            { id: 2, label: 'Concluídas', count: completedCount, icon: '✅' },
                            { id: 3, label: 'Escritas', icon: '✍️' },
                            { id: 4, label: 'Quizzes', icon: '🧠' },
                            { id: 5, label: 'Flashcards', icon: '🎴' },
                            { id: 6, label: 'Outros', icon: '🧩' }
                          ].map((pill) => {
                            const isSelected = activityTab === pill.id;
                            return (
                              <Chip
                                key={pill.id}
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <span>{pill.icon}</span>
                                    <span>{pill.label}</span>
                                    {pill.count !== undefined && (
                                      <span style={{
                                        background: isSelected ? 'rgba(0, 180, 216, 0.35)' : 'rgba(255,255,255,0.12)',
                                        padding: '1px 7px',
                                        borderRadius: 8,
                                        fontSize: '0.68rem',
                                        fontWeight: 900
                                      }}>
                                        {pill.count}
                                      </span>
                                    )}
                                  </Box>
                                }
                                onClick={() => setActivityTab(pill.id)}
                                clickable
                                sx={{
                                  height: 36,
                                  borderRadius: 3,
                                  px: 0.8,
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  bgcolor: isSelected ? 'rgba(0, 180, 216, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                                  color: isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.7)',
                                  border: `1.5px solid ${isSelected ? '#00b4d8' : 'rgba(255, 255, 255, 0.08)'}`,
                                  boxShadow: isSelected ? '0 0 15px rgba(0, 180, 216, 0.2)' : 'none',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    bgcolor: isSelected ? 'rgba(0, 180, 216, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#00b4d8'
                                  }
                                }}
                              />
                            );
                          })}
                        </Box>

                        {/* Search bar */}
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Buscar atividade por título ou tipo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#00b4d8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5 }}>
                                  ✕
                                </IconButton>
                              </InputAdornment>
                            ) : null
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: 44,
                              borderRadius: 3,
                              fontSize: '0.85rem',
                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                              '&:hover fieldset': { borderColor: 'rgba(0, 180, 216, 0.4)' },
                              '&.Mui-focused fieldset': { borderColor: '#00b4d8' }
                            },
                            '& .MuiInputBase-input': { color: '#fff' }
                          }}
                        />
                      </Box>

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
                        renderExerciseCollection(filteredExercises)
                      )}
                    </>
                  )}
                </Box>
              </ErrorBoundary>
            </Grid>
          </Grid>
        )}

          {dashboardTab === 1 && (
            // TAB 1: CLASSROOM HUB (FULL WIDTH)
            <ClassroomHub
              user={user}
              attendanceRecords={attendanceRecords}
              onRewardEarned={({ xp, coins }) => {
                if (xp) setBonusXP(prev => prev + xp);
                if (coins) setBackendCoins(prev => prev + coins);
              }}
            />
          )}

              {dashboardTab === 2 && (
                // TAB 2: STUDENT LEADERBOARD
                <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff' }}>
                      🏆 Ranking de Alunos
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                      Veja quem está liderando a jornada com mais moedas e maiores ofensivas!
                    </Typography>
                  </Box>

                  {rankingError && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{rankingError}</Alert>}

                  <Card sx={{
                    p: { xs: 2, sm: 4 },
                    background: 'rgba(13, 27, 42, 0.35)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 5
                  }}>
                    {rankingLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={40} sx={{ color: '#ffb74d' }} />
                      </Box>
                    ) : rankingList.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography fontSize={52} sx={{ mb: 1.5 }}>🏆</Typography>
                        <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 800 }}>Nenhum aluno no ranking ainda</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {rankingList.map((student, idx) => {
                          const isCurrentUser = student.id === user?.id;
                          const rank = idx + 1;
                          let rankIcon = '';
                          let rankColor = 'rgba(255, 255, 255, 0.7)';
                          let bgGradient = 'rgba(255, 255, 255, 0.02)';
                          let borderColor = 'rgba(255, 255, 255, 0.06)';

                          if (rank === 1) {
                            rankIcon = '👑';
                            rankColor = '#ffd700'; // Gold
                            bgGradient = 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 183, 77, 0.02) 100%)';
                            borderColor = 'rgba(255, 215, 0, 0.3)';
                          } else if (rank === 2) {
                            rankIcon = '🥈';
                            rankColor = '#c0c0c0'; // Silver
                            bgGradient = 'linear-gradient(135deg, rgba(192, 192, 192, 0.08) 0%, rgba(255,255,255,0.01) 100%)';
                            borderColor = 'rgba(192, 192, 192, 0.25)';
                          } else if (rank === 3) {
                            rankIcon = '🥉';
                            rankColor = '#cd7f32'; // Bronze
                            bgGradient = 'linear-gradient(135deg, rgba(205, 127, 50, 0.08) 0%, rgba(255,255,255,0.01) 100%)';
                            borderColor = 'rgba(205, 127, 50, 0.25)';
                          }

                          if (isCurrentUser) {
                            borderColor = '#00b4d8';
                            bgGradient = 'linear-gradient(135deg, rgba(0, 180, 216, 0.08) 0%, rgba(13, 27, 42, 0.4) 100%)';
                          }

                          return (
                            <Box 
                              key={student.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 2,
                                borderRadius: 4,
                                background: bgGradient,
                                border: `1px solid ${borderColor}`,
                                transition: 'all 0.25s ease',
                                transform: isCurrentUser ? 'scale(1.01)' : 'none',
                                boxShadow: isCurrentUser ? '0 0 15px rgba(0, 180, 216, 0.15)' : 'none',
                                '&:hover': {
                                  transform: 'translateY(-2px) ' + (isCurrentUser ? 'scale(1.01)' : ''),
                                  borderColor: isCurrentUser ? '#00b4d8' : 'rgba(255,255,255,0.15)'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 900, 
                                    color: rankColor, 
                                    minWidth: 32, 
                                    textAlign: 'center' 
                                  }}
                                >
                                  {rankIcon || rank}
                                </Typography>
                                
                                <Box sx={{ position: 'relative' }}>
                                  <Avatar 
                                    src={student.avatar ? `/avatars/${student.avatar}.png` : null}
                                    sx={{ 
                                      width: 44, 
                                      height: 44, 
                                      bgcolor: isCurrentUser ? '#00b4d8' : '#7c4dff',
                                      fontSize: '1rem',
                                      fontWeight: 800,
                                      border: `1.5px solid ${isCurrentUser ? '#00b4d8' : 'rgba(255,255,255,0.1)'}`
                                    }}
                                  >
                                    {student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}
                                  </Avatar>
                                  {isCurrentUser && (
                                    <Chip 
                                      label="Você" 
                                      size="small" 
                                      sx={{ 
                                        position: 'absolute', 
                                        bottom: -6, 
                                        left: '50%', 
                                        transform: 'translateX(-50%)',
                                        height: 14, 
                                        fontSize: '0.55rem', 
                                        fontWeight: 900, 
                                        bgcolor: '#00b4d8', 
                                        color: '#fff',
                                        px: 0.5
                                      }} 
                                    />
                                  )}
                                </Box>

                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                                    @{student.username}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 4 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Typography fontSize={20}>🪙</Typography>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffb74d', lineHeight: 1 }}>
                                      {student.coins}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', fontSize: '0.62rem' }}>
                                      moedas
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, minWidth: { xs: 60, sm: 80 } }}>
                                  <Typography fontSize={20}>🔥</Typography>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ff7043', lineHeight: 1 }}>
                                      {student.streak}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', fontSize: '0.62rem' }}>
                                      dias
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Card>
                </Box>
              )}

          {/* TAB 3: SLIDE & SUMMARY LIBRARY */}
          {dashboardTab === 3 && (
            <SlideLibrary />
          )}
        </Container>
      {/* FOCUSED VIEW: Fullscreen focus for active RPG activity */}
      {activeFocusExercise && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          bgcolor: '#070f19',
          backgroundImage: 'linear-gradient(135deg, #090f1e 0%, #060b13 100%)',
          overflowY: 'auto',
          p: { xs: 2, md: 4 },
          animation: 'fadeIn 0.3s ease'
        }}>
          <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Focused Header */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              pb: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                  Modo Foco 🎯 | {activeFocusExercise.exercise?.level ? (['beginner', 'módulo 1', 'modulo 1'].includes(activeFocusExercise.exercise.level.toLowerCase()) ? 'Módulo 1' : ['intermediate', 'módulo 2', 'modulo 2'].includes(activeFocusExercise.exercise.level.toLowerCase()) ? 'Módulo 2' : activeFocusExercise.exercise.level) : 'Atividade'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', mt: 0.5 }}>
                  {activeFocusExercise.exercise?.title}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setActiveFocusExercise(null)}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 800,
                  '&:hover': {
                    borderColor: '#ff8fa3',
                    bgcolor: 'rgba(255, 143, 163, 0.08)',
                    color: '#ff8fa3'
                  }
                }}
                startIcon={<span>↩</span>}
              >
                Sair do Foco
              </Button>
            </Box>

            {/* Focused Body */}
            <Card sx={{
              p: { xs: 2.5, md: 4 },
              bgcolor: 'rgba(13, 27, 42, 0.65)',
              border: '1px solid rgba(0, 180, 216, 0.25)',
              boxShadow: '0 12px 40px rgba(0, 180, 216, 0.15)',
              borderRadius: 6
            }}>
              {isRpgExerciseCompleted(activeFocusExercise) ? (
                <Box>
                  {renderCompletedBody(activeFocusExercise)}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => setActiveFocusExercise(null)}
                      sx={{ borderRadius: 3, px: 4, fontWeight: 800 }}
                    >
                      Voltar ao Mapa
                    </Button>
                  </Box>
                </Box>
              ) : (
                <ExerciseCard
                  exercise={{ ...(activeFocusExercise.exercise || {}), userId: user?.id }}
                  onComplete={(validationData) => handleExerciseComplete(activeFocusExercise, validationData)}
                />
              )}
            </Card>
          </Container>
        </Box>
      )}

      {/* Explanation Modal */}
      <Dialog 
        open={openExplanationDialog} 
        onClose={() => setOpenExplanationDialog(false)}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(10, 20, 35, 0.98)',
            backgroundImage: 'radial-gradient(ellipse at top, rgba(0, 180, 216, 0.1), transparent 70%)',
            backdropFilter: 'blur(24px)',
            border: isMobile ? 'none' : '1px solid rgba(0, 180, 216, 0.25)',
            borderRadius: isMobile ? 0 : 5,
            color: '#fff',
            boxShadow: isMobile ? 'none' : '0 0 32px rgba(0, 180, 216, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? '100dvh' : 'auto',
            maxHeight: isMobile ? '100dvh' : '90vh',
            m: isMobile ? 0 : 2,
            overflow: 'hidden'
          }
        }}
      >
        {(() => {
          const content = MODULE_EXPLANATIONS[rpgModuleId]?.content || '';
          const rawParts = content.split('###').map(p => p.trim()).filter(Boolean);
          const totalPages = rawParts.length || 1;
          
          // Current Page details
          const currentPageRaw = rawParts[explanationPage] || '';
          const pageLines = currentPageRaw.split('\n');
          const pageTitle = pageLines[0] || 'Explicação';
          const pageContentText = pageLines.slice(1).join('\n');
          const paragraphs = pageContentText.split('\n\n').map(p => p.trim()).filter(Boolean);

          const renderFormattedText = (text) => {
            if (!text) return '';
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
            <>
              {/* Header */}
              <DialogTitle sx={{ 
                p: { xs: 1.5, sm: 2.5 }, 
                pb: { xs: 1, sm: 1.5 }, 
                background: 'rgba(0, 0, 0, 0.4)',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#00b4d8', 
                      fontWeight: 900, 
                      textTransform: 'uppercase', 
                      letterSpacing: 0.8,
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      📖 Módulo {rpgModuleId} • Mini Livro de Explicação
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 950, 
                      mt: 0.3, 
                      color: '#fff',
                      lineHeight: 1.2,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {MODULE_EXPLANATIONS[rpgModuleId]?.title || 'Grammar Reference'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexShrink: 0 }}>
                    <Chip 
                      label={`${explanationPage + 1}/${totalPages}`} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(0,180,216,0.18)', 
                        color: '#00b4d8', 
                        fontWeight: 900, 
                        fontSize: '0.72rem',
                        height: 24,
                        border: '1px solid rgba(0,180,216,0.35)' 
                      }}
                    />
                    <IconButton
                      onClick={() => setOpenExplanationDialog(false)}
                      size="small"
                      sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        bgcolor: 'rgba(255,255,255,0.06)',
                        p: 0.8,
                        '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' } 
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Progress bar */}
                <Box sx={{ mt: 1.2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={((explanationPage + 1) / totalPages) * 100} 
                    sx={{ 
                      height: 5, 
                      borderRadius: 2.5, 
                      bgcolor: 'rgba(255,255,255,0.08)', 
                      '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #00b4d8, #7c4dff)' } 
                    }}
                  />
                </Box>

                {/* Dot step shortcuts */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: { xs: 0.6, sm: 0.8 }, 
                  mt: 1,
                  overflowX: 'auto',
                  py: 0.2
                }}>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setExplanationPage(idx)}
                      sx={{
                        width: idx === explanationPage ? { xs: 18, sm: 24 } : { xs: 6, sm: 8 },
                        height: { xs: 6, sm: 8 },
                        borderRadius: 4,
                        bgcolor: idx === explanationPage ? '#00b4d8' : idx < explanationPage ? '#48c78e' : 'rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: '#00b4d8' }
                      }}
                      title={`Ir para Página ${idx + 1}`}
                    />
                  ))}
                </Box>
              </DialogTitle>

              {/* Dialog Content - Expands fully */}
              <DialogContent 
                dividers 
                onTouchStart={handleSlideTouchStart}
                onTouchEnd={(e) => handleSlideTouchEnd(e, totalPages)}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.06)', 
                  p: { xs: 1.2, sm: 3 }, 
                  flex: 1, 
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'rgba(7, 15, 25, 0.4)'
                }}
              >
                <Box sx={{
                  flex: 1,
                  p: { xs: 1.8, sm: 3 },
                  borderRadius: { xs: 3, sm: 4 },
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(0, 180, 216, 0.15)',
                  boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.3)',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Internal Page Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: '1px solid rgba(0, 180, 216, 0.2)' }}>
                    <Typography variant="caption" sx={{ 
                      bgcolor: 'rgba(0,180,216,0.18)', 
                      color: '#00b4d8', 
                      px: 1, 
                      py: 0.3, 
                      borderRadius: 1.5, 
                      fontWeight: 900,
                      fontSize: '0.7rem' 
                    }}>
                      Página #{explanationPage + 1}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#00b4d8', fontSize: { xs: '1.02rem', sm: '1.2rem' }, fontFamily: 'Outfit, sans-serif' }}>
                      {pageTitle}
                    </Typography>
                  </Box>

                  {/* Body Paragraphs */}
                  <Box sx={{ typography: 'body1', lineHeight: 1.7, color: '#cbd5e1' }}>
                    {paragraphs.map((para, pIdx) => {
                      if (para.includes('*')) {
                        const lines = para.split('\n');
                        const isList = lines.some(l => l.trim().startsWith('*'));
                        
                        if (isList) {
                          return (
                            <Box component="ul" key={pIdx} sx={{ mb: 2, pl: { xs: 2.2, sm: 3 }, m: 0 }}>
                              {lines.map((li, lIdx) => {
                                const cleanLi = li.replace(/^\*\s*/, '').trim();
                                return (
                                  <Box component="li" key={lIdx} sx={{ mb: 1, color: '#cbd5e1', lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '0.98rem' } }}>
                                    {renderFormattedText(cleanLi)}
                                  </Box>
                                );
                              })}
                            </Box>
                          );
                        }
                      }
                      return (
                        <Typography key={pIdx} variant="body1" sx={{ mb: 2, color: '#cbd5e1', lineHeight: 1.7, fontSize: { xs: '0.92rem', sm: '1rem' } }}>
                          {renderFormattedText(para)}
                        </Typography>
                      );
                    })}
                  </Box>

                  {/* Mobile swipe gesture tip */}
                  {isMobile && (
                    <Box sx={{ 
                      mt: 'auto', 
                      pt: 2, 
                      borderTop: '1px dashed rgba(255,255,255,0.08)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      gap: 0.8,
                      opacity: 0.5 
                    }}>
                      <Typography variant="caption" sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        💡 Deslize para a esquerda ou direita para trocar de slide
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>

              {/* Dialog Footer Actions */}
              <DialogActions sx={{ 
                p: { xs: 1.2, sm: 2 }, 
                px: { xs: 1.5, sm: 3 }, 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: { xs: 'max(14px, env(safe-area-inset-bottom))', sm: 2 }
              }}>
                <Button 
                  disabled={explanationPage === 0} 
                  onClick={() => setExplanationPage(prev => Math.max(prev - 1, 0))}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 800, 
                    textTransform: 'none',
                    px: { xs: 1.5, sm: 2.5 },
                    fontSize: { xs: '0.82rem', sm: '0.9rem' },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' } 
                  }}
                  startIcon={<ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                >
                  Anterior
                </Button>

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {explanationPage + 1} / {totalPages}
                </Typography>

                {explanationPage < totalPages - 1 ? (
                  <Button 
                    variant="contained" 
                    size={isMobile ? "small" : "medium"}
                    onClick={() => setExplanationPage(prev => prev + 1)}
                    sx={{ 
                      borderRadius: 2.5, 
                      fontWeight: 900,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.8, sm: 1 },
                      textTransform: 'none',
                      fontSize: { xs: '0.82rem', sm: '0.9rem' },
                      background: 'linear-gradient(90deg, #00b4d8, #7c4dff)',
                      color: '#fff',
                      boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)',
                      '&:hover': { background: 'linear-gradient(90deg, #00c8f0, #9c27b0)' }
                    }}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  >
                    Próxima
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    size={isMobile ? "small" : "medium"}
                    onClick={() => {
                      markExplanationCompleted(rpgModuleId);
                      setOpenExplanationDialog(false);
                      alert('📖 Leitura concluída! Atividade 1 desbloqueada no seu caminho do RPG! 🚀');
                    }}
                    sx={{ 
                      borderRadius: 2.5, 
                      fontWeight: 900,
                      px: { xs: 2, sm: 3 },
                      py: { xs: 0.8, sm: 1 },
                      textTransform: 'none',
                      fontSize: { xs: '0.82rem', sm: '0.9rem' },
                      bgcolor: '#48c78e',
                      color: '#071018',
                      boxShadow: '0 4px 14px rgba(72,199,142,0.4)',
                      '&:hover': { bgcolor: '#38a876' }
                    }}
                    startIcon={<CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                  >
                    Concluir
                  </Button>
                )}
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* Badge Unlock Dialog */}
      <Dialog 
        open={Boolean(unlockedBadge)} 
        onClose={() => setUnlockedBadge(null)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 100%)',
            border: '2px solid rgba(179, 136, 255, 0.4)',
            borderRadius: 6,
            p: 3,
            maxWidth: 400,
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(179, 136, 255, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 900, pb: 1, fontSize: '1.5rem' }}>
          🎉 Conquista Desbloqueada!
        </DialogTitle>
        <DialogContent sx={{ color: '#fff', py: 2 }}>
          {unlockedBadge && (
            <Box>
              <Typography fontSize={80} sx={{ my: 2, display: 'inline-block', filter: 'drop-shadow(0 0 15px rgba(179,136,255,0.6))' }}>
                {unlockedBadge.icon}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#b388ff', mb: 1 }}>
                {unlockedBadge.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                {unlockedBadge.desc}
              </Typography>
              <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800, display: 'block' }}>
                +50 Moedas Bônus!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pt: 1 }}>
          <Button 
            variant="contained" 
            onClick={async () => {
              if (unlockedBadge) {
                try {
                  const newCoins = backendCoins + 50;
                  setBackendCoins(newCoins);
                  await apiClient.put(`/users/${user.id}`, { coins: newCoins });
                } catch (e) {
                  console.error('Error claiming badge reward:', e);
                }
              }
              setUnlockedBadge(null);
            }}
            sx={{
              background: 'linear-gradient(135deg, #b388ff, #7c4dff)',
              fontWeight: 800,
              borderRadius: 3.5,
              px: 4,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #7c4dff, #b388ff)'
              }
            }}
          >
            Obter Recompensa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modern Achievements & XP Modal Dialog */}
      <AchievementsModal
        open={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        badges={badges}
        currentLevel={currentLevel}
        xpInCurrentLevel={xpInCurrentLevel}
        xpPerLevel={xpPerLevel}
        levelPercent={levelPercent}
      />

      {/* Interactive Daily Streak & Inactivity Penalty Rules Dialog */}
      <StreakRulesModal
        open={streakRulesOpen}
        onClose={() => setStreakRulesOpen(false)}
      />

      {/* App-like Fixed Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={dashboardTab}
        onSelectTab={setDashboardTab}
        onOpenAchievements={() => setAchievementsOpen(true)}
      />
      </Box>
    </ThemeProvider>
  );
}

const SPEAKING_MODULES_METADATA = [
  { id: 'Frases Básicas', name: 'Frases Básicas', icon: '🌟', desc: 'Saudações e apresentações fundamentais em inglês.', color: '#00b4d8' },
  { id: 'Frases do Dia a Dia', name: 'Frases do Dia a Dia', icon: '📅', desc: 'Expressões comuns para rotina e conversas cotidianas.', color: '#48c78e' },
  { id: 'Restaurante', name: 'Restaurante', icon: '🍔', desc: 'Frases para fazer reservas, pedir pratos e a conta.', color: '#ff9800' },
  { id: 'Cafeteria', name: 'Cafeteria', icon: '☕', desc: 'Como fazer pedidos rápidos de cafés e lanches.', color: '#e91e63' },
  { id: 'Aeroporto', name: 'Aeroporto', icon: '✈️', desc: 'Vocabulário essencial para check-in, portões e bagagens.', color: '#9c27b0' },
  { id: 'Pedindo Informações', name: 'Pedindo Informações', icon: '🗺️', desc: 'Direções, localizações e perguntas úteis na rua.', color: '#3f51b5' }
];

const getSpeakingCategory = (exercise) => {
  const title = (exercise?.title || '').toLowerCase();
  const sentence = (exercise?.sentence || exercise?.content?.sentence || '').toLowerCase();

  // 1. Check title prefixes first (for our seeded exercises)
  if (title.startsWith('básica') || title.startsWith('basica') || title.includes('básicas') || title.includes('basicas')) {
    return 'Frases Básicas';
  }
  if (title.startsWith('dia a dia') || title.includes('dia a dia')) {
    return 'Frases do Dia a Dia';
  }
  if (title.startsWith('restaurante') || title.includes('restaurant')) {
    return 'Restaurante';
  }
  if (title.startsWith('cafeteria') || title.includes('cafe')) {
    return 'Cafeteria';
  }
  if (title.startsWith('aeroporto') || title.includes('airport')) {
    return 'Aeroporto';
  }
  if (title.startsWith('informa') || title.includes('informação') || title.includes('informacao') || title.includes('informações') || title.includes('informacoes')) {
    return 'Pedindo Informações';
  }

  // 2. Fallback keyword checking (for ad-hoc or manually created exercises)
  if (title.includes('cafeteria') || title.includes('cafe') || sentence.includes('coffee') || sentence.includes('cup of tea') || sentence.includes('espresso') || sentence.includes('iced tea') || sentence.includes('cake') || sentence.includes('croissant') || sentence.includes('muffin') || sentence.includes('latte')) {
    return 'Cafeteria';
  }
  if (title.includes('restaurant') || title.includes('menu') || title.includes('dinner') || title.includes('table for') || sentence.includes('recommend as the main course') || sentence.includes('book a table') || sentence.includes('menu') || sentence.includes('the check, please') || sentence.includes('main course') || sentence.includes('dish') || sentence.includes('steak') || sentence.includes('ready to pay') || sentence.includes('bill')) {
    return 'Restaurante';
  }
  if (title.includes('airport') || title.includes('flight') || title.includes('gate') || title.includes('boarding') || sentence.includes('flight') || sentence.includes('airport') || sentence.includes('passport') || sentence.includes('boarding pass') || sentence.includes('check-in') || sentence.includes('baggage') || sentence.includes('luggage') || sentence.includes('delayed') || sentence.includes('security') || sentence.includes('window seat') || sentence.includes('conveyor belt')) {
    return 'Aeroporto';
  }
  if (title.includes('direção') || title.includes('direcoes') || title.includes('directions') || title.includes('help') || sentence.includes('excuse me, could you tell me') || sentence.includes('where is') || sentence.includes('how do i get to') || sentence.includes('subway station') || sentence.includes('library is') || sentence.includes('museum') || sentence.includes('on the map') || sentence.includes('restroom') || sentence.includes('bus') || sentence.includes('pharmacy') || sentence.includes('drugstore') || sentence.includes('train station') || sentence.includes('street') || sentence.includes('taxi')) {
    return 'Pedindo Informações';
  }
  if (title.includes('routine') || title.includes('rotina') || title.includes('everyday') || title.includes('daily') || sentence.includes('weather') || sentence.includes('appreciate') || sentence.includes('cost') || sentence.includes('rain this afternoon') || sentence.includes('supermarket') || sentence.includes('clean the house') || sentence.includes('wash the dishes') || sentence.includes('traffic') || sentence.includes('keys')) {
    return 'Frases do Dia a Dia';
  }
  
  return 'Frases Básicas';
};
