import React, { useState } from 'react';
import './CharacterCreator.css';

const PRESETS = {
  pirata: {
    hairstyle: 'comprido',
    hairColor: '#2C1810',
    skinTone: '#D4A574',
    eyeColor: '#000000',
    clothingStyle: 'pirata',
    clothingColor: '#8B4513',
    pantsColor: '#1A1A1A',
  },
  ninja: {
    hairstyle: 'espetado',
    hairColor: '#000000',
    skinTone: '#C4B8A0',
    eyeColor: '#2C1810',
    clothingStyle: 'ninja',
    clothingColor: '#1A1A1A',
    pantsColor: '#2C3335',
  },
  mago: {
    hairstyle: 'cacheado',
    hairColor: '#86C06E',
    skinTone: '#E6B89A',
    eyeColor: '#FFD700',
    clothingStyle: 'elegante',
    clothingColor: '#4A3F8C',
    pantsColor: '#34495E',
  },
  casual: {
    hairstyle: 'liso',
    hairColor: '#6B4423',
    skinTone: '#E6B89A',
    eyeColor: '#000000',
    clothingStyle: 'casual',
    clothingColor: '#E74C3C',
    pantsColor: '#3E4A4E',
  },
};

const HAIRSTYLES = ['liso', 'comprido', 'espetado', 'cacheado'];
const CLOTHING_STYLES = ['casual', 'esportivo', 'elegante', 'aventura', 'pirata', 'ninja'];

const SKIN_TONES = [
  { name: 'Muito Clara', color: '#F5DEB3' },
  { name: 'Clara', color: '#E6B89A' },
  { name: 'Média Clara', color: '#F4C4A0' },
  { name: 'Morena', color: '#D9A584' },
  { name: 'Morena Escura', color: '#A0826D' },
  { name: 'Escura', color: '#8B6D5C' },
  { name: 'Muito Escura', color: '#6B5D52' },
];

const HAIR_COLORS = [
  '#2C1810', '#6B4423', '#8B6F47', '#D4A574', '#FFD700',
  '#C0504D', '#000000', '#D9A4DC', '#5C8A9F', '#86C06E',
];

const EYE_COLORS = [
  '#000000', '#4A2C15', '#6B5D52', '#3E6A8C', '#2D5A3D',
  '#6C3A7C', '#8B4513', '#1A1A1A', '#4A4A4A', '#2C3335',
];

const CLOTHING_COLORS = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  '#1ABC9C', '#34495E', '#ECF0F1', '#C0504D', '#8B4513',
];

const PANTS_COLORS = [
  '#3E4A4E', '#1A1A1A', '#5C6F7E', '#6B4423', '#34495E',
  '#8B6F47', '#4A3F35', '#7F8C8D', '#2C3335', '#5C4D38',
];

