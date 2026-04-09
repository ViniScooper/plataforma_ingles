import { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  TextField,
  Chip,
} from '@mui/material';
import apiClient from '../../utils/apiClient';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wordCount(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Sub-renderers ─────────────────────────────────────────────────────────────

// --- Quiz (multiple choice) ---
function QuizRenderer({ exercise, answers, setAnswers, validation }) {
  return (
    <Box sx={{ mb: 3 }}>
      {exercise.content?.text && (
        <Box sx={{ p: 2.5, backgroundColor: '#f0f4ff', borderLeft: '5px solid #667eea', borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5, fontWeight: 700 }}>📖 Leitura base:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {exercise.content.text}
          </Typography>
        </Box>
      )}
      {Array.isArray(exercise.content?.questions) && exercise.content.questions.map((q, idx) => {
        const result = validation?.results?.[idx];
        return (
          <Card key={idx} sx={{
            p: 3, mb: 2,
            borderLeft: result ? `5px solid ${result.isCorrect ? '#4caf50' : '#f44336'}` : '5px solid #e0e0e0',
            transition: 'border-color 0.3s',
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              {idx + 1}. {q.question || q.q}
            </Typography>
            <RadioGroup value={answers[idx] || ''} onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}>
              {Array.isArray(q.options) && q.options.map((opt) => (
                <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} disabled={!!validation} />
              ))}
            </RadioGroup>
          </Card>
        );
      })}
    </Box>
  );
}

// --- Text (reading) ---
function TextRenderer({ exercise }) {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderLeft: '5px solid #1976d2', borderRadius: 1, mb: 3 }}>
      <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontStyle: 'italic' }}>Leitura:</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {exercise.content?.text || 'Sem texto disponível.'}
      </Typography>
    </Box>
  );
}

// --- Gap-fill ---
function GapFillRenderer({ exercise, answers, setAnswers }) {
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
          <Select size="small" value={answers[gapIndex] || ''} onChange={(e) => setAnswers({ ...answers, [gapIndex]: e.target.value })}>
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

  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1, mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
        {elements}
      </Box>
    </Box>
  );
}

// --- Writing (open response) ---
function WritingRenderer({ exercise, answers, setAnswers, validation }) {
  const prompt = exercise.content?.prompt || '';
  const tips = exercise.content?.tips || [];
  const minWords = exercise.content?.minWords || 0;
  const currentText = answers[0] || '';
  const wc = wordCount(currentText);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ p: 2.5, backgroundColor: '#f3e5f5', borderLeft: '5px solid #9c27b0', borderRadius: 1, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6a1b9a', mb: 0.5 }}>✍️ Instrução:</Typography>
        <Typography variant="body1">{prompt}</Typography>
      </Box>

      {tips.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            💡 Dicas
          </Typography>
          {tips.map((tip, i) => (
            <Typography key={i} variant="body2" sx={{ mt: 0.5, color: '#666' }}>• {tip}</Typography>
          ))}
        </Box>
      )}

      <TextField
        multiline
        rows={7}
        fullWidth
        placeholder="Escreva sua resposta em inglês aqui..."
        value={currentText}
        onChange={(e) => setAnswers({ 0: e.target.value })}
        disabled={!!validation}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Georgia, serif',
            fontSize: '1rem',
            lineHeight: 1.8,
            '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
          }
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color={wc < minWords ? 'error' : 'success.main'}>
          {wc} palavra{wc !== 1 ? 's' : ''} {minWords > 0 ? `(mínimo: ${minWords})` : ''}
        </Typography>
        {minWords > 0 && wc >= minWords && (
          <Typography variant="caption" color="success.main">✅ Mínimo atingido!</Typography>
        )}
      </Box>
    </Box>
  );
}

