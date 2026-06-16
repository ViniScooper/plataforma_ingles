import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Button,
  TextField,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputLabel,
  Grid,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Paper,
  Checkbox,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ActivityIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReplayIcon from '@mui/icons-material/Replay';

import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ transition: 'opacity 0.3s ease-in-out', opacity: 1 }}>{children}</Box>;
}

const DashboardCard = ({ icon, title, value, subtitle, color }) => (
  <Card sx={{ 
    p: 3, 
    borderRadius: 4, 
    height: '100%', 
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: color || '#7c4dff',
      boxShadow: `0 8px 30px ${color}1a`
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
      <Paper sx={{ 
        p: 1.5, 
        borderRadius: 3, 
        bgcolor: `${color}1a`, 
        color,
        boxShadow: `0 0 15px ${color}15`
      }}>{icon}</Paper>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)' }}>{title}</Typography>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, color: '#fff' }}>{value}</Typography>
    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.4)' }}>
      <TrendingUpIcon sx={{ fontSize: 14, color: '#00b4d8' }} />
      {subtitle}
    </Typography>
  </Card>
);

export default function AdminPage() {
  const { user, logout } = useContext(AuthContext);

  const [tab, setTab] = useState(0);
  const [plans, setPlans] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  // Plan form state
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    level: 'Beginner',
    price: '',
    hours: '',
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [openPlanDialog, setOpenPlanDialog] = useState(false);

  // Student & Enrollment unified state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    planId: '',
    studentLevel: 'Beginner',
    pricePerClass: 0,
    classesPerWeek: 1,
    lessonDescription: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editEnrollmentId, setEditEnrollmentId] = useState(null);

  // Monitoring state
  const [selectedMonitorStudent, setSelectedMonitorStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  // Exercise import/manual state
  const [importJson, setImportJson] = useState('');
  const [importTab, setImportTab] = useState(0);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openManualExerciseDialog, setOpenManualExerciseDialog] = useState(false);
  const [manualExercise, setManualExercise] = useState({
    title: '',
    type: 'text',
    level: 'Beginner',
    text: '',
    questions: Array(5).fill(null).map(() => ({ question: '', options: ['', '', '', ''], correct: '' })),
    writingPrompt: '',
    writingMinWords: 30,
    writingTips: '',
    tfStatements: Array(4).fill(null).map(() => ({ statement: '', correct: true })),
    soSentences: Array(3).fill(null).map(() => ({ words: '', correct: '' })),
    matchingPairs: Array(4).fill(null).map(() => ({ left: '', right: '' })),
    matchingInstructions: 'Match the word to its meaning.',
    flashCards: Array(5).fill(null).map(() => ({ front: '', back: '', example: '' })),
    flashInstructions: 'Click on the card to see the translation.',
  });

  const [selectedExercisesToAssign, setSelectedExercisesToAssign] = useState([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);

  // Student response viewer state
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [selectedProgressEntry, setSelectedProgressEntry] = useState(null);

  // JSON Viewer state
  const [openJsonDialog, setOpenJsonDialog] = useState(false);
  const [selectedExerciseJson, setSelectedExerciseJson] = useState(null);

  // Attendance state
  const [attendanceForm, setAttendanceForm] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
  });
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [allAttendance, setAllAttendance] = useState([]);
  const [globalAttendance, setGlobalAttendance] = useState([]);
  const [editAttendanceId, setEditAttendanceId] = useState(null);
  const [openEditAttendanceDialog, setOpenEditAttendanceDialog] = useState(false);
  const [editAttendanceForm, setEditAttendanceForm] = useState({ userId: '', date: '', time: '' });

  const [error, setError] = useState('');

  // Live RPG monitoring state
  const [activeRpgGames, setActiveRpgGames] = useState([]);

  // Poll active RPG games for teacher monitoring
  useEffect(() => {
    if (tab !== 4) return;

    const fetchActiveRpgGames = async () => {
      try {
        const response = await apiClient.get('/games/active');
        setActiveRpgGames(response.data);
      } catch (err) {
        console.error('Error fetching active RPG games:', err);
      }
    };

    fetchActiveRpgGames();
    const interval = setInterval(fetchActiveRpgGames, 3000);
    return () => clearInterval(interval);
  }, [tab]);

  // Load data
  useEffect(() => {
    loadPlans();
    loadStudents();
    loadEnrollments();
    loadAllExercises();
    loadGlobalAttendance();
  }, []);

  const loadGlobalAttendance = async () => {
    try {
      const response = await apiClient.get('/attendance');
      setGlobalAttendance(response.data);
    } catch (err) {
      console.error('Failed to load global attendance');
    }
  };

  const loadAllAttendance = async (studentId) => {
     try {
       const response = await apiClient.get(`/attendance/${studentId}`);
       setAllAttendance(response.data);
     } catch (err) {
       console.error('Failed to load attendance');
     }
  };

  const loadAllExercises = async () => {
    try {
      const response = await apiClient.get('/exercises');
      setAllExercises(response.data);
    } catch (err) {
      setError('Failed to load exercises: ' + err.message);
    }
  };

  const loadPlans = async () => {
    try {
      const response = await apiClient.get('/plans');
      setPlans(response.data);
    } catch (err) {
      setError('Failed to load plans: ' + err.message);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await apiClient.get('/users');
      setStudents(response.data.filter((u) => u.role === 'student'));
    } catch (err) {
      setError('Failed to load students: ' + err.message);
    }
  };

  const loadEnrollments = async () => {
    try {
      const response = await apiClient.get('/enrollments');
      setEnrollments(response.data);
    } catch (err) {
      setError('Failed to load enrollments: ' + err.message);
    }
  };

  // Plan handlers
  const handlePlanFormChange = (e) => {
    const { name, value } = e.target;
    setPlanForm({
      ...planForm,
      [name]: value,
    });
  };

  const handleCreatePlan = async () => {
    try {
      setError('');
      await apiClient.post('/plans', {
        ...planForm,
        price: parseFloat(planForm.price),
        hours: parseInt(planForm.hours),
      });
      setPlanForm({ name: '', description: '', level: 'Beginner', price: '', hours: '' });
      setOpenPlanDialog(false);
      loadPlans();
    } catch (err) {
      setError('Failed to create plan: ' + err.response?.data?.message);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Delete this plan?')) {
      try {
        await apiClient.delete(`/plans/${planId}`);
        loadPlans();
      } catch (err) {
        setError('Failed to delete plan: ' + err.message);
      }
    }
  };

  // Student handlers
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({
      ...studentForm,
      [name]: value,
    });
  };

  const handleOpenCreateStudent = () => {
    setEditStudentId(null);
    setEditEnrollmentId(null);
    setStudentForm({
      name: '', email: '', password: '', planId: plans[0]?.id || '',
      studentLevel: 'Beginner', pricePerClass: 0, classesPerWeek: 1,
      lessonDescription: '', startDate: new Date().toISOString().split('T')[0]
    });
    setOpenStudentDialog(true);
  };

  const handleOpenEditStudent = (student, enrollment) => {
    setEditStudentId(student.id);
    setEditEnrollmentId(enrollment?.id || null);
    setStudentForm({
      name: student.name,
      email: student.email,
      password: '',
      planId: enrollment?.planId || plans[0]?.id || '',
      studentLevel: enrollment?.studentLevel || 'Beginner',
      pricePerClass: enrollment?.pricePerClass || 0,
      classesPerWeek: enrollment?.classesPerWeek || 1,
      lessonDescription: enrollment?.lessonDescription || '',
      startDate: enrollment?.startDate ? new Date(enrollment.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setOpenStudentDialog(true);
  };

  const handleSaveStudent = async () => {
    try {
      setError('');
      if (editStudentId) {
        const userPayload = { name: studentForm.name, email: studentForm.email };
        if (studentForm.password) userPayload.password = studentForm.password;

        await apiClient.put(`/users/${editStudentId}`, userPayload);

        if (editEnrollmentId) {
          await apiClient.put(`/enrollments/${editEnrollmentId}`, {
            studentLevel: studentForm.studentLevel,
            pricePerClass: parseFloat(studentForm.pricePerClass),
            classesPerWeek: parseInt(studentForm.classesPerWeek),
            lessonDescription: studentForm.lessonDescription,
            startDate: studentForm.startDate
          });
        }
        alert('Aluno atualizado com sucesso!');
      } else {
        let selectedPlanId = studentForm.planId;
        if (!selectedPlanId && plans.length === 0) {
          const planRes = await apiClient.post('/plans', { name: 'Plano Padrão', level: 'Beginner', price: 0 });
          selectedPlanId = planRes.data.plan.id;
          loadPlans();
        } else if (!selectedPlanId && plans.length > 0) {
          selectedPlanId = plans[0].id;
        }

        const userRes = await apiClient.post('/users', {
          name: studentForm.name, email: studentForm.email, password: studentForm.password, role: 'student',
        });
        const userId = userRes.data.user.id;

        await apiClient.post('/enrollments', {
          userId, planId: parseInt(selectedPlanId), studentLevel: studentForm.studentLevel,
          pricePerClass: parseFloat(studentForm.pricePerClass), classesPerWeek: parseInt(studentForm.classesPerWeek),
          lessonDescription: studentForm.lessonDescription, startDate: studentForm.startDate
        });
        alert('Aluno cadastrado com sucesso!');
      }

      setOpenStudentDialog(false);
      loadStudents();
      loadEnrollments();
    } catch (err) {
      setError('Failed to save student: ' + err.response?.data?.message);
    }
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Tem certeza que deseja excluir o aluno ${student.name}? Esta ação é permanente e apagará todo o histórico dele (atividades e presenças).`)) {
      try {
        await apiClient.delete(`/users/${student.id}`);
        loadStudents();
        loadEnrollments();
        loadGlobalAttendance();
        alert('Aluno excluído com sucesso!');
      } catch (err) {
        setError('Erro ao excluir aluno: ' + err.message);
      }
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await apiClient.post('/attendance', {
        ...attendanceForm,
        userId: parseInt(attendanceForm.userId)
      });
      setOpenAttendanceDialog(false);
      alert('Presença registrada com sucesso!');
      loadGlobalAttendance();
    } catch (err) {
      setError('Erro ao registrar presença: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleOpenEditAttendance = (att) => {
    setEditAttendanceId(att.id);
    setEditAttendanceForm({
      userId: att.userId,
      date: new Date(att.date).toISOString().split('T')[0],
      time: att.time,
    });
    setOpenEditAttendanceDialog(true);
  };

  const handleSaveEditAttendance = async () => {
    try {
      await apiClient.put(`/attendance/${editAttendanceId}`, editAttendanceForm);
      setOpenEditAttendanceDialog(false);
      loadGlobalAttendance();
    } catch (err) {
      setError('Erro ao editar presença: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (window.confirm('Deseja remover este registro de presença?')) {
      try {
        await apiClient.delete(`/attendance/${id}`);
        loadGlobalAttendance();
      } catch (err) {
        setError('Erro ao deletar presença: ' + err.message);
      }
    }
  };

  // Enrollment handlers
  const handleEnrollFormChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentForm({
      ...enrollmentForm,
      [name]: value,
    });
  };

  const handleEnroll = async () => {
    try {
      setError('');
      await apiClient.post('/enrollments', {
        userId: parseInt(selectedStudent),
        planId: parseInt(selectedPlan),
        ...enrollmentForm,
        classesPerWeek: parseInt(enrollmentForm.classesPerWeek),
        pricePerClass: parseFloat(enrollmentForm.pricePerClass),
      });
      setSelectedStudent('');
      setSelectedPlan('');
      setEnrollmentForm({ 
        classesPerWeek: 1, 
        pricePerClass: 0, 
        studentLevel: 'Beginner', 
        lessonDescription: '',
        startDate: new Date().toISOString().split('T')[0] 
      });
      setOpenEnrollDialog(false);
      loadEnrollments();
      loadStudents();
    } catch (err) {
      setError('Failed to enroll student: ' + err.response?.data?.message);
    }
  };

  const handleViewProgress = async (studentId) => {
    try {
      const response = await apiClient.get(`/progress/${studentId}`);
      setStudentProgress(response.data);
      setTab(4); // Switch to Monitoring tab
    } catch (err) {
      setError('Failed to load student progress: ' + err.message);
    }
  };

  const handleImportExercises = async () => {
    try {
      const data = JSON.parse(importJson);
      
      // Determine type based on active tab as a fallback
      const tabTypeMap = {
        0: 'quiz',
        1: 'writing',
        2: 'true-false',
        3: 'sentence-order',
        4: 'matching',
        5: 'flashcards',
        6: 'mixed' // mixed/compiled
      };
      const fallbackType = tabTypeMap[importTab];

      // Process exercises: if it's an array, force the type for all; if single object, force for it.
      // This ensures that the active tab ALWAYS overrides whatever is inside the JSON, unless "mixed" is selected.
      const exercisesArray = Array.isArray(data) ? data : [data];
      const processedExercises = exercisesArray.map(ex => ({
        ...ex,
        type: fallbackType === 'mixed' ? (ex.type || 'text') : (fallbackType || ex.type || 'text')
      }));

      let selectedPlanId = plans.length > 0 ? plans[0].id : 1;
      await apiClient.post('/exercises/import', { exercises: processedExercises, planId: selectedPlanId });
      
      setImportJson('');
      setOpenImportDialog(false);
      alert('Atividades importadas com sucesso!');
      loadAllExercises();
    } catch (err) {
      setError('Failed to import exercises: ' + err.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportJson(text);
      try {
        const parsed = JSON.parse(text);
        // Se for um array de atividades com tipos variados, muda automaticamente para a aba "Compilado"
        if (Array.isArray(parsed) && parsed.length > 0) {
          const types = new Set(parsed.map(x => x.type).filter(Boolean));
          if (types.size > 1) {
            setImportTab(6); // Seleciona a aba "Compilado"
          }
        }
      } catch (err) {
        // ignora erro de parsing na hora do upload, deixa o TextField ou o envio tratar
      }
    };
    reader.readAsText(file);
  };

  const handleCopyExample = () => {
    let template = '';
    switch (importTab) {
      case 0:
        template = `{
  "title": "Quiz: Present Simple",
  "type": "quiz",
  "level": "Beginner",
  "content": {
    "text": "Texto de apoio opcional...",
    "questions": [
      {
        "question": "She ___ coffee every day.",
        "options": ["drink", "drinks", "drinking", "drank"],
        "correct": "drinks"
      }
    ]
  }
}`;
        break;
      case 1:
        template = `{
  "title": "Write about your routine",
  "type": "writing",
  "level": "Intermediate",
  "content": {
    "prompt": "Write 5-8 sentences about your daily routine.",
    "minWords": 30,
    "tips": ["Use Present Simple", "Include time expressions"]
  }
}`;
        break;
      case 2:
        template = `{
  "title": "True or False: London Life",
  "type": "true-false",
  "level": "Beginner",
  "content": {
    "text": "John lives in London and takes the subway...",
    "statements": [
      { "statement": "John lives in New York.", "correct": false },
      { "statement": "He uses public transport.", "correct": true }
    ]
  }
}`;
        break;
      case 3:
        template = `{
  "title": "Sentence Builder",
  "type": "sentence-order",
  "level": "Beginner",
  "content": {
    "instructions": "Put the words in the correct order.",
    "sentences": [
      {
        "words": ["She", "every", "morning", "coffee", "drinks"],
        "correct": "She drinks coffee every morning"
      }
    ]
  }
}`;
        break;
      case 4:
        template = `{
  "title": "Vocabulary Match",
  "type": "matching",
  "level": "Beginner",
  "content": {
    "instructions": "Match the word to its meaning.",
    "pairs": [
      { "left": "Dog", "right": "Animal que late" },
      { "left": "Cat", "right": "Animal que mia" }
    ]
  }
}`;
        break;
      case 5:
        template = `{
  "title": "Vocabulário de Viagem",
  "type": "flashcards",
  "level": "Beginner",
  "content": {
    "instructions": "Clique no cartão para ver a tradução.",
    "cards": [
      { "front": "Airport", "back": "Aeroporto" },
      { "front": "Luggage", "back": "Bagagem", "example": "My luggage is too heavy." },
      { "front": "Flight", "back": "Voo" }
    ]
  }
}`;
        break;
      case 6:
        template = `[
  {
    "title": "1. Present Simple (Quiz)",
    "type": "quiz",
    "level": "Beginner",
    "content": {
      "text": "Choose the best option:",
      "questions": [{ "question": "She ___ a car.", "options": ["has","have"], "correct": "has" }]
    }
  },
  {
    "title": "2. Write your routine (Escrita)",
    "type": "writing",
    "level": "Intermediate",
    "content": { "prompt": "Write about your daily routine.", "minWords": 30 }
  },
  {
    "title": "3. True/False (V ou F)",
    "type": "true-false",
    "level": "Beginner",
    "content": {
      "text": "Mary lives in Rome.",
      "statements": [{ "statement": "Mary lives in Italy.", "correct": true }]
    }
  },
  {
    "title": "4. Sentence Builder (Frases)",
    "type": "sentence-order",
    "level": "Beginner",
    "content": {
      "instructions": "Order the words:",
      "sentences": [{ "words": ["He","is","here"], "correct": "He is here" }]
    }
  },
  {
    "title": "5. Match column (Relacionar)",
    "type": "matching",
    "level": "Beginner",
    "content": {
      "instructions": "Match pairs:",
      "pairs": [{ "left": "Apple", "right": "Maçã" }]
    }
  },
  {
    "title": "6. Flashcards (Vocabulário)",
    "type": "flashcards",
    "level": "Beginner",
    "content": {
      "instructions": "Study cards:",
      "cards": [{ "front": "Hello", "back": "Olá" }]
    }
  }
]`;
        break;
      default:
        break;
    }
    navigator.clipboard.writeText(template);
    alert('Modelo copiado para a área de transferência!');
  };

  const handleCreateManualExercise = async () => {
    try {
      let selectedPlanId = plans.length > 0 ? plans[0].id : 1;
      const payload = { title: manualExercise.title, type: manualExercise.type, level: manualExercise.level, planId: selectedPlanId, content: {} };

      if (manualExercise.type === 'text') {
        payload.content = { text: manualExercise.text };
      } else if (manualExercise.type === 'quiz') {
        payload.content = { text: manualExercise.text, questions: manualExercise.questions.filter(q => q.question) };
      } else if (manualExercise.type === 'writing') {
        payload.content = { prompt: manualExercise.writingPrompt, minWords: parseInt(manualExercise.writingMinWords) || 30, tips: manualExercise.writingTips.split('\n').filter(Boolean) };
      } else if (manualExercise.type === 'true-false') {
        payload.content = { text: manualExercise.text, statements: manualExercise.tfStatements.filter(s => s.statement) };
      } else if (manualExercise.type === 'sentence-order') {
        payload.content = { instructions: 'Organize as palavras para formar a frase correta.', sentences: manualExercise.soSentences.filter(s => s.correct).map(s => ({ words: s.words.split(',').map(w => w.trim()).filter(Boolean), correct: s.correct })) };
      } else if (manualExercise.type === 'matching') {
        payload.content = { instructions: manualExercise.matchingInstructions, pairs: manualExercise.matchingPairs.filter(p => p.left && p.right) };
      } else if (manualExercise.type === 'flashcards') {
        payload.content = {
          instructions: manualExercise.flashInstructions,
          cards: manualExercise.flashCards.filter(c => c.front && c.back).map(c => ({
            front: c.front,
            back: c.back,
            ...(c.example ? { example: c.example } : {})
          }))
        };
      }

      await apiClient.post('/exercises', payload);
      setManualExercise({
        title: '', type: 'text', level: 'Beginner', text: '',
        questions: Array(5).fill(null).map(() => ({ question: '', options: ['', '', '', ''], correct: '' })),
        writingPrompt: '', writingMinWords: 30, writingTips: '',
        tfStatements: Array(4).fill(null).map(() => ({ statement: '', correct: true })),
        soSentences: Array(3).fill(null).map(() => ({ words: '', correct: '' })),
        matchingPairs: Array(4).fill(null).map(() => ({ left: '', right: '' })),
        matchingInstructions: 'Match the word to its meaning.',
        flashCards: Array(5).fill(null).map(() => ({ front: '', back: '', example: '' })),
        flashInstructions: 'Click on the card to see the translation.',
      });
      setOpenManualExerciseDialog(false);
      loadAllExercises();
    } catch (err) {
      setError('Erro ao criar atividade: ' + err.message);
    }
  };

  const handleDeleteExercise = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta atividade?')) {
      try {
        await apiClient.delete(`/exercises/${id}`);
        loadAllExercises();
      } catch (err) {
        setError('Erro ao deletar atividade: ' + err.message);
      }
    }
  };

  const handleAssignExercise = async () => {
    try {
      setError('');
      if (selectedExercisesToAssign.length === 0) {
        alert('Selecione pelo menos uma atividade.');
        return;
      }
      await Promise.all(selectedExercisesToAssign.map(exId => 
        apiClient.post('/assignments', {
          userId: selectedMonitorStudent.id,
          exerciseId: parseInt(exId)
        })
      ));
      setSelectedExercisesToAssign([]);
      setOpenAssignDialog(false);
      handleViewProgress(selectedMonitorStudent.id); // Refresh progress
    } catch (err) {
      setError('Erro ao atribuir atividades: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRestartQuiz = async (progressEntry) => {
    if (window.confirm(`Tem certeza que deseja reiniciar a atividade "${progressEntry.exercise.title}" para este aluno? O histórico será apagado.`)) {
      try {
        setError('');
        await apiClient.put('/progress/reset', {
          userId: selectedMonitorStudent.id,
          exerciseId: progressEntry.exercise.id
        });
        handleViewProgress(selectedMonitorStudent.id);
      } catch (err) {
        setError('Erro ao reiniciar atividade: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Dashboard Stats Calculation
  const totalStudents = students.length;
  const totalMonthlyRevenue = enrollments.reduce((sum, e) => {
    return sum + (e.pricePerClass * e.classesPerWeek * 4);
  }, 0);
  const totalClassesThisMonth = globalAttendance.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#070913', 
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(124, 77, 255, 0.04) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 180, 216, 0.04) 0%, transparent 40%)',
      color: '#ffffff',
      pb: 8
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #090a0f 0%, #15142b 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: 'white',
          pb: 10,
          pt: 5,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#b388ff', letterSpacing: 2, fontWeight: 800 }}>
                ADMINISTRATION PANEL
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 950, mt: 0.5, background: 'linear-gradient(90deg, #fff 0%, #b388ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dashboard Overview 🚀
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                Gerencie seus alunos, planos e atividades em um só lugar.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff' }}>{user?.name}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1.5 }}>Administrator</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  color: '#ff5a79',
                  borderColor: 'rgba(255, 90, 121, 0.4)',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#ff5a79', bgcolor: 'rgba(255, 90, 121, 0.05)' }
                }}
              >
                Sair
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        <Paper elevation={0} sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          background: 'rgba(20, 26, 46, 0.45)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              bgcolor: 'rgba(9, 10, 15, 0.7)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#7c4dff', boxShadow: '0 0 10px #7c4dff' },
              '& .MuiTab-root': { py: 2, minHeight: 64, fontWeight: 800, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', '&.Mui-selected': { color: '#b388ff' } }
            }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Visão Geral" />
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Alunos" />
            <Tab icon={<CheckCircleIcon />} iconPosition="start" label="Presença" />
            <Tab icon={<ActivityIcon />} iconPosition="start" label="Atividades" />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="Monitoramento" />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'transparent' }}>
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            {/* Tab 0: Visão Geral */}
            <TabPanel value={tab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <DashboardCard
                    icon={<PeopleIcon />}
                    title="TOTAL DE ALUNOS"
                    value={totalStudents}
                    subtitle="Alunos ativos na plataforma"
                    color="#667eea"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DashboardCard
                    icon={<AttachMoneyIcon />}
                    title="FATURAMENTO ESTIMADO"
                    value={`R$ ${totalMonthlyRevenue.toFixed(2)}`}
                    subtitle="Projeção mensal baseada em planos"
                    color="#43a047"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DashboardCard
                    icon={<EventAvailableIcon />}
                    title="AULAS ESTE MÊS"
                    value={totalClassesThisMonth}
                    subtitle="Presenças registradas no mês atual"
                    color="#fb8c00"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 1: Alunos */}
            <TabPanel value={tab} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff' }}>Gestão de Alunos 👥</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PeopleIcon />} 
                  onClick={handleOpenCreateStudent} 
                  sx={{ 
                    borderRadius: 3, 
                    px: 3, 
                    background: 'linear-gradient(135deg, #7c4dff 0%, #b388ff 100%)',
                    boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                    fontWeight: 800,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
                      boxShadow: '0 6px 20px rgba(124, 77, 255, 0.45)'
                    }
                  }}
                >
                  Novo Aluno
                </Button>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Nível</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Plano</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const enrollment = enrollments.find(e => e.userId === student.id);
                      return (
                        <TableRow key={student.id} hover sx={{ 
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                          '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }
                        }}>
                          <TableCell sx={{ color: '#fff' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Paper sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(124, 77, 255, 0.15)', color: '#b388ff', border: '1px solid rgba(124, 77, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {student.name.charAt(0)}
                              </Paper>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{student.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{student.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enrollment?.studentLevel || 'N/A'}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                bgcolor: enrollment?.studentLevel === 'Advanced' ? 'rgba(76, 175, 80, 0.15)' : enrollment?.studentLevel === 'Intermediate' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                                color: enrollment?.studentLevel === 'Advanced' ? '#4caf50' : enrollment?.studentLevel === 'Intermediate' ? '#ff9800' : '#2196f3',
                                border: `1px solid ${enrollment?.studentLevel === 'Advanced' ? 'rgba(76, 175, 80, 0.25)' : enrollment?.studentLevel === 'Intermediate' ? 'rgba(255, 152, 0, 0.25)' : 'rgba(33, 150, 243, 0.25)'}`
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>R$ {enrollment?.pricePerClass?.toFixed(2)}/h</Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{enrollment?.classesPerWeek}x por semana</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" onClick={() => handleOpenEditStudent(student, enrollment)} title="Editar" sx={{ color: '#b388ff', '&:hover': { bgcolor: 'rgba(179,136,255,0.1)' } }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => { setSelectedMonitorStudent(student); handleViewProgress(student.id); setTab(4); }} title="Monitorar" sx={{ color: '#00b4d8', '&:hover': { bgcolor: 'rgba(0,180,216,0.1)' } }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDeleteStudent(student)} title="Excluir" sx={{ color: '#ff5a79', '&:hover': { bgcolor: 'rgba(255,90,121,0.1)' } }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

        {/* Student Dialog */}
        <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)}>
          <DialogTitle>{editStudentId ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</DialogTitle>
          <DialogContent sx={{ minWidth: 500, mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField label="Nome do Aluno" name="name" value={studentForm.name} onChange={handleStudentFormChange} required />
              <TextField label="Email" name="email" type="email" value={studentForm.email} onChange={handleStudentFormChange} required />
            </Box>
            <TextField 
              label={editStudentId ? "Nova Senha (opcional)" : "Senha Temporária"} 
              name="password" 
              type="password" 
              value={studentForm.password} 
              onChange={handleStudentFormChange} 
              fullWidth 
              sx={{ mb: 2 }} 
              required={!editStudentId} 
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <FormControl>
                <InputLabel>Nível do Aluno</InputLabel>
                <Select name="studentLevel" value={studentForm.studentLevel} onChange={handleStudentFormChange}>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <TextField 
                label="Data de Início" 
                name="startDate" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                value={studentForm.startDate} 
                onChange={handleStudentFormChange} 
                required
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField 
                label="Preço por Hora (R$)" 
                name="pricePerClass" 
                type="number" 
                value={studentForm.pricePerClass} 
                onChange={handleStudentFormChange} 
                required
              />
              <TextField 
                label="Aulas por Semana" 
                name="classesPerWeek" 
                type="number" 
                value={studentForm.classesPerWeek} 
                onChange={handleStudentFormChange} 
                required
              />
            </Box>
            
            <TextField 
              label="Descrição (Foco das aulas)" 
              name="lessonDescription" 
              value={studentForm.lessonDescription} 
              onChange={handleStudentFormChange} 
              fullWidth 
              multiline 
              rows={2} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudentDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveStudent} variant="contained">
              {editStudentId ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogActions>
        </Dialog>

      {/* Atividades Tab */}
      <TabPanel value={tab} index={3}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setOpenManualExerciseDialog(true)}
            sx={{ 
              borderRadius: 3, 
              px: 3, 
              background: 'linear-gradient(135deg, #7c4dff 0%, #b388ff 100%)',
              boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
                boxShadow: '0 6px 20px rgba(124, 77, 255, 0.45)'
              }
            }}
          >
            + Criar Atividade Manualmente
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<CloudUploadIcon />} 
            onClick={() => setOpenImportDialog(true)}
            sx={{ 
              borderRadius: 3, 
              px: 3, 
              color: '#b388ff', 
              borderColor: 'rgba(179, 136, 255, 0.4)',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#b388ff',
                bgcolor: 'rgba(179, 136, 255, 0.05)'
              }
            }}
          >
            Importar JSON
          </Button>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Título</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Nível</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allExercises.map((ex) => {
                const typeColors = { quiz: '#00b4d8', text: '#4caf50', writing: '#7c4dff', 'gap-fill': '#ff9800', 'true-false': '#4caf50', 'sentence-order': '#e040fb', matching: '#03a9f4', flashcards: '#e91e63' };
                const typeColor = typeColors[ex.type] || '#666';
                return (
                <TableRow key={ex.id} hover sx={{ 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                  '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff' }
                }}>
                  <TableCell sx={{ color: '#fff' }}>
                    <Typography variant="body2" fontWeight={700}>{ex.title}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>ID: {ex.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={
                          {
                            text: '📖 Leitura',
                            quiz: '🧠 Quiz',
                            writing: '✍️ Escrita',
                            'true-false': '✅ V ou F',
                            'sentence-order': '🧩 Frases',
                            matching: '🔗 Relacionar',
                            'gap-fill': '✏️ Lacunas',
                            flashcards: '🎴 Flashcards'
                          }[ex.type] || ex.type
                        }
                        size="small"
                        sx={{ bgcolor: `${typeColor}22`, color: typeColor, border: `1px solid ${typeColor}44`, fontWeight: 700, fontSize: '0.72rem' }}
                      />
                      {/* Quick fix type selector */}
                      <Select
                        size="small"
                        value={ex.type}
                        onChange={async (e) => {
                          try {
                            await apiClient.patch(`/exercises/${ex.id}`, { type: e.target.value });
                            loadAllExercises();
                          } catch (err) { setError('Erro ao atualizar tipo: ' + err.message); }
                        }}
                        sx={{ 
                          fontSize: '0.72rem', 
                          height: 26, 
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#b388ff' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7c4dff' },
                          '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.6)' },
                          '& .MuiSelect-select': { py: 0.3, px: 1 }
                        }}
                        variant="outlined"
                      >
                        <MenuItem value="text" sx={{ fontSize: '0.8rem' }}>📖 Leitura</MenuItem>
                        <MenuItem value="quiz" sx={{ fontSize: '0.8rem' }}>🧠 Quiz</MenuItem>
                        <MenuItem value="writing" sx={{ fontSize: '0.8rem' }}>✍️ Escrita</MenuItem>
                        <MenuItem value="true-false" sx={{ fontSize: '0.8rem' }}>✅ V ou F</MenuItem>
                        <MenuItem value="sentence-order" sx={{ fontSize: '0.8rem' }}>🧩 Frases</MenuItem>
                        <MenuItem value="matching" sx={{ fontSize: '0.8rem' }}>🔗 Relacionar</MenuItem>
                        <MenuItem value="gap-fill" sx={{ fontSize: '0.8rem' }}>✏️ Lacunas</MenuItem>
                        <MenuItem value="flashcards" sx={{ fontSize: '0.8rem' }}>🎴 Flashcards</MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ex.level}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: ex.level === 'Advanced' ? 'rgba(76, 175, 80, 0.15)' : ex.level === 'Intermediate' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                        color: ex.level === 'Advanced' ? '#4caf50' : ex.level === 'Intermediate' ? '#ff9800' : '#2196f3',
                        border: `1px solid ${ex.level === 'Advanced' ? 'rgba(76, 175, 80, 0.25)' : ex.level === 'Intermediate' ? 'rgba(255, 152, 0, 0.25)' : 'rgba(33, 150, 243, 0.25)'}`
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => { setSelectedExerciseJson(ex); setOpenJsonDialog(true); }}
                        sx={{ 
                          color: '#00b4d8', 
                          borderColor: 'rgba(0, 180, 216, 0.4)',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0, 180, 216, 0.05)' }
                        }}
                      >
                        Ver JSON
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDeleteExercise(ex.id)}
                        sx={{ 
                          color: '#ff5a79', 
                          borderColor: 'rgba(255, 90, 121, 0.4)',
                          fontWeight: 700,
                          textTransform: 'none',
                          borderRadius: 2,
                          '&:hover': { borderColor: '#ff5a79', bgcolor: 'rgba(255, 90, 121, 0.05)' }
                        }}
                      >
                        Deletar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* JSON Viewer Dialog */}
        <Dialog open={openJsonDialog} onClose={() => setOpenJsonDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>📄 JSON da Atividade: {selectedExerciseJson?.title}</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#1e1e1e',
                color: '#d4d4d4',
                borderRadius: 2,
                overflow: 'auto',
                fontSize: '0.8rem',
                maxHeight: '60vh',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {selectedExerciseJson ? JSON.stringify({
                id: selectedExerciseJson.id,
                title: selectedExerciseJson.title,
                type: selectedExerciseJson.type,
                level: selectedExerciseJson.level,
                content: selectedExerciseJson.content,
              }, null, 2) : ''}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(selectedExerciseJson?.content || {}, null, 2));
              alert('JSON copiado para a área de transferência!');
            }} variant="outlined">Copiar JSON</Button>
            <Button onClick={() => setOpenJsonDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>

        {/* Import Activities Dialog */}
        <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Importar Atividade via JSON</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#666' }}>Exemplos por tipo — copie e adapte:</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCopyExample}
                sx={{ borderRadius: 2, fontSize: '0.7rem', textTransform: 'none', py: 0.2, px: 1 }}
              >
                Copiar Modelo
              </Button>
            </Box>
            <Tabs value={importTab} onChange={(_, v) => setImportTab(v)} variant="scrollable" scrollButtons="auto"
              sx={{ minHeight: 36, mb: 1, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.75rem', textTransform: 'none' } }}>
              <Tab label="🧠 Quiz" />
              <Tab label="✍️ Escrita" />
              <Tab label="✅ V ou F" />
              <Tab label="🧩 Frases" />
              <Tab label="🔗 Relacionar" />
              <Tab label="🎴 Flashcards" />
              <Tab label="📦 Compilado (Tudo)" />
            </Tabs>
            {importTab === 0 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "Quiz: Present Simple",
  "type": "quiz",
  "level": "Beginner",
  "content": {
    "text": "Texto de apoio opcional...",
    "questions": [
      {
        "question": "She ___ coffee every day.",
        "options": ["drink","drinks","drinking","drank"],
        "correct": "drinks"
      }
    ]
  }
}`}
              </Box>
            )}
            {importTab === 1 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "Write about your routine",
  "type": "writing",
  "level": "Intermediate",
  "content": {
    "prompt": "Write 5-8 sentences about your daily routine.",
    "minWords": 30,
    "tips": ["Use Present Simple", "Include time expressions"]
  }
}`}
              </Box>
            )}
            {importTab === 2 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "True or False: London Life",
  "type": "true-false",
  "level": "Beginner",
  "content": {
    "text": "John lives in London and takes the subway...",
    "statements": [
      { "statement": "John lives in New York.", "correct": false },
      { "statement": "He uses public transport.", "correct": true }
    ]
  }
}`}
              </Box>
            )}
            {importTab === 3 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "Sentence Builder",
  "type": "sentence-order",
  "level": "Beginner",
  "content": {
    "instructions": "Put the words in the correct order.",
    "sentences": [
      {
        "words": ["She","every","morning","coffee","drinks"],
        "correct": "She drinks coffee every morning"
      }
    ]
  }
}`}
              </Box>
            )}
            {importTab === 4 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "Vocabulary Match",
  "type": "matching",
  "level": "Beginner",
  "content": {
    "instructions": "Match the word to its meaning.",
    "pairs": [
      { "left": "Dog", "right": "Animal que late" },
      { "left": "Cat", "right": "Animal que mia" }
    ]
  }
}`}
              </Box>
            )}
            {importTab === 5 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`{
  "title": "Vocabulário de Viagem",
  "level": "Beginner",
  "content": {
    "instructions": "Clique no cartão para ver a tradução.",
    "cards": [
      { "front": "Airport", "back": "Aeroporto" },
      { "front": "Luggage", "back": "Bagagem", "example": "My luggage is too heavy." },
      { "front": "Flight", "back": "Voo" }
    ]
  }
}`}
              </Box>
            )}
            {importTab === 6 && (
              <Box component="pre" sx={{ p: 1.5, bgcolor: '#1e1e1e', color: '#d4d4d4', borderRadius: 1, mb: 2, fontSize: '0.72rem', overflowX: 'auto', maxHeight: 180, whiteSpace: 'pre-wrap' }}>
{`[
  {
    "title": "1. Present Simple (Quiz)",
    "type": "quiz",
    "level": "Beginner",
    "content": {
      "text": "Choose the best option:",
      "questions": [{ "question": "She ___ a car.", "options": ["has","have"], "correct": "has" }]
    }
  },
  {
    "title": "2. Write your routine (Escrita)",
    "type": "writing",
    "level": "Intermediate",
    "content": { "prompt": "Write about your daily routine.", "minWords": 30 }
  },
  {
    "title": "3. True/False (V ou F)",
    "type": "true-false",
    "level": "Beginner",
    "content": {
      "text": "Mary lives in Rome.",
      "statements": [{ "statement": "Mary lives in Italy.", "correct": true }]
    }
  },
  {
    "title": "4. Sentence Builder (Frases)",
    "type": "sentence-order",
    "level": "Beginner",
    "content": {
      "instructions": "Order the words:",
      "sentences": [{ "words": ["He","is","here"], "correct": "He is here" }]
    }
  },
  {
    "title": "5. Match column (Relacionar)",
    "type": "matching",
    "level": "Beginner",
    "content": {
      "instructions": "Match pairs:",
      "pairs": [{ "left": "Apple", "right": "Maçã" }]
    }
  },
  {
    "title": "6. Flashcards (Vocabulário)",
    "type": "flashcards",
    "level": "Beginner",
    "content": {
      "instructions": "Study cards:",
      "cards": [{ "front": "Hello", "back": "Olá" }]
    }
  }
]`}
              </Box>
            )}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Ou carregue um arquivo .json salvo no seu computador:
              </Typography>
              <Button
                variant="outlined"
                component="label"
                size="small"
                startIcon={<CloudUploadIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', py: 0.5 }}
              >
                Anexar JSON
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
            <TextField
              label="Cole o JSON aqui"
              multiline rows={7} fullWidth
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              sx={{ fontFamily: 'monospace' }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImportDialog(false)}>Cancelar</Button>
            <Button onClick={handleImportExercises} variant="contained">Importar</Button>
          </DialogActions>
        </Dialog>

        {/* Manual Exercise Dialog */}
        <Dialog open={openManualExerciseDialog} onClose={() => setOpenManualExerciseDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Criar Atividade Manualmente</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField 
                label="Título da Atividade" 
                value={manualExercise.title}
                onChange={(e) => setManualExercise({...manualExercise, title: e.target.value})}
                fullWidth
                required
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Nível</InputLabel>
                <Select 
                  value={manualExercise.level}
                  onChange={(e) => setManualExercise({...manualExercise, level: e.target.value})}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={manualExercise.type}
                  onChange={(e) => setManualExercise({...manualExercise, type: e.target.value})}
                >
                  <MenuItem value="text">📖 Texto (Leitura)</MenuItem>
                  <MenuItem value="quiz">🧠 Quiz (Múltipla Escolha)</MenuItem>
                  <MenuItem value="writing">✍️ Resposta Escrita</MenuItem>
                  <MenuItem value="true-false">✅ Verdadeiro ou Falso</MenuItem>
                  <MenuItem value="sentence-order">🧩 Montar a Frase</MenuItem>
                  <MenuItem value="matching">🔗 Relacionar Colunas</MenuItem>
                  <MenuItem value="flashcards">🎴 Flashcards</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Base text for text/quiz/true-false */}
            {['text', 'quiz', 'true-false'].includes(manualExercise.type) && (
              <TextField
                label={manualExercise.type === 'true-false' ? 'Texto Base (opcional)' : 'Texto Base / Conteúdo'}
                multiline rows={4} fullWidth
                value={manualExercise.text}
                onChange={(e) => setManualExercise({...manualExercise, text: e.target.value})}
                sx={{ mb: 3 }}
              />
            )}

            {/* QUIZ */}
            {manualExercise.type === 'quiz' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Questões do Quiz</Typography>
                {manualExercise.questions.map((q, idx) => (
                  <Card key={idx} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Questão {idx + 1}</Typography>
                    <TextField
                      label="Pergunta" fullWidth
                      value={q.question}
                      onChange={(e) => {
                        const newQ = manualExercise.questions.map((qi, i) => i === idx ? {...qi, question: e.target.value} : qi);
                        setManualExercise({...manualExercise, questions: newQ});
                      }}
                      sx={{ mb: 2 }}
                    />
                    <Grid container spacing={2}>
                      {[0, 1, 2, 3].map(optIdx => (
                        <Grid item xs={12} sm={6} key={optIdx}>
                          <TextField
                            label={`Alternativa ${String.fromCharCode(65 + optIdx)}`}
                            fullWidth size="small"
                            value={q.options[optIdx]}
                            onChange={(e) => {
                              const newQ = manualExercise.questions.map((qi, i) => {
                                if (i !== idx) return qi;
                                const newOpts = [...qi.options];
                                newOpts[optIdx] = e.target.value;
                                return {...qi, options: newOpts};
                              });
                              setManualExercise({...manualExercise, questions: newQ});
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <FormControl fullWidth sx={{ mt: 2 }} size="small">
                      <InputLabel>Resposta Correta</InputLabel>
                      <Select
                        value={q.correct}
                        onChange={(e) => {
                          const newQ = manualExercise.questions.map((qi, i) => i === idx ? {...qi, correct: e.target.value} : qi);
                          setManualExercise({...manualExercise, questions: newQ});
                        }}
                      >
                        {q.options.map((opt, i) => opt ? <MenuItem key={i} value={opt}>{opt}</MenuItem> : null)}
                      </Select>
                    </FormControl>
                  </Card>
                ))}
              </Box>
            )}

            {/* WRITING */}
            {manualExercise.type === 'writing' && (
              <Box>
                <TextField
                  label="Instrução / Prompt (o que o aluno deve escrever)"
                  multiline rows={3} fullWidth
                  value={manualExercise.writingPrompt}
                  onChange={(e) => setManualExercise({...manualExercise, writingPrompt: e.target.value})}
                  sx={{ mb: 2 }}
                  placeholder="Ex: Write a paragraph about your daily routine using Present Simple..."
                />
                <TextField
                  label="Mínimo de palavras"
                  type="number" size="small"
                  value={manualExercise.writingMinWords}
                  onChange={(e) => setManualExercise({...manualExercise, writingMinWords: e.target.value})}
                  sx={{ mb: 2, width: 200 }}
                />
                <TextField
                  label="Dicas (uma por linha)"
                  multiline rows={3} fullWidth
                  value={manualExercise.writingTips}
                  onChange={(e) => setManualExercise({...manualExercise, writingTips: e.target.value})}
                  placeholder="Use: wake up, have breakfast..."
                />
              </Box>
            )}

            {/* TRUE / FALSE */}
            {manualExercise.type === 'true-false' && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Afirmações</Typography>
                {manualExercise.tfStatements.map((st, idx) => (
                  <Card key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Afirmação {idx + 1}</Typography>
                    <TextField
                      label="Afirmação" fullWidth
                      value={st.statement}
                      onChange={(e) => {
                        const newS = manualExercise.tfStatements.map((s, i) => i === idx ? {...s, statement: e.target.value} : s);
                        setManualExercise({...manualExercise, tfStatements: newS});
                      }}
                      sx={{ mb: 1 }}
                    />
                    <FormControl size="small">
                      <InputLabel>Resposta</InputLabel>
                      <Select
                        value={String(st.correct)}
                        onChange={(e) => {
                          const newS = manualExercise.tfStatements.map((s, i) => i === idx ? {...s, correct: e.target.value === 'true'} : s);
                          setManualExercise({...manualExercise, tfStatements: newS});
                        }}
                        sx={{ minWidth: 160 }}
                      >
                        <MenuItem value="true">✅ Verdadeiro</MenuItem>
                        <MenuItem value="false">❌ Falso</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                ))}
              </Box>
            )}

            {/* SENTENCE ORDER */}
            {manualExercise.type === 'sentence-order' && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Escreva a frase correta e as palavras separadas por vírgula. As palavras serão embaralhadas automaticamente para o aluno.
                </Alert>
                {manualExercise.soSentences.map((s, idx) => (
                  <Card key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Frase {idx + 1}</Typography>
                    <TextField
                      label="Frase correta" fullWidth
                      value={s.correct}
                      onChange={(e) => {
                        const newS = manualExercise.soSentences.map((si, i) => i === idx ? {...si, correct: e.target.value} : si);
                        setManualExercise({...manualExercise, soSentences: newS});
                      }}
                      sx={{ mb: 1 }}
                      placeholder="Ex: She drinks coffee every morning"
                    />
                    <TextField
                      label="Palavras embaralhadas (separadas por vírgula)"
                      fullWidth
                      value={s.words}
                      onChange={(e) => {
                        const newS = manualExercise.soSentences.map((si, i) => i === idx ? {...si, words: e.target.value} : si);
                        setManualExercise({...manualExercise, soSentences: newS});
                      }}
                      placeholder="Ex: She, every, morning, coffee, drinks"
                    />
                  </Card>
                ))}
              </Box>
            )}

            {/* MATCHING */}
            {manualExercise.type === 'matching' && (
              <Box>
                <TextField
                  label="Instrução"
                  fullWidth value={manualExercise.matchingInstructions}
                  onChange={(e) => setManualExercise({...manualExercise, matchingInstructions: e.target.value})}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6" sx={{ mb: 2 }}>Pares</Typography>
                {manualExercise.matchingPairs.map((pair, idx) => (
                  <Card key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Par {idx + 1}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Coluna A" size="small"
                        value={pair.left}
                        onChange={(e) => {
                          const newP = manualExercise.matchingPairs.map((p, i) => i === idx ? {...p, left: e.target.value} : p);
                          setManualExercise({...manualExercise, matchingPairs: newP});
                        }}
                        placeholder="Ex: Dog"
                      />
                      <TextField
                        label="Coluna B" size="small"
                        value={pair.right}
                        onChange={(e) => {
                          const newP = manualExercise.matchingPairs.map((p, i) => i === idx ? {...p, right: e.target.value} : p);
                          setManualExercise({...manualExercise, matchingPairs: newP});
                        }}
                        placeholder="Ex: Animal que late"
                      />
                    </Box>
                  </Card>
                ))}
              </Box>
            )}

            {/* FLASHCARDS */}
            {manualExercise.type === 'flashcards' && (
              <Box>
                <TextField
                  label="Instrução (o que o aluno deve fazer)"
                  fullWidth
                  value={manualExercise.flashInstructions}
                  onChange={(e) => setManualExercise({...manualExercise, flashInstructions: e.target.value})}
                  sx={{ mb: 3 }}
                  placeholder="Ex: Clique no cartão para ver a tradução em português."
                />
                <Typography variant="h6" sx={{ mb: 2 }}>Cartões</Typography>
                {manualExercise.flashCards.map((card, idx) => (
                  <Card key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f9f4ff', border: '1px solid #ce93d8' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#7b1fa2' }}>Cartão {idx + 1}</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Frente (Inglês)" size="small"
                        value={card.front}
                        onChange={(e) => {
                          const newC = manualExercise.flashCards.map((c, i) => i === idx ? {...c, front: e.target.value} : c);
                          setManualExercise({...manualExercise, flashCards: newC});
                        }}
                        placeholder="Ex: Airport"
                      />
                      <TextField
                        label="Verso (Português)" size="small"
                        value={card.back}
                        onChange={(e) => {
                          const newC = manualExercise.flashCards.map((c, i) => i === idx ? {...c, back: e.target.value} : c);
                          setManualExercise({...manualExercise, flashCards: newC});
                        }}
                        placeholder="Ex: Aeroporto"
                      />
                      <TextField
                        label="Exemplo (opcional)" size="small"
                        value={card.example}
                        onChange={(e) => {
                          const newC = manualExercise.flashCards.map((c, i) => i === idx ? {...c, example: e.target.value} : c);
                          setManualExercise({...manualExercise, flashCards: newC});
                        }}
                        placeholder="Ex: I missed my flight."
                      />
                    </Box>
                  </Card>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setManualExercise({...manualExercise, flashCards: [...manualExercise.flashCards, { front: '', back: '', example: '' }]})}
                  sx={{ mt: 1 }}
                >
                  + Adicionar Cartão
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenManualExerciseDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateManualExercise} variant="contained" disabled={!manualExercise.title}>Salvar Atividade</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Presença Tab */}
      <TabPanel value={tab} index={2}>
        <Button 
          variant="contained" 
          startIcon={<EventAvailableIcon />} 
          onClick={() => setOpenAttendanceDialog(true)} 
          sx={{ 
            mb: 3,
            borderRadius: 3, 
            px: 3, 
            background: 'linear-gradient(135deg, #7c4dff 0%, #b388ff 100%)',
            boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
              boxShadow: '0 6px 20px rgba(124, 77, 255, 0.45)'
            }
          }}
        >
          Registrar Presença
        </Button>
        
        <Dialog open={openAttendanceDialog} onClose={() => setOpenAttendanceDialog(false)}>
          <DialogTitle>Marcar Presença</DialogTitle>
          <DialogContent sx={{ minWidth: 400, mt: 2 }}>
             <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Selecionar Aluno</InputLabel>
              <Select 
                value={attendanceForm.userId} 
                onChange={(e) => setAttendanceForm({...attendanceForm, userId: e.target.value})}
              >
                {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField 
              label="Data da Aula" 
              type="date" 
              fullWidth 
              sx={{ mb: 2 }} 
              InputLabelProps={{ shrink: true }}
              value={attendanceForm.date}
              onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
            />
            <TextField 
              label="Hora da Aula" 
              type="time" 
              fullWidth 
              InputLabelProps={{ shrink: true }}
              value={attendanceForm.time}
              onChange={(e) => setAttendanceForm({...attendanceForm, time: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
             <Button onClick={() => setOpenAttendanceDialog(false)}>Cancelar</Button>
             <Button variant="contained" onClick={handleMarkAttendance}>Registrar</Button>
          </DialogActions>
        </Dialog>

        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 900, color: '#fff' }}>Histórico Geral de Presenças 🗓️</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
           <Table>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
               <TableRow>
                 <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Aluno</TableCell>
                 <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Data</TableCell>
                 <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Hora</TableCell>
                 <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Ações</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {globalAttendance.map((att) => (
                 <TableRow key={att.id} hover sx={{ 
                   '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                   '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff' }
                 }}>
                   <TableCell sx={{ fontWeight: 700 }}>{att.user?.name || 'N/A'}</TableCell>
                   <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                   <TableCell>{att.time}</TableCell>
                   <TableCell>
                     <Box sx={{ display: 'flex', gap: 1 }}>
                       <Button 
                         size="small" 
                         variant="outlined" 
                         onClick={() => handleOpenEditAttendance(att)}
                         sx={{ 
                           color: '#b388ff', 
                           borderColor: 'rgba(179, 136, 255, 0.4)',
                           fontWeight: 700,
                           textTransform: 'none',
                           borderRadius: 2,
                           '&:hover': { borderColor: '#b388ff', bgcolor: 'rgba(179, 136, 255, 0.05)' }
                         }}
                       >
                         Editar
                       </Button>
                       <Button 
                         size="small" 
                         variant="outlined" 
                         color="error" 
                         onClick={() => handleDeleteAttendance(att.id)}
                         sx={{ 
                           color: '#ff5a79', 
                           borderColor: 'rgba(255, 90, 121, 0.4)',
                           fontWeight: 700,
                           textTransform: 'none',
                           borderRadius: 2,
                           '&:hover': { borderColor: '#ff5a79', bgcolor: 'rgba(255, 90, 121, 0.05)' }
                         }}
                       >
                         Remover
                       </Button>
                     </Box>
                   </TableCell>
                 </TableRow>
               ))}
               {globalAttendance.length === 0 && (
                 <TableRow sx={{ '& td': { borderBottom: 'none', color: 'rgba(255,255,255,0.4)' } }}>
                   <TableCell colSpan={4} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                     Nenhuma presença registrada ainda.
                   </TableCell>
                 </TableRow>
               )}
            </TableBody>
           </Table>
        </TableContainer>

        {/* Edit Attendance Dialog */}
        <Dialog open={openEditAttendanceDialog} onClose={() => setOpenEditAttendanceDialog(false)}>
          <DialogTitle>Editar Registro de Presença</DialogTitle>
          <DialogContent sx={{ minWidth: 400, mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Aluno</InputLabel>
              <Select
                value={editAttendanceForm.userId}
                onChange={(e) => setEditAttendanceForm({...editAttendanceForm, userId: e.target.value})}
              >
                {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Data da Aula"
              type="date"
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              value={editAttendanceForm.date}
              onChange={(e) => setEditAttendanceForm({...editAttendanceForm, date: e.target.value})}
            />
            <TextField
              label="Hora da Aula"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editAttendanceForm.time}
              onChange={(e) => setEditAttendanceForm({...editAttendanceForm, time: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditAttendanceDialog(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveEditAttendance}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Monitoramento Tab */}
      <TabPanel value={tab} index={4}>
        {selectedMonitorStudent ? (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                👤 Monitoramento: {selectedMonitorStudent.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => setOpenAssignDialog(true)}>
                  Atribuir Atividade
                </Button>
                <Button onClick={() => setSelectedMonitorStudent(null)} variant="outlined">
                  Voltar para Lista
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                  <AssignmentIcon sx={{ fontSize: 40, mb: 1, color: '#1976d2' }} />
                  <Typography variant="h6">Enviadas</Typography>
                  <Typography variant="h4">{studentProgress.length}</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
                  <CheckCircleIcon sx={{ fontSize: 40, mb: 1, color: '#2e7d32' }} />
                  <Typography variant="h6">Finalizadas</Typography>
                  <Typography variant="h4">{studentProgress.filter(p => p.status === 'completed').length}</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                  <ActivityIcon sx={{ fontSize: 40, mb: 1, color: '#ef6c00' }} />
                  <Typography variant="h6">Acertos</Typography>
                  <Typography variant="h4">
                    {studentProgress.reduce((sum, p) => sum + (p.score || 0), 0)} / {studentProgress.reduce((sum, p) => sum + (p.totalQuestions || 0), 0)}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                  <EventAvailableIcon sx={{ fontSize: 40, mb: 1, color: '#7b1fa2' }} />
                  <Typography variant="h6">Aulas Realizadas</Typography>
                  <Typography variant="h4">{allAttendance.length}</Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Exercise History ... same as before but bigger score details */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 900, color: '#fff' }}>Histórico de Atividades 📝</Typography>
            <TableContainer component={Paper} elevation={0} sx={{ 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Atividade</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Acertos</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Enviado em</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Respostas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentProgress.map((p) => (
                    <TableRow key={p.id} hover sx={{ 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                      '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff' }
                    }}>
                      <TableCell sx={{ fontWeight: 700 }}>{p.exercise.title}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={p.exercise.type}
                          sx={{ 
                            fontWeight: 700, 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            color: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={p.status} 
                          sx={{ 
                            fontWeight: 800,
                            bgcolor: p.status === 'completed' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                            color: p.status === 'completed' ? '#4caf50' : '#2196f3',
                            border: `1px solid ${p.status === 'completed' ? 'rgba(76, 175, 80, 0.25)' : 'rgba(33, 150, 243, 0.25)'}`
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {p.status === 'completed' ? `${p.score}/${p.totalQuestions}` : '-'}
                      </TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {p.status === 'completed' && p.result && (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={() => { setSelectedProgressEntry(p); setOpenResponseDialog(true); }}
                              sx={{ 
                                color: '#00b4d8', 
                                borderColor: 'rgba(0, 180, 216, 0.4)',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: 2,
                                '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0, 180, 216, 0.05)' }
                              }}
                            >
                              Ver Respostas
                            </Button>
                          )}
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="warning" 
                            startIcon={<ReplayIcon />} 
                            onClick={() => handleRestartQuiz(p)} 
                            title="Zerar e enviar novamente"
                            sx={{ 
                              color: '#ff9800', 
                              borderColor: 'rgba(255, 152, 0, 0.4)',
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: 2,
                              '&:hover': { borderColor: '#ff9800', bgcolor: 'rgba(255, 152, 0, 0.05)' }
                            }}
                          >
                            Reiniciar
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box sx={{ py: 3 }}>
             {/* Co-op RPG Real-time Battle Monitoring */}
             <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', color: '#fff', borderRadius: 4, boxShadow: '0 8px 32px rgba(124, 77, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0.5, color: '#b388ff', display: 'flex', alignItems: 'center', gap: 1 }}>
                     ⚔️ RPG Co-op: Combates Ativos
                   </Typography>
                   <Chip label="Ao Vivo" color="error" size="small" sx={{ fontWeight: 800, px: 0.5 }} />
                 </Box>
                 <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                   Atualiza a cada 3s
                 </Typography>
               </Box>

               {activeRpgGames.length > 0 ? (
                 <Grid container spacing={3}>
                   {activeRpgGames.map((game) => {
                     const monsterColors = {
                       slime: '#4caf50',
                       skeleton: '#9e9e9e',
                       dragon: '#f44336'
                     };
                     const monsterColor = monsterColors[game.monsterType] || '#00b4d8';
                     const hpPercent = Math.round((game.monsterHp / game.maxMonsterHp) * 100);

                     return (
                       <Grid item xs={12} md={6} key={game.roomCode}>
                         <Card sx={{
                           p: 2.5,
                           background: 'rgba(255, 255, 255, 0.04)',
                           border: '1px solid rgba(255, 255, 255, 0.08)',
                           borderRadius: 3,
                           color: '#fff',
                           boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                         }}>
                           {/* Header */}
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                             <Box>
                               <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00b4d8' }}>
                                 SALA: <span style={{ letterSpacing: 1, color: '#fff', fontSize: '1.1rem', fontWeight: 950 }}>{game.roomCode}</span>
                               </Typography>
                               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                 Estágio {game.stage}/3
                               </Typography>
                             </Box>
                             <Chip
                               label={game.status.toUpperCase()}
                               size="small"
                               sx={{
                                 fontWeight: 800,
                                 fontSize: '0.7rem',
                                 bgcolor: game.status === 'victory' ? 'rgba(76, 175, 80, 0.2)' : game.status === 'defeat' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(0, 180, 216, 0.2)',
                                 color: game.status === 'victory' ? '#4caf50' : game.status === 'defeat' ? '#f44336' : '#00b4d8',
                                 border: `1px solid ${game.status === 'victory' ? 'rgba(76, 175, 80, 0.3)' : game.status === 'defeat' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(0, 180, 216, 0.3)'}`
                               }}
                             />
                           </Box>

                           {/* Monster Status */}
                           <Box sx={{ mb: 2.5 }}>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                               <Typography variant="body2" sx={{ fontWeight: 700, color: monsterColor, textTransform: 'uppercase' }}>
                                 👾 {game.monsterType}
                               </Typography>
                               <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                 {game.monsterHp} / {game.maxMonsterHp} HP
                               </Typography>
                             </Box>
                             {/* Progress Bar */}
                             <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                               <Box sx={{ width: `${hpPercent}%`, height: '100%', bgcolor: monsterColor, transition: 'width 0.3s ease' }} />
                             </Box>
                           </Box>

                           {/* Players Status */}
                           <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                             {game.players.map((p) => {
                               const playerHpPercent = p.hp;
                               return (
                                 <Box key={p.id} sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2.5, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                   <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                     👤 {p.name}
                                   </Typography>
                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5, mb: 0.5 }}>
                                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>HP</Typography>
                                     <Typography variant="caption" sx={{ fontWeight: 700, color: p.hp > 30 ? '#4caf50' : '#f44336' }}>{p.hp}/100</Typography>
                                   </Box>
                                   <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                                     <Box sx={{ width: `${playerHpPercent}%`, height: '100%', bgcolor: p.hp > 30 ? '#4caf50' : '#f44336' }} />
                                   </Box>
                                 </Box>
                               );
                             })}
                             {game.players.length === 1 && (
                               <Box sx={{ flex: 1, p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255, 255, 255, 0.01)', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: 2.5 }}>
                                 <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                   Aguardando Jogador 2...
                                 </Typography>
                               </Box>
                             )}
                           </Box>

                           {/* Combat Log */}
                           <Box sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2.5, maxHeight: 120, overflowY: 'auto' }}>
                             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                               Histórico de Combate
                             </Typography>
                             {game.combatLog.length > 0 ? (
                               game.combatLog.map((log, idx) => (
                                 <Typography key={idx} variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, mb: 0.2 }}>
                                   {log}
                                 </Typography>
                               ))
                             ) : (
                               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                 Nenhum evento registrado.
                               </Typography>
                             )}
                           </Box>
                         </Card>
                       </Grid>
                     );
                   })}
                 </Grid>
               ) : (
                 <Box sx={{ textAlign: 'center', py: 4 }}>
                   <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                     Nenhum jogo de RPG Co-op ativo no momento.
                   </Typography>
                 </Box>
               )}
             </Card>

             <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, color: '#fff' }}>👤 Monitoramento de Alunos</Typography>
             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>Selecione um aluno abaixo para ver o histórico individual de atividades e presenças.</Typography>
             <TableContainer component={Paper} elevation={0} sx={{ 
               border: '1px solid rgba(255, 255, 255, 0.08)', 
               borderRadius: 4,
               background: 'rgba(255, 255, 255, 0.02)',
               backdropFilter: 'blur(10px)',
               boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
               mt: 2
             }}>
                <Table>
                  <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.04)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Aluno</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Nível</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Progresso</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id} hover sx={{ 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02) !important' },
                        '& td': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff' }
                      }}>
                        <TableCell sx={{ fontWeight: 700 }}>{s.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={s.enrollments?.[0]?.studentLevel || 'N/A'}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              bgcolor: s.enrollments?.[0]?.studentLevel === 'Advanced' ? 'rgba(76, 175, 80, 0.15)' : s.enrollments?.[0]?.studentLevel === 'Intermediate' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(33, 150, 243, 0.15)',
                              color: s.enrollments?.[0]?.studentLevel === 'Advanced' ? '#4caf50' : s.enrollments?.[0]?.studentLevel === 'Intermediate' ? '#ff9800' : '#2196f3',
                              border: `1px solid ${s.enrollments?.[0]?.studentLevel === 'Advanced' ? 'rgba(76, 175, 80, 0.25)' : s.enrollments?.[0]?.studentLevel === 'Intermediate' ? 'rgba(255, 152, 0, 0.25)' : 'rgba(33, 150, 243, 0.25)'}`
                            }}
                          />
                        </TableCell>
                        <TableCell>
                           {/* Simplified progress preview */}
                           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                             Monitoramento ativo...
                           </Typography>
                        </TableCell>
                        <TableCell>
                           <Button 
                             variant="outlined" 
                             size="small" 
                             onClick={() => {
                               setSelectedMonitorStudent(s);
                               handleViewProgress(s.id);
                               loadAllAttendance(s.id);
                             }}
                             sx={{ 
                               color: '#b388ff', 
                               borderColor: 'rgba(179, 136, 255, 0.4)',
                               fontWeight: 700,
                               textTransform: 'none',
                               borderRadius: 2,
                               '&:hover': { borderColor: '#b388ff', bgcolor: 'rgba(179, 136, 255, 0.05)' }
                             }}
                           >
                             Abrir Monitoramento
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </TableContainer>
          </Box>
        )}

        {/* Assign Dialog */}
        <Dialog open={openAssignDialog} onClose={() => { setOpenAssignDialog(false); setSelectedExercisesToAssign([]); }} maxWidth="sm" fullWidth>
          <DialogTitle>Atribuir Atividades para {selectedMonitorStudent?.name}</DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Selecione uma ou mais atividades para atribuir a este aluno. Atividades que o aluno já possui estão marcadas com check e desabilitadas na lista.
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="assign-exercises-label">Selecionar Atividades</InputLabel>
              <Select
                labelId="assign-exercises-label"
                multiple
                value={selectedExercisesToAssign}
                onChange={(e) => setSelectedExercisesToAssign(e.target.value)}
                renderValue={(selected) => {
                  const names = selected.map(id => {
                    const ex = allExercises.find(x => x.id === id);
                    return ex ? ex.title : id;
                  });
                  return names.join(', ');
                }}
              >
                {allExercises.map((ex) => {
                  const isAssigned = studentProgress.some(p => p.exercise?.id === ex.id);
                  const isChecked = isAssigned || selectedExercisesToAssign.indexOf(ex.id) > -1;
                  return (
                    <MenuItem 
                      key={ex.id} 
                      value={ex.id}
                      disabled={isAssigned}
                    >
                      <Checkbox checked={isChecked} disabled={isAssigned} />
                      <ListItemText 
                        primary={ex.title} 
                        secondary={`${ex.level} - ${ex.type}${isAssigned ? ' (Já atribuída)' : ''}`} 
                      />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenAssignDialog(false); setSelectedExercisesToAssign([]); }}>Cancelar</Button>
            <Button onClick={handleAssignExercise} variant="contained" color="primary">
              Atribuir ({selectedExercisesToAssign.length})
            </Button>
          </DialogActions>
        </Dialog>

        {/* Response Viewer Dialog */}
        <Dialog open={openResponseDialog} onClose={() => setOpenResponseDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            📝 Respostas de {selectedMonitorStudent?.name}
            {selectedProgressEntry && (
              <Typography variant="subtitle2" color="textSecondary">
                {selectedProgressEntry.exercise?.title} — {selectedProgressEntry.score}/{selectedProgressEntry.totalQuestions} acertos
              </Typography>
            )}
          </DialogTitle>
          <DialogContent sx={{ mt: 1 }}>
            {selectedProgressEntry && (() => {
              const exercise = selectedProgressEntry.exercise;
              const result = selectedProgressEntry.result;
              const studentAnswers = result?.answers || {};
              const questions = exercise?.content?.questions;

              const effectiveType = (exercise?.type === 'text' && exercise?.content?.prompt)
                ? 'writing' : exercise?.type;

              // ── Writing: show submitted text ────────────────────────────────
              if (effectiveType === 'writing') {
                const writingText = studentAnswers[0] || result?.writingAnswer || '';
                return (
                  <Box>
                    <Box sx={{ p: 2.5, bgcolor: '#f9f4ff', border: '1px solid #ce93d8', borderRadius: 2, mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#7b1fa2', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                        ✍️ Prompt (tema da atividade):
                      </Typography>
                      <Typography variant="body2" color="textSecondary">{exercise?.content?.prompt}</Typography>
                    </Box>
                    <Box sx={{ p: 2.5, bgcolor: '#fafffa', border: '1px solid #a5d6a7', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2e7d32', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                        📝 Texto enviado pela aluna:
                      </Typography>
                      {writingText ? (
                        <Typography variant="body1" sx={{ fontFamily: 'Georgia, serif', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                          {writingText}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">Nenhum texto foi enviado.</Typography>
                      )}
                    </Box>
                    {exercise?.content?.minWords > 0 && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Mínimo exigido: {exercise.content.minWords} palavras · Enviado: {writingText.trim().split(/\s+/).filter(Boolean).length} palavras
                      </Typography>
                    )}
                  </Box>
                );
              }

              // ── True/False: show statements with answers ────────────────────
              if (effectiveType === 'true-false' && Array.isArray(result?.validation)) {
                return (
                  <Box>
                    {result.validation.map((r, i) => (
                      <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}` }}>
                        <Typography variant="body2" fontWeight={700}>{r.isCorrect ? '✅' : '❌'} {r.statement}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Aluna respondeu: <strong>{r.userAnswer ? 'Verdadeiro' : 'Falso'}</strong>
                          {!r.isCorrect && ` · Correto: ${r.correctAnswer ? 'Verdadeiro' : 'Falso'}`}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                );
              }

              // ── Sentence Order ──────────────────────────────────────────────
              if (effectiveType === 'sentence-order' && Array.isArray(result?.validation)) {
                return (
                  <Box>
                    {result.validation.map((r, i) => (
                      <Card key={i} sx={{ p: 2, mb: 1.5, borderLeft: `4px solid ${r.isCorrect ? '#4caf50' : '#f44336'}` }}>
                        <Typography variant="caption" fontWeight={700} color={r.isCorrect ? 'success.main' : 'error'}>
                          {r.isCorrect ? '✅ Correto' : '❌ Errado'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>Aluna: <em>{r.userAnswer}</em></Typography>
                        {!r.isCorrect && <Typography variant="body2" color="success.main">Correto: <strong>{r.sentence}</strong></Typography>}
                      </Card>
                    ))}
                  </Box>
                );
              }

              // ── Text / Reading ──────────────────────────────────────────────
              if (effectiveType === 'text' || !questions || !Array.isArray(questions)) {
                return (
                  <Box sx={{ p: 2, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {exercise?.content?.text || 'Sem conteúdo'}
                    </Typography>
                    <Typography sx={{ mt: 2 }} color="success.main">✅ Atividade de leitura concluída.</Typography>
                  </Box>
                );
              }

              return (
                <Box>
                  {exercise?.content?.text && (
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, mb: 3 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{exercise.content.text}</Typography>
                    </Box>
                  )}
                  {questions.map((q, idx) => {
                    const studentAnswer = studentAnswers[idx] || '';
                    const correct = q.correct || q.a || '';
                    const isCorrect = studentAnswer.trim().toLowerCase() === correct.trim().toLowerCase();
                    return (
                      <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {idx + 1}. {q.question}
                        </Typography>
                        {q.options.map((opt, optIdx) => {
                          const isStudentChoice = opt === studentAnswer;
                          const isCorrectOpt = opt === correct;
                          let bgcolor = 'transparent';
                          if (isCorrectOpt) bgcolor = '#e8f5e9';
                          if (isStudentChoice && !isCorrectOpt) bgcolor = '#ffebee';
                          return (
                            <Box key={optIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.5, borderRadius: 1, bgcolor, mb: 0.5 }}>
                              <Typography variant="body2">
                                {isStudentChoice ? '👉 ' : isCorrectOpt ? '✅ ' : '    '}
                                {opt}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Card>
                    );
                  })}
                </Box>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResponseDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
