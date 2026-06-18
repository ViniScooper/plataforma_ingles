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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
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
import { StudentAvatar } from '../components/Student/StudentAvatar';

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

const MODULES = [
  { id: 1, key: 'Módulo 1', name: 'Módulo 1: Greetings & Introductions', levelValue: 'Beginner' },
  { id: 2, key: 'Módulo 2', name: 'Módulo 2: Intermediate English', levelValue: 'Intermediate' },
  { id: 3, key: 'Módulo 3', name: 'Módulo 3: Grammar Expansion', levelValue: 'Advanced' },
  { id: 4, key: 'Módulo 4', name: 'Módulo 4: Everyday Expressions', levelValue: 'Módulo 4' },
  { id: 5, key: 'Módulo 5', name: 'Módulo 5: Professional Vocabulary', levelValue: 'Módulo 5' },
  { id: 6, key: 'Módulo 6', name: 'Módulo 6: Narrative & Telling Stories', levelValue: 'Módulo 6' },
  { id: 7, key: 'Módulo 7', name: 'Módulo 7: Future & Conditional Sentences', levelValue: 'Módulo 7' },
  { id: 8, key: 'Módulo 8', name: 'Módulo 8: Complex Text & Reading', levelValue: 'Módulo 8' },
  { id: 9, key: 'Módulo 9', name: 'Módulo 9: English in Context', levelValue: 'Módulo 9' },
  { id: 10, key: 'Módulo 10', name: 'Módulo 10: Advanced Conversations', levelValue: 'Módulo 10' }
];

const MODULE_COLORS = [
  '#00b4d8', // Módulo 1 (Blue)
  '#b388ff', // Módulo 2 (Purple)
  '#48c78e', // Módulo 3 (Green)
  '#ffb74d', // Módulo 4 (Orange)
  '#ff8fa3', // Módulo 5 (Pink)
  '#00f5d4', // Módulo 6 (Teal)
  '#fee440', // Módulo 7 (Yellow)
  '#9b5de5', // Módulo 8 (Indigo)
  '#f15bb5', // Módulo 9 (Magenta)
  '#00b4d8'  // Módulo 10 (Blue)
];