export default function CharacterCreator() {
  const [character, setCharacter] = useState({
    hairstyle: 'liso',
    hairColor: '#6B4423',
    skinTone: '#E6B89A',
    eyeColor: '#000000',
    clothingStyle: 'casual',
    clothingColor: '#E74C3C',
    pantsColor: '#3E4A4E',
  });

  const handlePreset = (presetName) => {
    setCharacter(PRESETS[presetName]);
  };

  const handleChange = (key, value) => {
    setCharacter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('playerCharacter', JSON.stringify(character));
    alert('✓ Personagem salvo com sucesso!');
    // Também dispara um evento customizado para o game usar
    window.dispatchEvent(
      new CustomEvent('characterSaved', { detail: character })
    );
  };

  return (
    <div className="character-creator">
      <h1>Criador de Personagem</h1>

      {/* Preview */}
      <div className="preview-container">
        <div className="character-preview">
          <CharacterPixelArt character={character} />
        </div>
      </div>

      {/* Presets */}
      <div className="presets">
        {Object.keys(PRESETS).map((preset) => (
          <button
            key={preset}
            className="preset-btn"
            onClick={() => handlePreset(preset)}
          >
            {preset.charAt(0).toUpperCase() + preset.slice(1)}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="controls-container">
        {/* Penteado */}
        <div className="control-group">
          <label>PENTEADO</label>
          <select
            value={character.hairstyle}
            onChange={(e) => handleChange('hairstyle', e.target.value)}
          >
            {HAIRSTYLES.map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Estilo de roupa */}
        <div className="control-group">
          <label>ESTILO ROUPA</label>
          <select
            value={character.clothingStyle}
            onChange={(e) => handleChange('clothingStyle', e.target.value)}
          >
            {CLOTHING_STYLES.map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="swatches-container">
        {/* Tom de Pele */}
        <div className="swatch-group">
          <label>COR DA PELE</label>
          <div className="swatch-grid">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone.color}
                className={`swatch ${character.skinTone === tone.color ? 'active' : ''}`}
                style={{ backgroundColor: tone.color }}
                onClick={() => handleChange('skinTone', tone.color)}
                title={tone.name}
              />
            ))}
          </div>
        </div>

        {/* Cor dos Olhos */}
        <div className="swatch-group">
          <label>COR DOS OLHOS</label>
          <div className="swatch-grid">
            {EYE_COLORS.map((color) => (
              <button
                key={color}
                className={`swatch ${character.eyeColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('eyeColor', color)}
              />
            ))}
          </div>
        </div>

        {/* Cor do Cabelo */}
        <div className="swatch-group">
          <label>COR DO CABELO</label>
          <div className="swatch-grid">
            {HAIR_COLORS.map((color) => (
              <button
                key={color}
                className={`swatch ${character.hairColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('hairColor', color)}
              />
            ))}
          </div>
        </div>

        {/* Cor da Roupa */}
        <div className="swatch-group">
          <label>COR DA ROUPA</label>
          <div className="swatch-grid">
            {CLOTHING_COLORS.map((color) => (
              <button
                key={color}
                className={`swatch ${character.clothingColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('clothingColor', color)}
              />
            ))}
          </div>
        </div>

        {/* Cor das Calças */}
        <div className="swatch-group">
          <label>COR DAS CALÇAS</label>
          <div className="swatch-grid">
            {PANTS_COLORS.map((color) => (
              <button
                key={color}
                className={`swatch ${character.pantsColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange('pantsColor', color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="button-group">
        <button className="btn-cancel">Cancelar</button>
        <button className="btn-save" onClick={handleSave}>
          Salvar Avatar
        </button>
      </div>
    </div>
  );
}

// Componente que renderiza o pixel art detalhado
function CharacterPixelArt({ character }) {
  const renderHair = () => {
    const { hairstyle, hairColor } = character;

    // Usa CSS classes para renderizar diferentes penteados
    // Cada penteado é uma combinação de divs coloridas
    
    switch (hairstyle) {
      case 'liso':
        return (
          <>
            <div className="hair-block" style={{ backgroundColor: hairColor }}>
              {/* Topo */}
            </div>
            <div className="hair-side-left" style={{ backgroundColor: hairColor }} />
            <div className="hair-side-right" style={{ backgroundColor: hairColor }} />
          </>
        );
      case 'comprido':
        return (
          <>
            <div className="hair-block" style={{ backgroundColor: hairColor }}>
              {/* Topo */}
            </div>
            <div className="hair-side-left hair-long" style={{ backgroundColor: hairColor }} />
            <div className="hair-side-right hair-long" style={{ backgroundColor: hairColor }} />
            <div className="hair-back-left" style={{ backgroundColor: hairColor }} />
            <div className="hair-back-right" style={{ backgroundColor: hairColor }} />
          </>
        );
      case 'espetado':
        return (
          <>
            <div className="hair-spike hair-spike-1" style={{ backgroundColor: hairColor }} />
            <div className="hair-spike hair-spike-2" style={{ backgroundColor: hairColor }} />
            <div className="hair-spike hair-spike-3" style={{ backgroundColor: hairColor }} />
            <div className="hair-side-left hair-short" style={{ backgroundColor: hairColor }} />
            <div className="hair-side-right hair-short" style={{ backgroundColor: hairColor }} />
          </>
        );
      case 'cacheado':
        return (
          <>
            <div className="hair-block hair-curly" style={{ backgroundColor: hairColor }}>
              {/* Topo cacheado */}
            </div>
            <div className="hair-side-left hair-curly" style={{ backgroundColor: hairColor }} />
            <div className="hair-side-right hair-curly" style={{ backgroundColor: hairColor }} />
            <div className="hair-curl hair-curl-1" style={{ backgroundColor: hairColor }} />
            <div className="hair-curl hair-curl-2" style={{ backgroundColor: hairColor }} />
          </>
        );
      default:
        return null;
    }
  };

  const renderClothing = () => {
    const { clothingStyle, clothingColor, pantsColor } = character;

    switch (clothingStyle) {
      case 'casual':
        return (
          <>
            <div className="clothing-body" style={{ backgroundColor: clothingColor }} />
            <div className="clothing-detail-1" style={{ backgroundColor: clothingColor }} />
            <div className="pants" style={{ backgroundColor: pantsColor }} />
            <div className="shoes" style={{ backgroundColor: '#3E2723' }} />
          </>
        );
      case 'esportivo':
        return (
          <>
            <div className="clothing-body" style={{ backgroundColor: clothingColor }} />
            <div className="stripe-left" style={{ backgroundColor: pantsColor }} />
            <div className="stripe-right" style={{ backgroundColor: pantsColor }} />
            <div className="pants" style={{ backgroundColor: pantsColor }} />
            <div className="shoes" style={{ backgroundColor: clothingColor }} />
          </>
        );
      case 'elegante':
        return (
          <>
            <div className="clothing-formal" style={{ backgroundColor: clothingColor }} />
            <div className="formal-detail" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="pants formal-pants" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="shoes" style={{ backgroundColor: '#1A1A1A' }} />
          </>
        );
      case 'aventura':
        return (
          <>
            <div className="clothing-adventure" style={{ backgroundColor: clothingColor }} />
            <div className="adventure-belt-1" style={{ backgroundColor: '#4A3F35' }} />
            <div className="adventure-belt-2" style={{ backgroundColor: '#4A3F35' }} />
            <div className="pants" style={{ backgroundColor: pantsColor }} />
            <div className="shoes" style={{ backgroundColor: '#6B4423' }} />
          </>
        );
      case 'pirata':
        return (
          <>
            <div className="clothing-pirate" style={{ backgroundColor: clothingColor }} />
            <div className="pirate-stripe" style={{ backgroundColor: '#FFD700' }} />
            <div className="pants" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="shoes" style={{ backgroundColor: clothingColor }} />
          </>
        );
      case 'ninja':
        return (
          <>
            <div className="clothing-ninja" style={{ backgroundColor: clothingColor }} />
            <div className="ninja-detail-1" style={{ backgroundColor: '#8B4513' }} />
            <div className="ninja-detail-2" style={{ backgroundColor: '#8B4513' }} />
            <div className="pants" style={{ backgroundColor: '#1A1A1A' }} />
            <div className="shoes" style={{ backgroundColor: '#1A1A1A' }} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pixel-art-container">
      <div className="character-sprite">
        {/* Cabeça */}
        <div className="head" style={{ backgroundColor: character.skinTone }}>
          {/* Olhos */}
          <div className="eyes">
            <div className="eye eye-left" style={{ backgroundColor: character.eyeColor }}>
              <div className="eye-shine" />
            </div>
            <div className="eye eye-right" style={{ backgroundColor: character.eyeColor }}>
              <div className="eye-shine" />
            </div>
          </div>
          {/* Nariz */}
          <div className="nose" style={{ backgroundColor: character.skinTone }} />
          {/* Boca */}
          <div className="mouth" />
        </div>

        {/* Cabelo */}
        <div className="hair-container">{renderHair()}</div>

        {/* Corpo */}
        <div className="body-container">{renderClothing()}</div>

        {/* Braços */}
        <div className="arm-left" style={{ backgroundColor: character.skinTone }} />
        <div className="arm-right" style={{ backgroundColor: character.skinTone }} />

        {/* Pernas já renderizadas em renderClothing */}
      </div>
    </div>
  );
}