// --- True / False ---
function TrueFalseRenderer({ exercise, answers, setAnswers, validation }) {
  const text = exercise.content?.text || '';
  const statements = exercise.content?.statements || [];

  return (
    <Box sx={{ mb: 3 }}>
      {text && (
        <Box sx={{ p: 2.5, backgroundColor: '#e8f5e9', borderLeft: '5px solid #43a047', borderRadius: 1, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2e7d32', mb: 0.5 }}>📖 Texto base:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{text}</Typography>
        </Box>
      )}

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#555' }}>
        Marque cada afirmação como Verdadeiro (V) ou Falso (F):
      </Typography>

      {statements.map((st, idx) => {
        const selected = answers[idx];
        const isCorrect = validation ? (selected === st.correct) : null;

        return (
          <Card key={idx} sx={{
            p: 2.5, mb: 2,
            borderLeft: validation ? `5px solid ${isCorrect ? '#4caf50' : '#f44336'}` : '5px solid #e0e0e0',
            transition: 'all 0.3s',
            bgcolor: validation ? (isCorrect ? '#f9fff9' : '#fff9f9') : 'white',
          }}>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1.5 }}>
              {idx + 1}. {st.statement}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[true, false].map((val) => {
                const label = val ? '✅ Verdadeiro' : '❌ Falso';
                const isSelected = selected === val;
                const isThisCorrect = validation && st.correct === val;
                let bgcolor = isSelected ? '#667eea' : '#f5f5f5';
                let color = isSelected ? '#fff' : '#333';
                if (validation) {
                  if (isThisCorrect) { bgcolor = '#4caf50'; color = '#fff'; }
                  else if (isSelected && !isCorrect) { bgcolor = '#f44336'; color = '#fff'; }
                  else { bgcolor = '#f5f5f5'; color = '#aaa'; }
                }
                return (
                  <Button
                    key={String(val)}
                    variant="contained"
                    size="small"
                    disabled={!!validation}
                    onClick={() => setAnswers({ ...answers, [idx]: val })}
                    sx={{
                      bgcolor,
                      color,
                      fontWeight: 700,
                      px: 2.5,
                      borderRadius: 2,
                      border: isSelected && !validation ? '2px solid #3a5bda' : '2px solid transparent',
                      '&:hover': { bgcolor: isSelected ? '#5a6fd6' : '#e0e0e0', color: isSelected ? '#fff' : '#333' },
                      '&.Mui-disabled': { bgcolor, color, opacity: 1 },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
            {validation && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 600, color: isCorrect ? '#2e7d32' : '#c62828' }}>
                {isCorrect ? '✅ Correto!' : `❌ Errado! A resposta correta é: ${st.correct ? 'Verdadeiro' : 'Falso'}`}
              </Typography>
            )}
          </Card>
        );
      })}
    </Box>
  );
}

// --- Sentence Order ---
function SentenceOrderRenderer({ exercise, answers, setAnswers, validation }) {
  const sentences = exercise.content?.sentences || [];
  const instructions = exercise.content?.instructions || 'Organize as palavras para formar a frase correta.';

  // Each item in answers: { selected: string[], remaining: string[] }
  const initSentence = (sentence) => ({
    selected: [],
    remaining: shuffle(sentence.words),
  });

  const getState = (idx) => answers[idx] || initSentence(sentences[idx]);

  const addWord = (sIdx, word) => {
    const st = getState(sIdx);
    const newRemaining = [...st.remaining];
    const wi = newRemaining.indexOf(word);
    if (wi !== -1) newRemaining.splice(wi, 1);
    setAnswers({ ...answers, [sIdx]: { selected: [...st.selected, word], remaining: newRemaining } });
  };

  const removeWord = (sIdx, wordIdx) => {
    const st = getState(sIdx);
    const word = st.selected[wordIdx];
    const newSelected = st.selected.filter((_, i) => i !== wordIdx);
    setAnswers({ ...answers, [sIdx]: { selected: newSelected, remaining: [...st.remaining, word] } });
  };

  const resetSentence = (sIdx) => {
    setAnswers({ ...answers, [sIdx]: initSentence(sentences[sIdx]) });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderLeft: '5px solid #ffc107', borderRadius: 1, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f57f17' }}>🧩 {instructions}</Typography>
      </Box>

      {sentences.map((sentence, sIdx) => {
        const st = getState(sIdx);
        const userSentence = st.selected.join(' ');
        let resultColor = null;
        let isCorrect = false;
        if (validation) {
          isCorrect = userSentence.trim().toLowerCase() === sentence.correct.trim().toLowerCase();
          resultColor = isCorrect ? '#4caf50' : '#f44336';
        }

        return (
          <Card key={sIdx} sx={{
            p: 2.5, mb: 3,
            borderLeft: validation ? `5px solid ${resultColor}` : '5px solid #ffc107',
            transition: 'border-color 0.3s',
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#555' }}>
              Frase {sIdx + 1}:
            </Typography>

            {/* Answer area */}
            <Box sx={{
              minHeight: 48, p: 1.5, mb: 2,
              border: '2px dashed #ccc', borderRadius: 2,
              display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center',
              bgcolor: '#fafafa',
            }}>
              {st.selected.length === 0 && (
                <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                  Clique nas palavras abaixo para montar a frase...
                </Typography>
              )}
              {st.selected.map((word, wIdx) => (
                <Chip
                  key={wIdx}
                  label={word}
                  onClick={() => !validation && removeWord(sIdx, wIdx)}
                  sx={{
                    bgcolor: validation ? (isCorrect ? '#e8f5e9' : '#ffebee') : '#667eea',
                    color: validation ? (isCorrect ? '#2e7d32' : '#c62828') : '#fff',
                    fontWeight: 600,
                    cursor: validation ? 'default' : 'pointer',
                    '&:hover': { bgcolor: validation ? undefined : '#5a6fd6' },
                  }}
                />
              ))}
            </Box>

            {/* Word bank */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {st.remaining.map((word, wIdx) => (
                <Chip
                  key={wIdx}
                  label={word}
                  onClick={() => !validation && addWord(sIdx, word)}
                  variant="outlined"
                  sx={{
                    cursor: validation ? 'default' : 'pointer',
                    fontWeight: 600,
                    '&:hover': { bgcolor: validation ? undefined : '#f0f4ff' },
                    opacity: validation ? 0.5 : 1,
                  }}
                />
              ))}
            </Box>

            {!validation && (
              <Button size="small" onClick={() => resetSentence(sIdx)} sx={{ mt: 0.5, color: '#888' }}>
                ↺ Recomeçar frase
              </Button>
            )}

            {validation && (
              <Box sx={{ mt: 1 }}>
                {isCorrect
                  ? <Typography variant="caption" color="success.main" fontWeight={700}>✅ Perfeito!</Typography>
                  : <Typography variant="caption" color="error" fontWeight={700}>
                      ❌ Resposta correta: <em>{sentence.correct}</em>
                    </Typography>
                }
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
}

// --- Matching ---
function MatchingRenderer({ exercise, answers, setAnswers, validation }) {
  const pairs = exercise.content?.pairs || [];
  const instructions = exercise.content?.instructions || 'Relacione os itens da coluna da esquerda com os da direita.';

  // answers: { [leftIdx]: rightIdx | null }
  const [selectedLeft, setSelectedLeft] = useState(null);

  const shuffledRight = useState(() => shuffle(pairs.map((p, i) => ({ text: p.right, originalIdx: i }))))[0];

  const getMatchedRight = (leftIdx) => {
    const rightIdx = answers[leftIdx];
    return rightIdx != null ? shuffledRight[rightIdx]?.text : null;
  };

  const handleLeftClick = (idx) => {
    if (validation) return;
    setSelectedLeft(selectedLeft === idx ? null : idx);
  };

  const handleRightClick = (rightIdx) => {
    if (validation || selectedLeft === null) return;

    // If this right item was already matched to another left, unlink it
    const newAnswers = { ...answers };
    Object.keys(newAnswers).forEach((k) => {
      if (newAnswers[k] === rightIdx) delete newAnswers[k];
    });
    newAnswers[selectedLeft] = rightIdx;
    setAnswers(newAnswers);
    setSelectedLeft(null);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderLeft: '5px solid #1e88e5', borderRadius: 1, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1565c0' }}>🔗 {instructions}</Typography>
        {!validation && selectedLeft !== null && (
          <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
            ✋ Agora clique no item correspondente da coluna direita...
          </Typography>
        )}
        {!validation && selectedLeft === null && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Clique em um item da esquerda primeiro.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* Left column */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
            Coluna A
          </Typography>
          {pairs.map((pair, leftIdx) => {
            const isSelected = selectedLeft === leftIdx;
            const matchedRightIdx = answers[leftIdx];
            const isMatched = matchedRightIdx != null;
            let borderColor = isSelected ? '#667eea' : isMatched ? '#43a047' : '#e0e0e0';
            let bgcolor = isSelected ? '#eef0ff' : isMatched ? '#f1f8f1' : 'white';

            if (validation) {
              const originalRightIdx = shuffledRight[matchedRightIdx]?.originalIdx;
              const correct = originalRightIdx === leftIdx;
              borderColor = correct ? '#4caf50' : '#f44336';
              bgcolor = correct ? '#f9fff9' : '#fff9f9';
            }

            return (
              <Card
                key={leftIdx}
                onClick={() => handleLeftClick(leftIdx)}
                sx={{
                  p: 2, mb: 1.5,
                  border: `2px solid ${borderColor}`,
                  bgcolor,
                  cursor: validation ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { boxShadow: validation ? undefined : '0 2px 8px rgba(102,126,234,0.2)' },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{pair.left}</Typography>
                {isMatched && !validation && (
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    → {getMatchedRight(leftIdx)}
                  </Typography>
                )}
                {validation && (() => {
                  const originalRightIdx = shuffledRight[matchedRightIdx]?.originalIdx;
                  const correct = originalRightIdx === leftIdx;
                  return (
                    <Typography variant="caption" sx={{ fontWeight: 600, color: correct ? '#2e7d32' : '#c62828', display: 'block' }}>
                      {correct ? `✅ ${pair.right}` : `❌ Correto: ${pair.right}`}
                    </Typography>
                  );
                })()}
              </Card>
            );
          })}
        </Box>

        {/* Right column */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
            Coluna B
          </Typography>
          {shuffledRight.map((item, rightIdx) => {
            const isLinked = Object.values(answers).includes(rightIdx);
            const isActive = selectedLeft !== null && !isLinked;
            let bgcolor = isLinked ? '#f1f8f1' : isActive ? '#fff8e1' : 'white';
            let borderColor = isLinked ? '#43a047' : isActive ? '#ffc107' : '#e0e0e0';

            return (
              <Card
                key={rightIdx}
                onClick={() => handleRightClick(rightIdx)}
                sx={{
                  p: 2, mb: 1.5,
                  border: `2px solid ${borderColor}`,
                  bgcolor,
                  cursor: validation ? 'default' : (isLinked ? 'default' : 'pointer'),
                  transition: 'all 0.2s',
                  opacity: validation ? 1 : (isLinked ? 0.7 : 1),
                  '&:hover': { boxShadow: (validation || isLinked) ? undefined : '0 2px 8px rgba(255,193,7,0.3)' },
                }}
              >
                <Typography variant="body2">{item.text}</Typography>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

// --- Flashcards ---
function FlashcardsRenderer({ exercise, onAllSeen }) {
  const cards = exercise.content?.cards || [];
  const instructions = exercise.content?.instructions || 'Clique no cartão para virar e ver a tradução.';
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(new Set());

  const handleFlip = () => setFlipped(f => !f);

  const handleNext = () => {
    const next = current + 1;
    const newSeen = new Set(seen).add(current);
    setSeen(newSeen);
    if (next < cards.length) {
      setCurrent(next);
      setFlipped(false);
    } else {
      if (onAllSeen) onAllSeen();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setFlipped(false);
    }
  };

  if (cards.length === 0) {
    return <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2 }}><Typography>Nenhum cartão encontrado nesta atividade.</Typography></Box>;
  }

  const card = cards[current];
  const progress = Math.round(((seen.size) / cards.length) * 100);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" sx={{ mb: 2, color: '#666', fontStyle: 'italic' }}>
        {instructions}
      </Typography>

      {/* Progress */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1, height: 6, bgcolor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: '#667eea', transition: 'width 0.4s ease', borderRadius: 3 }} />
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea', minWidth: 50 }}>
          {current + 1}/{cards.length}
        </Typography>
      </Box>

      {/* 3D Flip Card */}
      <Box
        onClick={handleFlip}
        sx={{
          cursor: 'pointer',
          perspective: '1000px',
          height: 220,
          mb: 3,
          '&:hover .flip-inner': { boxShadow: '0 12px 40px rgba(102,126,234,0.25)' },
        }}
      >
        <Box
          className="flip-inner"
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease, box-shadow 0.2s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            borderRadius: 4,
          }}
        >
          {/* Front */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(102,126,234,0.2)',
            p: 3,
          }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>🎴 Frente</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>
              {card.front}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2 }}>Clique para ver</Typography>
          </Box>

          {/* Back */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #43a047 0%, #1de9b6 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(67,160,71,0.2)',
            p: 3,
          }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>✅ Verso</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, textAlign: 'center', lineHeight: 1.2 }}>
              {card.back}
            </Typography>
            {card.example && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1.5, fontStyle: 'italic' }}>
                {card.example}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={handlePrev}
          disabled={current === 0}
          sx={{ borderRadius: 2, px: 3 }}
        >
          ← Anterior
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ borderRadius: 2, px: 3, background: 'linear-gradient(135deg, #667eea, #764ba2)', '&:hover': { background: 'linear-gradient(135deg, #5a6fd6, #6a3d94)' } }}
        >
          {current === cards.length - 1 ? '✅ Concluir' : 'Próximo →'}
        </Button>
      </Box>

      {/* Dot indicators */}
      <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'center', mt: 2 }}>
        {cards.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: i === current ? 20 : 8, height: 8,
              borderRadius: 4,
              bgcolor: i === current ? '#667eea' : seen.has(i) ? '#a5b4fc' : '#e0e0e0',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// ─── Main ExerciseCard ─────────────────────────────────────────────────────────

export default function ExerciseCard({ exercise, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashcardsComplete, setFlashcardsComplete] = useState(false);

  // Detect effective type: 'text' with a prompt field = writing exercise
  const effectiveType = (exercise.type === 'text' && exercise.content?.prompt) ? 'writing'
    : exercise.type === 'text' && exercise.content?.cards ? 'flashcards'
    : exercise.type;

  const canSubmit = () => {
    if (effectiveType === 'writing') {
      const minWords = exercise.content?.minWords || 0;
      return wordCount(answers[0] || '') >= minWords;
    }
    if (effectiveType === 'true-false') {
      const statements = exercise.content?.statements || [];
      return statements.every((_, idx) => answers[idx] !== undefined);
    }
    if (effectiveType === 'sentence-order') {
      const sentences = exercise.content?.sentences || [];
      return sentences.every((_, idx) => (answers[idx]?.selected || []).length > 0);
    }
    if (effectiveType === 'matching') {
      const pairs = exercise.content?.pairs || [];
      return pairs.every((_, idx) => answers[idx] != null);
    }
    if (effectiveType === 'flashcards') {
      return flashcardsComplete;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let score = 0;
      let totalQuestions = 0;
      let results = [];
      let validationData = {};

      // effectiveType is computed at component level above canSubmit
      if (effectiveType === 'flashcards') {
        score = 0;
        totalQuestions = 0;
        validationData = { allCorrect: true, message: 'Flashcards concluídos! Continue praticando.' };

      } else if (effectiveType === 'text') {
        score = 0;
        totalQuestions = 0;
        validationData = { allCorrect: true, message: 'Leitura concluída!' };

      } else if (effectiveType === 'writing') {
        score = 0;
        totalQuestions = 0;
        validationData = { allCorrect: true, message: 'Resposta enviada! O professor irá corrigir.', writingAnswer: answers[0] || '' };

      } else if (effectiveType === 'quiz') {
        const questions = exercise.content?.questions || [];
        totalQuestions = questions.length;
        results = questions.map((q, idx) => {
          const isCorrect = (answers[idx] || '').trim().toLowerCase() === (q.correct || q.a || '').trim().toLowerCase();
          if (isCorrect) score++;
          return { question: q.question || q.q, userAnswer: answers[idx], correctAnswer: q.correct || q.a, isCorrect };
        });
        validationData = { allCorrect: score === totalQuestions, results, score, totalQuestions };

      } else if (effectiveType === 'gap-fill') {
        const formattedAnswers = Object.entries(answers).map(([gapIndex, userAnswer]) => ({
          gapIndex: parseInt(gapIndex),
          userAnswer,
        }));
        const response = await apiClient.post('/exercises/check', {
          exerciseId: exercise.id,
          answers: formattedAnswers,
        });
        validationData = response.data;
        score = response.data.correctCount || 0;
        totalQuestions = exercise.gaps?.length || 0;

      } else if (effectiveType === 'true-false') {
        const statements = exercise.content?.statements || [];
        totalQuestions = statements.length;
        results = statements.map((st, idx) => {
          const isCorrect = answers[idx] === st.correct;
          if (isCorrect) score++;
          return { statement: st.statement, userAnswer: answers[idx], correctAnswer: st.correct, isCorrect };
        });
        validationData = { allCorrect: score === totalQuestions, results, score, totalQuestions };

      } else if (effectiveType === 'sentence-order') {
        const sentences = exercise.content?.sentences || [];
        totalQuestions = sentences.length;
        results = sentences.map((sentence, idx) => {
          const userSentence = (answers[idx]?.selected || []).join(' ');
          const isCorrect = userSentence.trim().toLowerCase() === sentence.correct.trim().toLowerCase();
          if (isCorrect) score++;
          return { sentence: sentence.correct, userAnswer: userSentence, isCorrect };
        });
        validationData = { allCorrect: score === totalQuestions, results, score, totalQuestions };

      } else if (effectiveType === 'matching') {
        const pairs = exercise.content?.pairs || [];
        totalQuestions = pairs.length;
        results = Object.entries(answers).map(([leftIdx]) => ({
          left: pairs[leftIdx]?.left,
          userMatchedRight: answers[leftIdx],
        }));
        validationData = { allCorrect: false, results, score: 0, totalQuestions, matchingRaw: answers };
      }

      setValidation(validationData);

      await apiClient.put('/progress/status', {
        userId: exercise.userId,
        exerciseId: exercise.id,
        status: 'completed',
        score,
        totalQuestions,
        result: { answers, validation: results, type: effectiveType },

      });

      if (onComplete) onComplete();

    } catch (err) {
      console.error('Error submitting exercise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setValidation(null);
  };

  const renderExercise = () => {
    switch (effectiveType) {
      case 'quiz':
        return <QuizRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} />;
      case 'text':
        return <TextRenderer exercise={exercise} />;
      case 'gap-fill':
        return <GapFillRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} />;
      case 'writing':
        return <WritingRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} />;
      case 'true-false':
        return <TrueFalseRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} />;
      case 'sentence-order':
        return <SentenceOrderRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} />;
      case 'matching':
        return <MatchingRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} />;
      case 'flashcards':
        return <FlashcardsRenderer exercise={exercise} onAllSeen={() => setFlashcardsComplete(true)} />;
      default:
        return (
          <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2 }}>
            <Typography color="warning.main">Tipo de atividade não suportado: {exercise.type}</Typography>
          </Box>
        );
    }
  };

  return (
    <Box>
      {renderExercise()}

      {validation ? (
        <Box>
          {effectiveType === 'writing' ? (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                ✅ Resposta enviada! O professor irá analisar seu texto.
              </Typography>
            </Alert>
          ) : (
            <Alert severity={validation.allCorrect ? 'success' : 'warning'} sx={{ mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {validation.score === validation.totalQuestions && validation.totalQuestions > 0
                  ? `🏆 Perfeito! Você acertou tudo! (${validation.score}/${validation.totalQuestions})`
                  : validation.totalQuestions === 0
                  ? '✅ Atividade concluída com sucesso!'
                  : `⚠️ Você acertou ${validation.score} de ${validation.totalQuestions}. Continue praticando!`
                }
              </Typography>
            </Alert>
          )}
          <Button variant="outlined" fullWidth onClick={handleReset} sx={{ borderRadius: 2 }}>
            ↺ Tentar Novamente
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={loading || !canSubmit()}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
        >
          {loading ? 'Enviando...' : effectiveType === 'text' ? '✅ Marcar como Lido' : effectiveType === 'writing' ? '📤 Enviar Texto' : effectiveType === 'flashcards' ? '🎴 Concluir Flashcards' : '📤 Enviar Respostas'}
        </Button>
      )}
    </Box>
  );
}