const MODULE_EXPLANATIONS = {
  1: {
    title: 'Greetings & Introductions',
    subtitle: 'Aprenda a cumprimentar e se apresentar em inglês',
    content: `### 📖 Explicação
Em inglês, a forma como cumprimentamos as pessoas depende do nível de formalidade e da hora do dia.

**Cumprimentos Comuns (Greetings):**
*   **Hello / Hi:** Olá / Oi (Geral)
*   **Good morning:** Bom dia (até 12h)
*   **Good afternoon:** Boa tarde (das 12h às 18h)
*   **Good evening:** Boa noite (ao chegar ou encontrar alguém)
*   **Good night:** Boa noite (ao se despedir ou ir dormir)

**Perguntando como a pessoa está:**
*   **How are you?** (Como você está? - Mais comum)
*   **How\'s it going?** (Como vão as coisas? - Informal)

### ✍️ Exemplos
*   *A: "Hello! My name is John. Nice to meet you."*
*   *B: "Hi John! I\'m Mary. Nice to meet you too."*
*   *A: "How are you today?"*
*   *B: "I\'m fine, thank you. And you?"*
*   *A: "I\'m good, thanks!"*`
  },
  2: {
    title: 'Intermediate English - Grammar & Structure',
    subtitle: 'Estruturação de frases e vocabulário intermediário',
    content: `### 📖 Explicação & Guia Completo do Módulo 2

Neste módulo intermediário, focamos na estruturação correta de frases, no aprendizado das preposições básicas e em vocabulário essencial. Veja abaixo as explicações detalhadas e exemplos de cada assunto que cairá nas atividades:

### 📍 1. Preposições de Tempo e Lugar (In, On, At, Under)

As preposições conectam palavras e indicam quando ou onde algo acontece. Aqui está como cada uma funciona de forma clara:

### ➡️ AT (Usado para momentos específicos e locais pontuais)

*   **Tempo (Horas e momentos exatos):** Usado para indicar horários precisos do relógio.
*   *Exemplo:* **at 5 PM** (às 17h), **at midnight** (à meia-noite), **at lunchtime** (na hora do almoço).
*   **Lugar (Ponto específico):** Usado quando nos referimos a um ponto geográfico específico ou estabelecimento.
*   *Exemplo:* **at school** (na escola), **at the bus stop** (no ponto de ônibus), **at the supermarket** (no supermercado).

### ➡️ ON (Usado para dias, datas e superfícies)

*   **Tempo (Dias e datas):** Usado para dias específicos da semana, datas com mês e dia, e feriados com "Day".
*   *Exemplo:* **on Monday** (na segunda-feira), **on June 18th** (em 18 de junho), **on Christmas Day** (no dia de Natal).
*   **Lugar (Superfície):** Usado quando um objeto está fisicamente apoiado sobre uma superfície plana.
*   *Exemplo:* **on the table** (sobre a mesa), **on the wall** (na parede), **on the floor** (no chão).

### ➡️ IN (Usado para períodos longos e áreas fechadas)

*   **Tempo (Meses, anos, estações e partes do dia):** Usado para espaços de tempo mais amplos e genéricos.
*   *Exemplo:* **in July** (em julho), **in 2026** (em 2026), **in the morning** (de manhã), **in the summer** (no verão).
*   **Lugar (Espaço delimitado/Dentro):** Usado para locais fechados, cidades, países ou quando algo está dentro de um recipiente.
*   *Exemplo:* **in Brazil** (no Brasil), **in New York** (em Nova York), **in the box** (dentro da caixa), **in the bedroom** (no quarto).

### ➡️ UNDER (Embaixo de / Sob)

*   **Lugar (Posição diretamente abaixo):** Usado quando um objeto está abaixo ou debaixo de outro.
*   *Exemplo:* **under the table** (embaixo da mesa), **under the bed** (embaixo da cama).

### 📝 2. Tempos Verbais: Past Simple & Present Perfect

Neste módulo, você revisará e aplicará tempos verbais para falar do passado:

*   **Past Simple (Verbos Irregulares):** Usado para ações concluídas no passado em um tempo definido. Os verbos irregulares mudam de forma e devem ser estudados.
*   *Exemplo:* **go** vira **went** (fui/foi) | **buy** vira **bought** (comprei/comprou) | **write** vira **wrote** (escrevi/escreveu).
*   **Present Perfect:** Usado para experiências passadas sem especificar o momento exato, ou ações que começaram no passado e continuam no presente. Formado por **have/has + verbo no particípio**.
*   *Exemplo correto:* **I have visited France twice** (Eu visitei a França duas vezes - não importa quando).
*   *Atenção:* O correto é **She has seen that movie** (e não *She has saw*).

### 📚 3. Phrasal Verbs, Condicionais e Adjetivos

Outros assuntos muito importantes que você praticará nas etapas do módulo:

*   **Phrasal Verbs (Verbos Frasais):** Verbos combinados com preposições que ganham novos significados.
*   *Exemplo:* **Give up** (Desistir) | **Look for** (Procurar) | **Run out of** (Ficar sem/Esgotar algo) | **Wake up** (Acordar).
*   **First Conditional (Primeira Condicional):** Indica uma condição real no presente e seu provável resultado no futuro. Estrutura: **If + Present Simple + Will**.
*   *Exemplo:* **If it rains, I will stay home** (Se chover, eu ficarei em casa).
*   **Comparativos e Superlativos:** Usados para comparar qualidades.
*   *Exemplo Comparativo:* **This book is more interesting than that one** (Este livro é mais interessante que aquele).
*   *Exemplo Superlativo:* **He is the tallest boy in class** (Ele é o garoto mais alto da classe - e nunca *most tallest* ou *gooder*).

### ✈️ 4. Vocabulário de Viagem (Travel)

Aprenda termos úteis para aeroportos e deslocamentos cotidianos:

*   **Boarding pass** (Cartão de embarque) | **Luggage** (Malas/Bagagem) | **Delay** (Atraso) | **Gate** (Portão de embarque).`
  },
  3: {
    title: 'Grammar Expansion',
    subtitle: 'Entendendo tempos verbais do passado e pronomes',
    content: `### 📖 Explicação
Nesta etapa expandimos nossa gramática com o Past Simple e pronomes de objeto direto e indireto.

**Past Simple (Regular & Irregular):**
*   Verbos Regulares: Adiciona-se **-ed**. Ex: *work -> worked*.
*   Verbos Irregulares: Mudam de forma. Ex: *go -> went*, *buy -> bought*.

**Object Pronouns:**
*   Substituem o objeto da frase: *me, you, him, her, it, us, them*.

### ✍️ Exemplos
*   *I saw her yesterday and gave her the book.* (Eu a vi ontem e dei a ela o livro.)
*   *We watched a great movie last weekend.*`
  },
  4: {
    title: 'Everyday Expressions & Idioms',
    subtitle: 'Expressões idiomáticas do dia a dia',
    content: `### 📖 Explicação
Expressões que falantes nativos usam com frequência e que não devem ser traduzidas literalmente.

*   **Piece of cake:** Algo muito fácil (Mamão com açúcar).
*   **Break a leg:** Boa sorte (usado no teatro).
*   **Under the weather:** Sentindo-se um pouco doente ou indisposto.

### ✍️ Exemplos
*   *The English test was a piece of cake! I got a 10.*
*   *Are you okay? You look a bit under the weather.*`
  },
  5: {
    title: 'Professional Vocabulary',
    subtitle: 'Inglês para negócios e ambiente de trabalho',
    content: `### 📖 Explicação
Vocabulário essencial para reuniões, e-mails comerciais e entrevistas de emprego.

*   **Schedule:** Cronograma / Agendar.
*   **Feedback:** Avaliação / Retorno.
*   **Deadline:** Prazo final.
*   **To hire / To fire:** Contratar / Demitir.

### ✍️ Exemplos
*   *We need to meet the deadline for this project.*
*   *He scheduled a meeting to give feedback on our performance.*`
  },
  6: {
    title: 'Narrative & Telling Stories',
    subtitle: 'Uso do Past Continuous e Past Perfect',
    content: `### 📖 Explicação
Para contar histórias de forma natural, combinamos Past Simple, Past Continuous e Past Perfect.

*   **Past Continuous:** Ações em andamento no passado. Ex: *I was sleeping.*
*   **Past Perfect:** Ação que ocorreu ANTES de outra ação no passado. Ex: *I had already eaten when she arrived.*

### ✍️ Exemplos
*   *While I was walking home, it started to rain.*
*   *When the movie started, we realized we had lost our tickets.*`
  },
  7: {
    title: 'Future & Conditional Sentences',
    subtitle: 'Planos futuros e hipóteses (Will, Going to, Zero/First Conditional)',
    content: `### 📖 Explicação
**Will vs. Going to:**
*   **Will:** Decisões espontâneas ou previsões. Ex: *I think it will rain.*
*   **Going to:** Planos já decididos. Ex: *I am going to travel tomorrow.*

**Conditionals:**
*   **Zero Conditional:** Fatos gerais. *If you heat water, it boils.*
*   **First Conditional:** Possibilidades futuras. *If it rains, we will stay home.*

### ✍️ Exemplos
*   *Next month, I am going to buy a new computer.*
*   *If you study hard, you will pass the exam.*`
  },
  8: {
    title: 'Complex Text & Reading Comprehension',
    subtitle: 'Técnicas de leitura e vocabulário avançado',
    content: `### 📖 Explicação
Técnicas para compreender textos complexos sem precisar traduzir palavra por palavra.

*   **Skimming:** Ler rapidamente para pegar a ideia principal.
*   **Scanning:** Procurar informações específicas (nomes, números, datas).
*   **Context Clues:** Deduzir o significado de palavras desconhecidas pelo contexto.

### ✍️ Exemplos
*   *Read the paragraph and write down only the main ideas.*
*   *Scan the text to find the year the company was founded.*`
  },
  9: {
    title: 'English in Context',
    subtitle: 'Inglês para viagens e situações reais',
    content: `### 📖 Explicação
Vocabulário prático para aeroporto, hotel, restaurante e compras.

*   **Check-in / Check-out:** Entrada / Saída de hotel ou voo.
*   **Boarding pass:** Cartão de embarque.
*   **To order:** Fazer o pedido (restaurante).
*   **Refund:** Reembolso.

### ✍️ Exemplos
*   *Excuse me, where can I print my boarding pass?*
*   *I would like to order a steak and a glass of water, please.*`
  },
  10: {
    title: 'Advanced Conversations & Final Project',
    subtitle: 'Expressão fluente e consolidação do aprendizado',
    content: `### 📖 Explicação
Prática de debate, estruturação de argumentos e apresentação final.

*   **In my opinion / From my perspective:** Na minha opinião / Do meu ponto de vista.
*   **On the other hand:** Por outro lado.
*   **To sum up:** Resumindo.

### ✍️ Exemplos
*   *From my perspective, studying online offers more flexibility. On the other hand, classroom interaction is highly valuable.*`
  }
};

