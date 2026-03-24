import { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Alert,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Card,
} from '@mui/material';
import apiClient from '../../utils/apiClient';

export default function ExerciseCard({ exercise, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (idx, value) => {
    setAnswers({
      ...answers,
      [idx]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let score = 0;
      let totalQuestions = 0;
      let results = [];

      if (exercise.type === 'quiz') {
        const questions = exercise.content?.questions || [];
        totalQuestions = questions.length;
        results = questions.map((q, idx) => {
          const isCorrect = (answers[idx] || '').trim().toLowerCase() === (q.correct || q.a || '').trim().toLowerCase();
          if (isCorrect) score++;
          return {
            question: q.question || q.q,
            userAnswer: answers[idx],
            correctAnswer: q.correct || q.a,
            isCorrect
          };
        });
        setValidation({ allCorrect: score === totalQuestions, results, score, totalQuestions });
      } else if (exercise.type === 'gap-fill') {
        // ... previous gap-fill logic ...
        const formattedAnswers = Object.entries(answers).map(([gapIndex, userAnswer]) => ({
          gapIndex: parseInt(gapIndex),
          userAnswer,
        }));

        const response = await apiClient.post('/exercises/check', {
          exerciseId: exercise.id,
          answers: formattedAnswers,
        });
        setValidation(response.data);
        score = response.data.correctCount || 0;
        totalQuestions = exercise.gaps?.length || 0;
      } else {
        // Text type
        setValidation({ allCorrect: true, message: 'Atividade concluída!' });
      }

      // Track progress on the backend
      await apiClient.put('/progress/status', {
        userId: exercise.userId,
        exerciseId: exercise.id,
        status: 'completed',
        score,
        totalQuestions,
        result: { answers, validation: results }
      });

      if (onComplete) onComplete();

    } catch (err) {
      console.error('Error checking answers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setValidation(null);
  };

  // ... (keeping renderSentenceWithGaps as is)
  const renderSentenceWithGaps = () => {
     // implementation same as before
     let text = exercise.sentence || '';
     const elements = [];
     let currentPos = 0;
     let gapIndex = 0;

     for (let i = 0; i < text.length; i++) {
       if (text.substr(i, 3) === '___') {
         if (i > currentPos) {
           elements.push(<Typography key={`text-${gapIndex}`} component="span">{text.substring(currentPos, i)}</Typography>);
         }
         elements.push(
           <FormControl key={`gap-${gapIndex}`} sx={{ minWidth: 100, mx: 1 }}>
             <Select size="small" value={answers[gapIndex] || ''} onChange={(e) => handleAnswerChange(gapIndex, e.target.value)}>
               {exercise.gaps?.[gapIndex]?.options.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
             </Select>
           </FormControl>
         );
         currentPos = i + 3;
         gapIndex++;
         i += 2;
       }
     }
     if (currentPos < text.length) elements.push(<Typography key="text-end" component="span">{text.substring(currentPos)}</Typography>);
     return elements;
  };

  return (
    <Box>
      {exercise.type === 'gap-fill' && (
        <Box sx={{ p: 2, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1, mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            {renderSentenceWithGaps()}
          </Box>
        </Box>
      )}

      {exercise.type === 'text' && (
        <Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderLeft: '5px solid #1976d2', borderRadius: 1, mb: 3 }}>
           <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontStyle: 'italic' }}>Leitura:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {exercise.content?.text || 'Sem texto disponível.'}
          </Typography>
        </Box>
      )}

      {exercise.type === 'quiz' && (
        <Box sx={{ mb: 3 }}>
           <Typography variant="body1" sx={{ p: 2, backgroundColor: '#f0f0f0', borderRadius: 1, mb: 3, whiteSpace: 'pre-wrap' }}>
            {exercise.content?.text}
           </Typography>
          {Array.isArray(exercise.content?.questions) && exercise.content.questions.map((q, idx) => (
            <Card key={idx} sx={{ p: 3, mb: 2, borderLeft: validation ? (validation.results?.[idx]?.isCorrect ? '5px solid green' : '5px solid red') : 'none' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {idx + 1}. {q.question || q.q}
              </Typography>
              <RadioGroup
                value={answers[idx] || ''}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              >
                {Array.isArray(q.options) && q.options.map((opt) => (
                  <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} disabled={!!validation} />
                ))}
              </RadioGroup>
            </Card>
          ))}
        </Box>
      )}

      {validation ? (
        <Box>
          <Alert severity={validation.allCorrect ? 'success' : 'warning'} sx={{ mb: 2 }}>
            <Typography variant="h6">
               {validation.allCorrect ? '✅ Excelente! Tudo correto!' : `⚠️ Você acertou ${validation.score} de ${validation.totalQuestions}.`}
            </Typography>
          </Alert>

          <Button variant="outlined" fullWidth onClick={handleReset}>Recomeçar</Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processando...' : exercise.type === 'text' ? 'Marcar como Lido e Concluído' : 'Enviar Respostas'}
        </Button>
      )}
    </Box>
  );
}
