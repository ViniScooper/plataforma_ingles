import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/signin', {
        email: formData.email,
        password: formData.password,
      });

      login(response.data.user, response.data.token);
      navigate(response.data.user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #0d1b2a 0%, #1a3a5c 35%, #0f2744 65%, #071525 100%);
          position: relative;
          overflow: hidden;
        }

        .login-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 180, 216, 0.15) 0%, transparent 70%);
          top: -150px;
          right: -150px;
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(72, 199, 142, 0.1) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          pointer-events: none;
        }

        .orb-1 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 119, 182, 0.2) 0%, transparent 70%);
          top: 30%;
          left: -80px;
          pointer-events: none;
          animation: floatOrb 8s ease-in-out infinite;
        }

        .orb-2 {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(72, 199, 142, 0.15) 0%, transparent 70%);
          bottom: 20%;
          right: 5%;
          pointer-events: none;
          animation: floatOrb 10s ease-in-out infinite reverse;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 24px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow:
            0 32px 64px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 1px 0 rgba(255,255,255,0.1) inset;
          animation: cardSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
        }

        .logo-img {
          width: 180px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 4px 24px rgba(0, 180, 216, 0.3));
          animation: logoPulse 3s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 4px 24px rgba(0, 180, 216, 0.3)); }
          50% { filter: drop-shadow(0 4px 36px rgba(72, 199, 142, 0.4)); }
        }

        .login-subtitle {
          margin-top: 12px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          margin-bottom: 28px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 8px;
        }

        .field-wrapper {
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #fff;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }

        .field-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .field-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(0, 180, 216, 0.6);
          box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.15);
        }

        .error-box {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid rgba(220, 53, 69, 0.35);
          border-radius: 10px;
          padding: 12px 16px;
          color: #ff8fa3;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 16px;
          animation: shakeError 0.4s ease;
        }

        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 15px;
          background: linear-gradient(135deg, #00b4d8, #48c78e);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s ease;
        }

        .submit-btn:hover::before {
          left: 100%;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 180, 216, 0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0px);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .footer-text {
          margin-top: 28px;
          text-align: center;
          color: rgba(255,255,255,0.25);
          font-size: 0.78rem;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="login-root">
        <div className="orb-1" />
        <div className="orb-2" />

        <div className="login-card">
          <div className="logo-section">
            <img
              className="logo-img"
              src="/Gemini_Generated_Image_ktr3aktr3aktr3ak.png"
              alt="Vnglish – Plataforma de Inglês"
            />
            <span className="login-subtitle">Acesse sua conta</span>
          </div>

          <div className="divider" />

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="field-wrapper">
                <label className="field-label" htmlFor="email">E-mail</label>
                <input
                  id="email"
                  className="field-input"
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field-wrapper">
                <label className="field-label" htmlFor="password">Senha</label>
                <input
                  id="password"
                  className="field-input"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="footer-text">Vnglish © {new Date().getFullYear()} · Plataforma de Inglês</p>
        </div>
      </div>
    </>
  );
}