const getModuleIdForExercise = (exercise) => {
  if (!exercise || !exercise.level) return 1;
  const lvl = exercise.level.toLowerCase();
  if (lvl === 'beginner' || lvl === 'módulo 1' || lvl === 'modulo 1') return 1;
  if (lvl === 'intermediate' || lvl === 'módulo 2' || lvl === 'modulo 2') return 2;
  if (lvl === 'advanced' || lvl === 'módulo 3' || lvl === 'modulo 3') return 3;
  if (lvl === 'módulo 4' || lvl === 'modulo 4') return 4;
  if (lvl === 'módulo 5' || lvl === 'modulo 5') return 5;
  if (lvl === 'módulo 6' || lvl === 'modulo 6') return 6;
  if (lvl === 'módulo 7' || lvl === 'modulo 7') return 7;
  if (lvl === 'módulo 8' || lvl === 'modulo 8') return 8;
  if (lvl === 'módulo 9' || lvl === 'modulo 9') return 9;
  if (lvl === 'módulo 10' || lvl === 'modulo 10') return 10;
  return 1; // Default
};

const isRpgExerciseCompleted = (p) => {
  if (!p) return false;
  if (p.status !== 'completed') return false;
  if (p.totalQuestions > 0 && p.score !== p.totalQuestions) {
    return false;
  }
  return true;
};

