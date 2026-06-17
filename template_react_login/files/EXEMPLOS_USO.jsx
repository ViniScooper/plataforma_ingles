// ============================================
// EXEMPLO COMPLETO: App.jsx com Character Creator
// ============================================

import React, { useState, useEffect } from 'react';
import CharacterCreator from './components/CharacterCreator';
import './App.css';

// Exemplo 1: Uso básico
export function AppBasic() {
  return (
    <div className="app">
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exemplo 2: Com roteamento (página dedicada)
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export function AppWithRouting() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/character-creator">Criar Personagem</Link>
        <Link to="/game">Jogo</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/character-creator" element={<CharacterCreator />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return <div><h1>Bem-vindo!</h1></div>;
}

function GamePage() {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    // Carregar personagem salvo
    const saved = localStorage.getItem('playerCharacter');
    if (saved) {
      setCharacter(JSON.parse(saved));
    }
  }, []);

  if (!character) {
    return <div><h1>Você precisa criar um personagem primeiro!</h1></div>;
  }

  return (
    <div className="game-page">
      <h1>Seu Personagem</h1>
      <pre>{JSON.stringify(character, null, 2)}</pre>
    </div>
  );
}

// ============================================

// Exemplo 3: Com Context API (estado global)
import { createContext, useContext } from 'react';

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem('playerCharacter');
    return saved ? JSON.parse(saved) : null;
  });

  const updateCharacter = (newCharacter) => {
    setCharacter(newCharacter);
    localStorage.setItem('playerCharacter', JSON.stringify(newCharacter));
  };

  return (
    <CharacterContext.Provider value={{ character, updateCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter deve ser usado dentro de CharacterProvider');
  }
  return context;
}

// App usando Context
export function AppWithContext() {
  return (
    <CharacterProvider>
      <MainApp />
    </CharacterProvider>
  );
}

function MainApp() {
  const { character } = useCharacter();

  return (
    <div className="app">
      <header>
        {character && <p>Personagem: {character.clothingStyle}</p>}
      </header>
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exemplo 4: Com salvar no servidor
import axios from 'axios';

function CharacterCreatorWithServer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Escutar evento de salvamento
    const handleSave = async (e) => {
      const character = e.detail;
      setLoading(true);
      setError(null);

      try {
        // Enviar para seu API
        const response = await axios.post(
          'https://seu-api.com/api/characters',
          {
            userId: 123, // seu user ID
            character: character,
          }
        );

        console.log('✓ Personagem salvo no servidor:', response.data);
        alert('Personagem salvo com sucesso!');
      } catch (err) {
        setError(err.message);
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar personagem');
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('characterSaved', handleSave);
    return () => window.removeEventListener('characterSaved', handleSave);
  }, []);

  return (
    <div>
      {loading && <p>Salvando...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exemplo 5: Múltiplos personagens
function MultiCharacterGame() {
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(null);

  const handleCharacterSaved = (character) => {
    const id = Date.now();
    const newCharacters = [
      ...characters,
      { id, ...character, createdAt: new Date() },
    ];
    setCharacters(newCharacters);
    setActiveCharacterId(id);
    localStorage.setItem('myCharacters', JSON.stringify(newCharacters));
  };

  useEffect(() => {
    const saved = localStorage.getItem('myCharacters');
    if (saved) {
      const loadedCharacters = JSON.parse(saved);
      setCharacters(loadedCharacters);
      if (loadedCharacters.length > 0) {
        setActiveCharacterId(loadedCharacters[0].id);
      }
    }
  }, []);

  useEffect(() => {
    const handleSave = (e) => {
      handleCharacterSaved(e.detail);
    };

    window.addEventListener('characterSaved', handleSave);
    return () => window.removeEventListener('characterSaved', handleSave);
  }, [characters]);

  return (
    <div className="multi-character-game">
      <div className="character-list">
        <h2>Meus Personagens ({characters.length})</h2>
        {characters.map((char) => (
          <div
            key={char.id}
            className={`character-item ${
              activeCharacterId === char.id ? 'active' : ''
            }`}
            onClick={() => setActiveCharacterId(char.id)}
          >
            <div className="character-preview">
              {/* Renderizar miniatura do personagem */}
              <p>{char.clothingStyle}</p>
              <small>{new Date(char.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="creator-panel">
        <CharacterCreator />
      </div>

      <div className="character-details">
        {activeCharacterId && (
          <>
            <h2>Detalhes do Personagem</h2>
            <pre>
              {JSON.stringify(
                characters.find((c) => c.id === activeCharacterId),
                null,
                2
              )}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================

// Exemplo 6: Com validação e feedback
function CharacterCreatorWithValidation() {
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const handleSave = (e) => {
      const character = e.detail;
      const errors = [];

      // Validar dados
      if (!character.hairstyle) errors.push('Penteado não selecionado');
      if (!character.hairColor) errors.push('Cor do cabelo não selecionada');
      if (!character.eyeColor) errors.push('Cor do olho não selecionada');

      if (errors.length > 0) {
        setValidationErrors(errors);
        alert(`Erros ao validar personagem:\n${errors.join('\n')}`);
      } else {
        setValidationErrors([]);
        console.log('✓ Personagem válido:', character);
      }
    };

    window.addEventListener('characterSaved', handleSave);
    return () => window.removeEventListener('characterSaved', handleSave);
  }, []);

  return (
    <div>
      {validationErrors.length > 0 && (
        <div className="error-box">
          <h3>Erros de Validação:</h3>
          <ul>
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exemplo 7: Com tema escuro/claro
function CharacterCreatorWithTheme() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className={`app-${theme}`}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Alternar Tema
      </button>
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exemplo 8: Componente de seleção rápida
function CharacterQuickSelect() {
  const [selectedPreset, setSelectedPreset] = useState('casual');

  const presets = ['casual', 'pirata', 'ninja', 'mago'];

  return (
    <div className="quick-select">
      <h2>Escolha um Estilo</h2>
      <div className="preset-buttons">
        {presets.map((preset) => (
          <button
            key={preset}
            className={selectedPreset === preset ? 'active' : ''}
            onClick={() => setSelectedPreset(preset)}
          >
            {preset.toUpperCase()}
          </button>
        ))}
      </div>
      <CharacterCreator />
    </div>
  );
}

// ============================================

// Exportar o exemplo mais simples como padrão
export default AppBasic;

// Para usar em um novo projeto:
// 1. Copie CharacterCreator.jsx para src/components/
// 2. Copie CharacterCreator.css para src/components/
// 3. Importe o componente e use qualquer exemplo acima
// 4. npm start
