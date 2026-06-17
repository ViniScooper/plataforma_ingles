import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';

vi.mock('../utils/apiClient');

describe('LoginPage Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          {component}
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders login form correctly', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('shows error on login failure', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    const errorMsg = await screen.findByText('Invalid credentials');
    expect(errorMsg).toBeInTheDocument();
  });

  it('calls login and redirects on success', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        user: { role: 'student', name: 'Student Test' },
        token: 'fake-token'
      }
    });

    renderWithProviders(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { role: 'student', name: 'Student Test' },
        'fake-token'
      );
    });
  });
});