const isModuleUnlocked = (assignedExercises, moduleId) => {
  if (moduleId === 1) return true;
  
  // A module is unlocked if all previous modules are fully completed (perfect score).
  for (let m = 1; m < moduleId; m++) {
    const prevModuleExercises = assignedExercises.filter(p => p.exercise?.isRpg && getModuleIdForExercise(p.exercise) === m);
    if (prevModuleExercises.length > 0) {
      const allCompleted = prevModuleExercises.every(p => isRpgExerciseCompleted(p));
      if (!allCompleted) return false;
    }
  }
  return true;
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

  // Backend gamification states
  const [backendCoins, setBackendCoins] = useState(0);
  const [backendStreak, setBackendStreak] = useState(0);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [isStreakFrozen, setIsStreakFrozen] = useState(false);

  // RPG Map states
  const [viewMode, setViewMode] = useState('rpg'); // 'rpg' | 'list'
  const [rpgModuleId, setRpgModuleId] = useState(1); // 1 to 10
  const [openExplanationDialog, setOpenExplanationDialog] = useState(false);
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

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
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

      const firstPending = progress.find(p => p.status !== 'completed');
      if (firstPending) setOpenCards({ [firstPending.id]: true });
    } catch (err) {
      setError('Falha ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
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
    // Reload the student's progress and stats from backend
    loadData();

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

  const listExercises = assignedExercises.filter(p => p.exercise?.isRpg === false);
  const rpgExercises = assignedExercises.filter(p => p.exercise?.isRpg === true);

  const completedCount = viewMode === 'list'
    ? listExercises.filter(p => p.status === 'completed').length
    : rpgExercises.filter(p => p.status === 'completed').length;

  const pendingCount = viewMode === 'list'
    ? listExercises.filter(p => p.status !== 'completed').length
    : rpgExercises.filter(p => p.status !== 'completed').length;

  const totalCount = viewMode === 'list' ? listExercises.length : rpgExercises.length;

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
    }
  ];

  const filterExercises = (exercises) => {
    const isWriting = (p) => p.exercise?.type === 'writing' || (p.exercise?.type === 'text' && p.exercise?.content?.prompt);
    const isFlashcard = (p) => p.exercise?.type === 'flashcards' || (p.exercise?.type === 'text' && p.exercise?.content?.cards);
    
    // Only show non-RPG (classroom list) activities in list view
    const listOnly = exercises.filter(p => p.exercise?.isRpg === false);
    
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
                      {/* Ofensiva */}
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: isStreakFrozen ? 'rgba(0, 180, 216, 0.08)' : 'rgba(255, 112, 67, 0.08)',
                        border: isStreakFrozen ? '1px solid rgba(0, 180, 216, 0.25)' : '1px solid rgba(255, 112, 67, 0.25)',
                        borderRadius: 3.5,
                        p: 1.5,
                        boxShadow: isStreakFrozen ? '0 0 15px rgba(0, 180, 216, 0.08)' : '0 0 15px rgba(255, 112, 67, 0.08)',
                        animation: 'fadeIn 0.6s ease',
                        position: 'relative'
                      }}>
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

                    {/* Pixel Coin Box */}
                    <Box sx={{
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
                      animation: 'fadeIn 0.7s ease'
                    }}>
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
                  </Box>
                </Card>

                {/* Rules Card */}
                <Card sx={{ 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.6), rgba(7, 15, 25, 0.8))',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#ffd426', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    🎯 Regras de Ofensiva e Moedas
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                    Mantenha o foco nos seus estudos de inglês e ganhe recompensas!
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <span style={{ fontSize: '1.2rem' }}>🔥</span>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 850, color: '#fff', display: 'block' }}>
                          Ofensiva Diária (+2 Moedas)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.2, lineHeight: 1.3 }}>
                          Faça login e realize atividades todos os dias para acumular ofensiva e ganhar <strong>+2 moedas de bônus</strong> diariamente!
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <span style={{ fontSize: '1.2rem' }}>⏳</span>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 850, color: '#ff8fa3', display: 'block' }}>
                          Inatividade (-1 Moeda)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.2, lineHeight: 1.3 }}>
                          Fique atento! Se você ficar <strong>uma semana (7 dias ou mais) sem logar</strong>, perderá <strong>1 moeda</strong> por cada semana de ausência.
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
                      <Grid size={{ xs: 6 }} key={badge.id}>
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
            <Grid size={{ xs: 12, md: 8 }}>
              
              {dashboardTab === 0 && (
                // TAB 0: ACTIVITIES PANEL
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
                          onClick={() => setViewMode('rpg')}
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
                          onClick={() => setViewMode('list')}
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
                      </Box>
                    )}
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
                  ) : (
                    <>
                      {/* Sub-Filters and Search Bar */}
                      <Grid container spacing={2} sx={{ mb: 3.5 }}>
                        <Grid size={{ xs: 12, sm: 8 }}>
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
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
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
                  <GamesZone userId={user?.id} userName={user?.name} onEarnXP={handleEarnBonusXP} />
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
                          <Grid size={{ xs: 12, sm: 6 }} key={att.id}>
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0d1b2a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 5,
            color: '#fff',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#00b4d8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
              Módulo {rpgModuleId} • Explicação & Exemplos
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5 }}>
              {MODULE_EXPLANATIONS[rpgModuleId]?.title || 'Grammar Reference'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', py: 3 }}>
          <Box sx={{ 
            typography: 'body1', 
            lineHeight: 1.8, 
            color: '#cbd5e1',
            '& h3': { color: '#00b4d8', fontWeight: 800, mt: 3, mb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 0.5 },
            '& p': { mb: 2 },
            '& ul': { mb: 2.5, pl: 3 },
            '& li': { mb: 1 },
            '& strong': { color: '#fff' },
            '& em': { color: '#b388ff' }
          }}>
            {MODULE_EXPLANATIONS[rpgModuleId]?.content.split('\n\n').map((para, pIdx) => {
              if (para.startsWith('###')) {
                return (
                  <Typography key={pIdx} variant="h6" sx={{ color: '#00b4d8', fontWeight: 900, mt: 3, mb: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 0.5 }}>
                    {para.replace('###', '').trim()}
                  </Typography>
                );
              }
              if (para.includes('*')) {
                return (
                  <Box component="ul" key={pIdx} sx={{ mb: 2.5, pl: 3 }}>
                    {para.split('\n').map((li, lIdx) => {
                      const cleanLi = li.replace(/^\*\s*/, '').trim();
                      return (
                        <Box component="li" key={lIdx} sx={{ mb: 1, color: '#cbd5e1' }}>
                          {cleanLi.split('**').map((chunk, cIdx) => 
                            cIdx % 2 === 1 ? <strong key={cIdx} style={{ color: '#fff' }}>{chunk}</strong> : chunk
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                );
              }
              return (
                <Typography key={pIdx} variant="body1" sx={{ mb: 2, color: '#cbd5e1', lineHeight: 1.7 }}>
                  {para.split('**').map((chunk, cIdx) => 
                    cIdx % 2 === 1 ? <strong key={cIdx} style={{ color: '#fff' }}>{chunk}</strong> : chunk
                  )}
                </Typography>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: 2, justifyContent: 'space-between' }}>
          <Button onClick={() => setOpenExplanationDialog(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Fechar Leitura
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => {
              markExplanationCompleted(rpgModuleId);
              setOpenExplanationDialog(false);
              alert('📖 Leitura concluída! Atividade 1 desbloqueada no seu caminho do RPG! 🚀');
            }}
            sx={{ 
              borderRadius: 3.5, 
              fontWeight: 900,
              px: 3,
              bgcolor: '#48c78e',
              color: '#000',
              '&:hover': { bgcolor: '#38a876' }
            }}
          >
            Concluir Leitura & Começar
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </ThemeProvider>
  );
}
