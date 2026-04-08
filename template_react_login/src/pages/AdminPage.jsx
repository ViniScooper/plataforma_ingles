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
  IconButton,
  Paper,
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
  <Card sx={{ p: 3, borderRadius: 4, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
      <Paper sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}15`, color }}>{icon}</Paper>
      <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>{title}</Typography>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>{value}</Typography>
    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <TrendingUpIcon sx={{ fontSize: 14, color: '#4caf50' }} />
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
  });

  const [selectedExerciseToAssign, setSelectedExerciseToAssign] = useState('');
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
      setTab(3); // Switch to Monitoring tab
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
        4: 'matching'
      };
      const fallbackType = tabTypeMap[importTab];

      // Process exercises: if it's an array, force the type for all; if single object, force for it.
      // This ensures that the active tab ALWAYS overrides whatever is inside the JSON.
      const exercisesArray = Array.isArray(data) ? data : [data];
      const processedExercises = exercisesArray.map(ex => ({
        ...ex,
        type: fallbackType || 'text' // Força o tipo baseado na aba escolhida
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
      await apiClient.post('/assignments', {
        userId: selectedMonitorStudent.id,
        exerciseId: parseInt(selectedExerciseToAssign),
      });
      setSelectedExerciseToAssign('');
      setOpenAssignDialog(false);
      handleViewProgress(selectedMonitorStudent.id); // Refresh progress
    } catch (err) {
      setError('Failed to assign exercise: ' + err.response?.data?.message);
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 10,
          pt: 4,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2, fontWeight: 700 }}>
                ADMINISTRATION PANEL
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                Dashboard Overview 🚀
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, mt: 0.5 }}>
                Gerencie seus alunos, planos e atividades em um só lugar.
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>Administrator</Typography>
              <Button
                variant="outlined"
                size="small"
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
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5 }}>
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              bgcolor: 'white',
              borderBottom: '1px solid #eee',
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { py: 2, minHeight: 64, fontWeight: 700, fontSize: '0.9rem' }
            }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Visão Geral" />
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Alunos" />
            <Tab icon={<CheckCircleIcon />} iconPosition="start" label="Presença" />
            <Tab icon={<ActivityIcon />} iconPosition="start" label="Atividades" />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="Monitoramento" />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'white' }}>
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
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Gestão de Alunos</Typography>
                <Button variant="contained" startIcon={<PeopleIcon />} onClick={handleOpenCreateStudent} sx={{ borderRadius: 2, px: 3 }}>
                  Novo Aluno
                </Button>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#fafafa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Nível</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Plano</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const enrollment = enrollments.find(e => e.userId === student.id);
                      return (
                        <TableRow key={student.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Paper sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {student.name.charAt(0)}
                              </Paper>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{student.name}</Typography>
                                <Typography variant="caption" color="textSecondary">{student.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={enrollment?.studentLevel || 'N/A'}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                bgcolor: enrollment?.studentLevel === 'Advanced' ? '#e8f5e9' : enrollment?.studentLevel === 'Intermediate' ? '#fff3e0' : '#e3f2fd',
                                color: enrollment?.studentLevel === 'Advanced' ? '#2e7d32' : enrollment?.studentLevel === 'Intermediate' ? '#e65100' : '#1565c0'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">R$ {enrollment?.pricePerClass?.toFixed(2)}/h</Typography>
                            <Typography variant="caption" color="textSecondary">{enrollment?.classesPerWeek}x por semana</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton size="small" color="primary" onClick={() => handleOpenEditStudent(student, enrollment)} title="Editar">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="info" onClick={() => { setSelectedMonitorStudent(student); handleViewProgress(student.id); setTab(4); }} title="Monitorar">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteStudent(student)} title="Excluir">
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
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => setOpenManualExerciseDialog(true)}>
            + Criar Atividade Manualmente
          </Button>
          <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => setOpenImportDialog(true)}>
            Importar JSON
          </Button>
        </Box>
        <TableContainer component={Card}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Nível</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allExercises.map((ex) => {
                const typeColors = { quiz: '#1976d2', text: '#43a047', writing: '#9c27b0', 'gap-fill': '#f57c00', 'true-false': '#2e7d32', 'sentence-order': '#f9a825', matching: '#0288d1' };
                const typeColor = typeColors[ex.type] || '#666';
                return (
                <TableRow key={ex.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>{ex.title}</Typography>
                    <Typography variant="caption" color="text.secondary">ID: {ex.id}</Typography>
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
                            'gap-fill': '✏️ Lacunas'
                          }[ex.type] || ex.type
                        }
                        size="small"
                        sx={{ bgcolor: `${typeColor}22`, color: typeColor, fontWeight: 700, fontSize: '0.72rem' }}
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
                        sx={{ fontSize: '0.72rem', height: 26, '& .MuiSelect-select': { py: 0.3, px: 1 } }}
                        variant="outlined"
                      >
                        <MenuItem value="text" sx={{ fontSize: '0.8rem' }}>📖 Leitura</MenuItem>
                        <MenuItem value="quiz" sx={{ fontSize: '0.8rem' }}>🧠 Quiz</MenuItem>
                        <MenuItem value="writing" sx={{ fontSize: '0.8rem' }}>✍️ Escrita</MenuItem>
                        <MenuItem value="true-false" sx={{ fontSize: '0.8rem' }}>✅ V ou F</MenuItem>
                        <MenuItem value="sentence-order" sx={{ fontSize: '0.8rem' }}>🧩 Frases</MenuItem>
                        <MenuItem value="matching" sx={{ fontSize: '0.8rem' }}>🔗 Relacionar</MenuItem>
                        <MenuItem value="gap-fill" sx={{ fontSize: '0.8rem' }}>✏️ Lacunas</MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell>{ex.level}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" color="info" onClick={() => { setSelectedExerciseJson(ex); setOpenJsonDialog(true); }}>
                      Ver JSON
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteExercise(ex.id)}>
                      Deletar
                    </Button>
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
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>Exemplos por tipo — copie e adapte:</Typography>
            <Tabs value={importTab} onChange={(_, v) => setImportTab(v)} variant="scrollable" scrollButtons="auto"
              sx={{ minHeight: 36, mb: 1, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.75rem', textTransform: 'none' } }}>
              <Tab label="🧠 Quiz" />
              <Tab label="✍️ Escrita" />
              <Tab label="✅ V ou F" />
              <Tab label="🧩 Frases" />
              <Tab label="🔗 Relacionar" />
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenManualExerciseDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateManualExercise} variant="contained" disabled={!manualExercise.title}>Salvar Atividade</Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Presença Tab */}
      <TabPanel value={tab} index={2}>
        <Button variant="contained" startIcon={<EventAvailableIcon />} onClick={() => setOpenAttendanceDialog(true)} sx={{ mb: 2 }}>
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

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Histórico Geral de Presenças</Typography>
        <TableContainer component={Card}>
           <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
               <TableRow>
                 <TableCell>Aluno</TableCell>
                 <TableCell>Data</TableCell>
                 <TableCell>Hora</TableCell>
                 <TableCell>Ações</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {globalAttendance.map((att) => (
                 <TableRow key={att.id}>
                   <TableCell>{att.user?.name || 'N/A'}</TableCell>
                   <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                   <TableCell>{att.time}</TableCell>
                   <TableCell sx={{ display: 'flex', gap: 1 }}>
                     <Button size="small" variant="outlined" onClick={() => handleOpenEditAttendance(att)}>Editar</Button>
                     <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteAttendance(att.id)}>Remover</Button>
                   </TableCell>
                 </TableRow>
               ))}
               {globalAttendance.length === 0 && (
                 <TableRow><TableCell colSpan={4} align="center">Nenhuma presença registrada ainda.</TableCell></TableRow>
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
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Histórico de Atividades</Typography>
            <TableContainer component={Card}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Atividade</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Acertos</TableCell>
                    <TableCell>Enviado em</TableCell>
                    <TableCell>Respostas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentProgress.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.exercise.title}</TableCell>
                      <TableCell>{p.exercise.type}</TableCell>
                      <TableCell>
                        <Chip size="small" label={p.status} color={p.status === 'completed' ? 'success' : 'info'} />
                      </TableCell>
                      <TableCell>
                        {p.status === 'completed' ? `${p.score}/${p.totalQuestions}` : '-'}
                      </TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {p.status === 'completed' && p.result && (
                            <Button size="small" variant="outlined" onClick={() => { setSelectedProgressEntry(p); setOpenResponseDialog(true); }}>
                              Ver Respostas
                            </Button>
                          )}
                          <Button size="small" variant="outlined" color="warning" startIcon={<ReplayIcon />} onClick={() => handleRestartQuiz(p)} title="Zerar e enviar novamente">
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
          <Box sx={{ py: 5 }}>
             <Typography variant="h6" align="center" color="textSecondary">Selecione um aluno na aba "Alunos" para ver o monitoramento.</Typography>
             <TableContainer component={Card} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Aluno</TableCell>
                      <TableCell>Nível</TableCell>
                      <TableCell>Progresso</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.enrollments?.[0]?.studentLevel || 'N/A'}</TableCell>
                        <TableCell>
                           {/* Simplified progress preview */}
                           Tracking dynamic...
                        </TableCell>
                        <TableCell>
                           <Button variant="outlined" size="small" onClick={() => {
                             setSelectedMonitorStudent(s);
                             handleViewProgress(s.id);
                             loadAllAttendance(s.id);
                           }}>Abrir Monitoramento</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </TableContainer>
          </Box>
        )}

        {/* Assign Dialog ... same as before */}
        <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
          <DialogTitle>Atribuir Atividade para {selectedMonitorStudent?.name}</DialogTitle>
          <DialogContent sx={{ minWidth: 400, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Selecionar Atividade</InputLabel>
              <Select
                value={selectedExerciseToAssign}
                onChange={(e) => setSelectedExerciseToAssign(e.target.value)}
              >
                {allExercises.map((ex) => (
                  <MenuItem key={ex.id} value={ex.id}>
                    {ex.title} ({ex.level} - {ex.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignDialog(false)}>Cancelar</Button>
            <Button onClick={handleAssignExercise} variant="contained" color="primary">Atribuir</Button>
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
