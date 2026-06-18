import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Button,
  Alert,
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

// --- Quiz (multiple choice cards) ---
function QuizRenderer({ exercise, answers, setAnswers, validation }) {
  return (
    <Box sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}>
      {exercise.content?.text && (
        <Box sx={{
          p: 3,
          backgroundColor: 'rgba(0, 180, 216, 0.05)',
          borderLeft: '4px solid #00b4d8',
          borderRadius: 3.5,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <Typography variant="subtitle2" sx={{ color: '#00b4d8', mb: 1, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
            📖 Reading Context:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#cbd5e1', fontSize: '1.02rem' }}>
            {exercise.content.text}
          </Typography>
        </Box>
      )}
      
      {Array.isArray(exercise.content?.questions) && exercise.content.questions.map((q, idx) => {
        const result = validation?.results?.[idx];
        const studentChoice = answers[idx] || '';
        
        return (
          <Box key={idx} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: '#fff', fontSize: '1.1rem', display: 'flex', gap: 1 }}>
              <span style={{ color: '#00b4d8' }}>{idx + 1}.</span> {q.question || q.q}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Array.isArray(q.options) && q.options.map((opt) => {
                const isSelected = studentChoice === opt;
                const isCorrectOpt = result ? (q.correct === opt || q.a === opt) : false;
                const isStudentIncorrect = result ? (!result.isCorrect && studentChoice === opt) : false;
                
                let borderColor = 'rgba(255, 255, 255, 0.08)';
                let bgcolor = 'rgba(255, 255, 255, 0.02)';
                let glowColor = 'transparent';
                let textColor = '#cbd5e1';
                
                if (isSelected && !validation) {
                  borderColor = '#00b4d8';
                  bgcolor = 'rgba(0, 180, 216, 0.08)';
                  glowColor = 'rgba(0, 180, 216, 0.2)';
                  textColor = '#fff';
                }
                
                if (validation) {
                  const correctVal = q.correct || q.a || '';
                  if (opt === correctVal) {
                    borderColor = '#48c78e';
                    bgcolor = 'rgba(72, 199, 142, 0.12)';
                    glowColor = 'rgba(72, 199, 142, 0.1)';
                    textColor = '#a5d6a7';
                  } else if (isStudentIncorrect) {
                    borderColor = '#ff8fa3';
                    bgcolor = 'rgba(255, 143, 163, 0.12)';
                    textColor = '#ffcbd5';
                  } else {
                    bgcolor = 'rgba(255,255,255,0.01)';
                    textColor = 'rgba(255,255,255,0.25)';
                    borderColor = 'transparent';
                  }
                }
                
                return (
                  <Box
                    key={opt}
                    onClick={() => !validation && setAnswers({ ...answers, [idx]: opt })}
                    sx={{
                      p: 2.2,
                      borderRadius: 3.5,
                      border: `1.5px solid ${borderColor}`,
                      bgcolor: bgcolor,
                      cursor: validation ? 'default' : 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: glowColor !== 'transparent' ? `0 0 15px ${glowColor}` : 'none',
                      '&:hover': {
                        border: validation ? borderColor : '1.5px solid #00b4d8',
                        bgcolor: validation ? bgcolor : 'rgba(0, 180, 216, 0.05)',
                        transform: validation ? 'none' : 'translateX(4px)'
                      }
                    }}
                  >
                    <Typography sx={{ color: textColor, fontWeight: isSelected || isCorrectOpt ? 700 : 500, fontSize: '0.95rem' }}>
                      {opt}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {validation ? (
                        (opt === q.correct || opt === q.a) ? (
                          <span style={{ color: '#48c78e', fontWeight: 900, fontSize: '1.2rem' }}>✓</span>
                        ) : isStudentIncorrect ? (
                          <span style={{ color: '#ff8fa3', fontWeight: 900, fontSize: '1.2rem' }}>✗</span>
                        ) : null
                      ) : (
                        <Box sx={{
                          width: 20, height: 20,
                          borderRadius: '50%',
                          border: isSelected ? '6px solid #00b4d8' : '2px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.2s ease',
                          bgcolor: 'transparent'
                        }} />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// --- Text (reading) ---
function TextRenderer({ exercise }) {
  return (
    <Box sx={{ p: 4, backgroundColor: 'rgba(0, 180, 216, 0.04)', borderLeft: '4px solid #00b4d8', borderRadius: 4, mb: 3, animation: 'fadeIn 0.3s ease' }}>
      <Typography variant="subtitle2" sx={{ color: '#00b4d8', mb: 2, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        📖 Reading Passage:
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, color: '#f1f5f9', fontSize: '1.08rem' }}>
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
        elements.push(
          <Typography key={`text-${gapIndex}`} component="span" sx={{ color: '#f1f5f9', fontSize: '1.1rem', lineHeight: '2.5', fontWeight: 500 }}>
            {text.substring(currentPos, i)}
          </Typography>
        );
      }
      const activeGapIndex = gapIndex;
      elements.push(
        <FormControl key={`gap-${gapIndex}`} sx={{ minWidth: 140, mx: 1, my: 0.5 }} size="small">
          <Select 
            value={answers[activeGapIndex] || ''} 
            onChange={(e) => setAnswers({ ...answers, [activeGapIndex]: e.target.value })}
            displayEmpty
            sx={{
              color: '#00b4d8',
              fontWeight: 800,
              fontSize: '0.95rem',
              bgcolor: 'rgba(0, 180, 216, 0.06)',
              borderRadius: 3,
              height: 38,
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 180, 216, 0.25)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00b4d8' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00b4d8' },
              '.MuiSvgIcon-root': { color: '#00b4d8' }
            }}
          >
            <MenuItem value="" disabled>
              <em style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'normal' }}>Selecione...</em>
            </MenuItem>
            {exercise.gaps?.[gapIndex]?.options.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontWeight: 600 }}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
      currentPos = i + 3;
      gapIndex++;
      i += 2;
    }
  }
  if (currentPos < text.length) {
    elements.push(
      <Typography key="text-end" component="span" sx={{ color: '#f1f5f9', fontSize: '1.1rem', lineHeight: '2.5', fontWeight: 500 }}>
        {text.substring(currentPos)}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, mb: 3, animation: 'fadeIn 0.3s ease' }}>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 2 }}>
        ✏️ Complete as lacunas com as palavras correspondentes:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5, py: 1 }}>
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
  const isTargetReached = wc >= minWords;
  const progressVal = minWords > 0 ? Math.min(Math.round((wc / minWords) * 100), 100) : 100;

  return (
    <Box sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}>
      <Box sx={{ p: 3, backgroundColor: 'rgba(179, 136, 255, 0.05)', borderLeft: '4px solid #b388ff', borderRadius: 3.5, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#b388ff', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          ✍️ Writing Instructions:
        </Typography>
        <Typography variant="body1" sx={{ color: '#f1f5f9', fontSize: '1.02rem', lineHeight: 1.7 }}>{prompt}</Typography>
      </Box>

      {tips.length > 0 && (
        <Box sx={{ mb: 3.5, p: 2.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1.5 }}>
            💡 Suggested Vocabulary & Tips:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tips.map((tip, i) => (
              <Chip key={i} label={tip} size="small" variant="outlined" sx={{ color: '#b388ff', borderColor: 'rgba(179, 136, 255, 0.3)', fontWeight: 600, fontSize: '0.78rem' }} />
            ))}
          </Box>
        </Box>
      )}

      <TextField
        multiline
        rows={8}
        fullWidth
        placeholder="Type your response in English here..."
        value={currentText}
        onChange={(e) => setAnswers({ 0: e.target.value })}
        disabled={!!validation}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: '"Inter", sans-serif',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: '#fff',
            bgcolor: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'transparent' },
            borderBottom: isTargetReached ? '3px solid #48c78e' : '3px solid rgba(179, 136, 255, 0.4)'
          }
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 100, height: 6, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ width: `${progressVal}%`, height: '100%', bgcolor: isTargetReached ? '#48c78e' : '#b388ff', transition: 'width 0.3s ease' }} />
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: isTargetReached ? '#48c78e' : '#ffb74d' }}>
            {wc} palavra{wc !== 1 ? 's' : ''} {minWords > 0 ? `(mínimo: ${minWords})` : ''}
          </Typography>
        </Box>
        
        {minWords > 0 && isTargetReached && (
          <Chip
            label="✓ Mínimo atingido"
            size="small"
            sx={{ bgcolor: 'rgba(72, 199, 142, 0.12)', color: '#48c78e', border: '1px solid rgba(72, 199, 142, 0.2)', fontWeight: 800 }}
          />
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
    <Box sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}>
      {text && (
        <Box sx={{ p: 3, backgroundColor: 'rgba(72, 199, 142, 0.04)', borderLeft: '4px solid #48c78e', borderRadius: 3.5, mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#48c78e', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>📖 Context:</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#f1f5f9', fontSize: '1.02rem' }}>{text}</Typography>
        </Box>
      )}

      <Typography variant="caption" sx={{ fontWeight: 800, mb: 2.5, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block' }}>
        Mark each statement as True or False:
      </Typography>

      {statements.map((st, idx) => {
        const selected = answers[idx];
        const isCorrect = validation ? (selected === st.correct) : null;

        return (
          <Card key={idx} sx={{
            p: 3, mb: 3,
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: validation ? `5px solid ${isCorrect ? '#48c78e' : '#ff5a79'}` : '1.5px solid rgba(255,255,255,0.06)',
            borderRadius: 4,
            transition: 'all 0.3s ease',
          }}>
            <Typography variant="body1" sx={{ fontWeight: 800, mb: 2, color: '#fff', fontSize: '1.02rem' }}>
              {idx + 1}. {st.statement}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[true, false].map((val) => {
                const label = val ? 'True (Verdadeiro)' : 'False (Falso)';
                const isSelected = selected === val;
                const isThisCorrect = validation && st.correct === val;
                
                let borderColor = 'rgba(255, 255, 255, 0.08)';
                let bgcolor = 'rgba(255, 255, 255, 0.02)';
                let color = '#cbd5e1';
                let shadow = 'none';

                if (isSelected && !validation) {
                  borderColor = val ? '#48c78e' : '#ff8fa3';
                  bgcolor = val ? 'rgba(72, 199, 142, 0.08)' : 'rgba(255, 143, 163, 0.08)';
                  color = '#fff';
                  shadow = val ? '0 0 12px rgba(72, 199, 142, 0.2)' : '0 0 12px rgba(255, 143, 163, 0.2)';
                }

                if (validation) {
                  if (isThisCorrect) {
                    borderColor = '#48c78e';
                    bgcolor = 'rgba(72, 199, 142, 0.12)';
                    color = '#a5d6a7';
                  } else if (isSelected && !isCorrect) {
                    borderColor = '#ff8fa3';
                    bgcolor = 'rgba(255, 143, 163, 0.12)';
                    color = '#ffcbd5';
                  } else {
                    bgcolor = 'rgba(255,255,255,0.01)';
                    color = 'rgba(255,255,255,0.2)';
                    borderColor = 'transparent';
                  }
                }

                return (
                  <Button
                    key={String(val)}
                    variant="contained"
                    size="medium"
                    disabled={!!validation}
                    onClick={() => setAnswers({ ...answers, [idx]: val })}
                    sx={{
                      flex: 1,
                      bgcolor,
                      color,
                      fontWeight: 800,
                      py: 1.2,
                      borderRadius: 3,
                      textTransform: 'none',
                      border: `1.5px solid ${borderColor}`,
                      boxShadow: shadow,
                      '&:hover': {
                        bgcolor: validation ? bgcolor : (val ? 'rgba(72, 199, 142, 0.12)' : 'rgba(255, 143, 163, 0.12)'),
                        border: validation ? borderColor : `1.5px solid ${val ? '#48c78e' : '#ff8fa3'}`
                      },
                      '&.Mui-disabled': { bgcolor, color, opacity: 1 },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
            
            {validation && (
              <Typography variant="caption" sx={{ mt: 2, display: 'block', fontWeight: 800, color: isCorrect ? '#48c78e' : '#ff5a79', fontSize: '0.8rem' }}>
                {isCorrect ? '✅ Correto!' : `❌ Incorreto! Resposta correta: ${st.correct ? 'True' : 'False'}`}
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
  const instructions = exercise.content?.instructions || 'Reorder the words to build correct sentences.';

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
    <Box sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}>
      <Box sx={{ p: 2.5, backgroundColor: 'rgba(255, 183, 77, 0.05)', borderLeft: '4px solid #ffb74d', borderRadius: 3, mb: 3.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffb74d', textTransform: 'uppercase', letterSpacing: 0.5 }}>🧩 Instructions:</Typography>
        <Typography variant="body2" sx={{ color: '#f1f5f9', mt: 0.5 }}>{instructions}</Typography>
      </Box>

      {sentences.map((sentence, sIdx) => {
        const st = getState(sIdx);
        const userSentence = st.selected.join(' ');
        let resultColor = '#ffb74d';
        let isCorrect = false;
        
        if (validation) {
          isCorrect = userSentence.trim().toLowerCase() === sentence.correct.trim().toLowerCase();
          resultColor = isCorrect ? '#48c78e' : '#ff5a79';
        }

        return (
          <Card key={sIdx} sx={{
            p: 3, mb: 3.5,
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderLeft: `4px solid ${resultColor}`,
            borderRadius: 4,
            transition: 'border-color 0.3s',
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Sentence {sIdx + 1}:
            </Typography>

            {/* Answer area */}
            <Box sx={{
              minHeight: 58, p: 2, mb: 2.5,
              border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 3,
              display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.2)',
            }}>
              {st.selected.length === 0 && (
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                  Click on the words below to build the sentence...
                </Typography>
              )}
              {st.selected.map((word, wIdx) => (
                <Chip
                  key={wIdx}
                  label={word}
                  onClick={() => !validation && removeWord(sIdx, wIdx)}
                  sx={{
                    bgcolor: validation ? (isCorrect ? 'rgba(72, 199, 142, 0.15)' : 'rgba(255, 90, 121, 0.15)') : '#00b4d8',
                    color: validation ? (isCorrect ? '#48c78e' : '#ffcbd5') : '#fff',
                    border: `1px solid ${validation ? (isCorrect ? '#48c78e' : '#ff5a79') : 'transparent'}`,
                    fontWeight: 800,
                    borderRadius: 2.5,
                    cursor: validation ? 'default' : 'pointer',
                    boxShadow: !validation ? '0 2px 8px rgba(0, 180, 216, 0.25)' : 'none',
                    '&:hover': { bgcolor: validation ? undefined : '#0077b6' },
                  }}
                />
              ))}
            </Box>

            {/* Word bank */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {st.remaining.map((word, wIdx) => (
                <Chip
                  key={wIdx}
                  label={word}
                  onClick={() => !validation && addWord(sIdx, word)}
                  variant="outlined"
                  sx={{
                    cursor: validation ? 'default' : 'pointer',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    color: '#eee',
                    borderColor: 'rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.02)',
                    '&:hover': { bgcolor: validation ? undefined : 'rgba(255,255,255,0.06)' },
                    opacity: validation ? 0.35 : 1,
                  }}
                />
              ))}
            </Box>

            {!validation && (
              <Button size="small" onClick={() => resetSentence(sIdx)} sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontWeight: 800, '&:hover': { color: '#00b4d8' } }}>
                ↺ Reset sentence
              </Button>
            )}

            {validation && (
              <Box sx={{ mt: 1.5 }}>
                {isCorrect ? (
                  <Typography variant="caption" sx={{ color: '#48c78e', fontWeight: 800, fontSize: '0.82rem' }}>✅ Perfect!</Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#ff5a79', fontWeight: 600 }}>
                    ❌ Correct: <strong style={{ color: '#48c78e' }}>{sentence.correct}</strong>
                  </Typography>
                )}
              </Box>
            )}
          </Card>
        );
      })}
    </Box>
  );
}

// --- Matching ---
function MatchingRenderer({ exercise, answers, setAnswers, validation, shuffledRight }) {
  const pairs = exercise.content?.pairs || [];
  const instructions = exercise.content?.instructions || 'Match the Column A items with the Column B items.';

  const [selectedLeft, setSelectedLeft] = useState(null);

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

    const newAnswers = { ...answers };
    Object.keys(newAnswers).forEach((k) => {
      if (newAnswers[k] === rightIdx) delete newAnswers[k];
    });
    newAnswers[selectedLeft] = rightIdx;
    setAnswers(newAnswers);
    setSelectedLeft(null);
  };

  return (
    <Box sx={{ mb: 3, animation: 'fadeIn 0.3s ease' }}>
      <Box sx={{ p: 2.5, backgroundColor: 'rgba(0, 180, 216, 0.05)', borderLeft: '4px solid #00b4d8', borderRadius: 3.5, mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: 0.5 }}>🔗 Instructions:</Typography>
        <Typography variant="body2" sx={{ color: '#eee', mt: 0.5 }}>{instructions}</Typography>
        {!validation && selectedLeft !== null && (
          <Typography variant="caption" sx={{ color: '#00b4d8', mt: 1, display: 'block', fontWeight: 800, animation: 'fadeIn 0.3s ease' }}>
            👉 Now click on the matching item in Column B...
          </Typography>
        )}
        {!validation && selectedLeft === null && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1, display: 'block', fontWeight: 700 }}>
            Click on a card in Column A first.
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3.5 }}>
        {/* Left column */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>
            Column A
          </Typography>
          {pairs.map((pair, leftIdx) => {
            const isSelected = selectedLeft === leftIdx;
            const matchedRightIdx = answers[leftIdx];
            const isMatched = matchedRightIdx != null;
            
            let borderColor = 'rgba(255,255,255,0.06)';
            let bgcolor = 'rgba(255,255,255,0.02)';
            let textColor = '#fff';
            let shadow = 'none';

            if (isSelected) {
              borderColor = '#00b4d8';
              bgcolor = 'rgba(0, 180, 216, 0.08)';
              shadow = '0 0 12px rgba(0, 180, 216, 0.15)';
            } else if (isMatched) {
              borderColor = 'rgba(179, 136, 255, 0.3)';
              bgcolor = 'rgba(179, 136, 255, 0.04)';
            }

            if (validation) {
              const originalRightIdx = shuffledRight[matchedRightIdx]?.originalIdx;
              const correct = originalRightIdx === leftIdx;
              borderColor = correct ? '#48c78e' : '#ff5a79';
              bgcolor = correct ? 'rgba(72, 199, 142, 0.08)' : 'rgba(255, 90, 121, 0.08)';
            }

            return (
              <Card
                key={leftIdx}
                onClick={() => handleLeftClick(leftIdx)}
                sx={{
                  p: 2.2, mb: 1.8,
                  border: `1.5px solid ${borderColor}`,
                  background: bgcolor,
                  borderRadius: 3.5,
                  cursor: validation ? 'default' : 'pointer',
                  boxShadow: shadow,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  '&:hover': { 
                    border: validation ? borderColor : '1.5px solid #00b4d8',
                    boxShadow: validation ? undefined : '0 4px 15px rgba(0,180,216,0.15)',
                    transform: validation ? undefined : 'translateY(-2px)'
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800, color: textColor }}>{pair.left}</Typography>
                
                {isMatched && !validation && (
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#b388ff', mt: 0.6, display: 'block', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    🔗 Linked: {getMatchedRight(leftIdx)}
                  </Typography>
                )}
                
                {validation && (() => {
                  const originalRightIdx = shuffledRight[matchedRightIdx]?.originalIdx;
                  const correct = originalRightIdx === leftIdx;
                  return (
                    <Typography variant="caption" sx={{ fontWeight: 800, color: correct ? '#48c78e' : '#ff5a79', display: 'block', mt: 0.8 }}>
                      {correct ? `✅ ${pair.right}` : `❌ Correct: ${pair.right}`}
                    </Typography>
                  );
                })()}
              </Card>
            );
          })}
        </Box>

        {/* Right column */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 2 }}>
            Column B
          </Typography>
          {shuffledRight.map((item, rightIdx) => {
            const isLinked = Object.values(answers).includes(rightIdx);
            const isActive = selectedLeft !== null && !isLinked;
            
            let bgcolor = 'rgba(255,255,255,0.02)';
            let borderColor = 'rgba(255,255,255,0.06)';
            let shadow = 'none';

            if (isLinked) {
              bgcolor = 'rgba(179, 136, 255, 0.05)';
              borderColor = 'rgba(179, 136, 255, 0.3)';
            } else if (isActive) {
              bgcolor = 'rgba(0, 180, 216, 0.03)';
              borderColor = 'rgba(0, 180, 216, 0.2)';
              shadow = '0 0 8px rgba(0, 180, 216, 0.05)';
            }

            return (
              <Card
                key={rightIdx}
                onClick={() => handleRightClick(rightIdx)}
                sx={{
                  p: 2.2, mb: 1.8,
                  border: `1.5px solid ${borderColor}`,
                  background: bgcolor,
                  borderRadius: 3.5,
                  boxShadow: shadow,
                  cursor: validation ? 'default' : (isLinked ? 'default' : 'pointer'),
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: validation ? 0.6 : (isLinked ? 0.5 : 1),
                  '&:hover': { 
                    border: (validation || isLinked) ? undefined : '1.5px solid #00b4d8',
                    boxShadow: (validation || isLinked) ? undefined : '0 4px 15px rgba(0,180,216,0.15)',
                    transform: (validation || isLinked) ? undefined : 'translateY(-2px)'
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: '#eee', fontWeight: 500 }}>{item.text}</Typography>
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
  const instructions = exercise.content?.instructions || 'Click on the card to flip and reveal translation.';
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
    return <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}><Typography sx={{ color: '#bbb' }}>No cards found in this activity.</Typography></Box>;
  }

  const card = cards[current];
  const progress = Math.round(((seen.size) / cards.length) * 100);

  return (
    <Box sx={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
      <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
        {instructions}
      </Typography>

      {/* Progress bar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, height: 6, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ width: `${progress}%`, height: '100%', bgcolor: '#00b4d8', transition: 'width 0.4s ease', borderRadius: 3 }} />
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#00b4d8', minWidth: 50 }}>
          {current + 1} / {cards.length}
        </Typography>
      </Box>

      {/* 3D Flip Card */}
      <Box
        onClick={handleFlip}
        sx={{
          cursor: 'pointer',
          perspective: '1000px',
          height: 250,
          mb: 4,
          position: 'relative',
          '&:hover .flip-inner': { boxShadow: '0 15px 40px rgba(0, 180, 216, 0.25)' },
        }}
      >
        <Box
          className="flip-inner"
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            borderRadius: 5,
          }}
        >
          {/* Front */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 5,
            background: 'linear-gradient(135deg, #0f2342 0%, #15325c 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            p: 3,
          }}>
            <Typography variant="caption" sx={{ color: '#00b4d8', mb: 1.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>🎴 ENGLISH</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 }}>
              {card.front}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', mt: 3, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tap to flip</Typography>
          </Box>

          {/* Back */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 5,
            background: 'linear-gradient(135deg, #093721 0%, #0d4b2e 100%)',
            border: '1px solid rgba(72, 199, 142, 0.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            p: 3,
          }}>
            <Typography variant="caption" sx={{ color: '#48c78e', mb: 1.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>✅ PORTUGUÊS</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, textAlign: 'center', lineHeight: 1.2 }}>
              {card.back}
            </Typography>
            {card.example && (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mt: 2.2, fontStyle: 'italic', fontWeight: 500 }}>
                "{card.example}"
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
          sx={{ 
            borderRadius: 3.5, 
            px: 4.5, 
            py: 1.2,
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.15)',
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0,180,216,0.06)' },
            '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.05)' }
          }}
        >
          ← Anterior
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ 
            borderRadius: 3.5, 
            px: 4.5, 
            py: 1.2,
            fontWeight: 800,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)', 
            color: '#fff',
            '&:hover': { background: 'linear-gradient(135deg, #00c0f0, #0096c7)' } 
          }}
        >
          {current === cards.length - 1 ? 'Concluir ✅' : 'Próximo →'}
        </Button>
      </Box>

      {/* Dot indicators */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
        {cards.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: 4,
              bgcolor: i === current ? '#00b4d8' : seen.has(i) ? 'rgba(0, 180, 216, 0.4)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
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
  const [shuffledRight, setShuffledRight] = useState([]);

  useEffect(() => {
    setAnswers({});
    setValidation(null);
    setFlashcardsComplete(false);
    if (exercise.type === 'matching' && exercise.content?.pairs) {
      setShuffledRight(shuffle(exercise.content.pairs.map((p, i) => ({ text: p.right, originalIdx: i }))));
    } else {
      setShuffledRight([]);
    }
  }, [exercise.id]);

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
          const correctVal = q.correct || q.a || '';
          const isCorrect = (answers[idx] || '').trim().toLowerCase() === correctVal.trim().toLowerCase();
          if (isCorrect) score++;
          return { question: q.question || q.q, userAnswer: answers[idx], correctAnswer: correctVal, isCorrect };
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
        score = 0;
        results = pairs.map((pair, leftIdx) => {
          const matchedRightIdx = answers[leftIdx];
          const originalRightIdx = shuffledRight[matchedRightIdx]?.originalIdx;
          const isCorrect = originalRightIdx === leftIdx;
          if (isCorrect) score++;
          return {
            left: pair.left,
            userMatchedRight: shuffledRight[matchedRightIdx]?.text,
            correctAnswer: pair.right,
            isCorrect
          };
        });
        validationData = { allCorrect: score === totalQuestions, results, score, totalQuestions };
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

      if (onComplete) onComplete(validationData);

    } catch (err) {
      console.error('Error submitting exercise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setValidation(null);
    setFlashcardsComplete(false);
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
        return <MatchingRenderer exercise={exercise} answers={answers} setAnswers={setAnswers} validation={validation} shuffledRight={shuffledRight} />;
      case 'flashcards':
        return <FlashcardsRenderer exercise={exercise} onAllSeen={() => setFlashcardsComplete(true)} />;
      default:
        return (
          <Box sx={{ p: 3, bgcolor: 'rgba(239, 108, 0, 0.08)', borderRadius: 2 }}>
            <Typography color="warning.main">Tipo de atividade não suportado: {exercise.type}</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {renderExercise()}

      {validation ? (
        <Box sx={{ mt: 3 }}>
          {effectiveType === 'writing' ? (
            <Alert severity="success" sx={{ mb: 2.5, borderRadius: 3, bgcolor: 'rgba(72, 199, 142, 0.12)', border: '1px solid rgba(72, 199, 142, 0.25)', color: '#a5d6a7' }}>
              <Typography variant="subtitle2" fontWeight={800}>
                ✅ Resposta enviada! O professor irá analisar seu texto.
              </Typography>
            </Alert>
          ) : (
            <Alert 
              severity={validation.allCorrect ? 'success' : 'warning'} 
              sx={{ 
                mb: 2.5, 
                borderRadius: 3, 
                bgcolor: validation.allCorrect ? 'rgba(72, 199, 142, 0.12)' : 'rgba(239, 108, 0, 0.12)',
                border: `1px solid ${validation.allCorrect ? 'rgba(72, 199, 142, 0.25)' : 'rgba(239, 108, 0, 0.25)'}`,
                color: validation.allCorrect ? '#a5d6a7' : '#ffb74d'
              }}
            >
              <Typography variant="subtitle2" fontWeight={800}>
                {validation.score === validation.totalQuestions && validation.totalQuestions > 0
                  ? `🏆 Perfeito! Você acertou tudo! (${validation.score}/${validation.totalQuestions})`
                  : validation.totalQuestions === 0
                  ? '✅ Atividade concluída com sucesso!'
                  : `⚠️ Você acertou ${validation.score} de ${validation.totalQuestions}. Continue praticando!`
                }
              </Typography>
            </Alert>
          )}
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleReset} 
            sx={{ 
              borderRadius: 3.5, 
              py: 1.2, 
              fontWeight: 800,
              color: '#00b4d8',
              borderColor: 'rgba(0, 180, 216, 0.3)',
              '&:hover': { borderColor: '#00b4d8', bgcolor: 'rgba(0,180,216,0.06)' }
            }}
          >
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
          sx={{ 
            mt: 3,
            borderRadius: 3.5, 
            py: 1.5, 
            fontWeight: 800,
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #00b4d8, #48c78e)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(0, 180, 216, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00c0f0, #5ae0a2)',
              boxShadow: '0 6px 20px rgba(0, 180, 216, 0.35)'
            },
            '&.Mui-disabled': {
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.2)',
              boxShadow: 'none',
              border: '1px solid rgba(255,255,255,0.05)'
            }
          }}
        >
          {loading 
            ? 'Enviando...' 
            : effectiveType === 'text' 
            ? 'Entregar Atividade (Leitura Concluída) ✅' 
            : effectiveType === 'writing' 
            ? 'Entregar Atividade (Enviar Texto) 📤' 
            : effectiveType === 'flashcards' 
            ? 'Entregar Atividade (Concluir Flashcards) 🎴' 
            : 'Entregar Atividade (Enviar Respostas) 📤'}
        </Button>
      )}
    </Box>
  );
}
