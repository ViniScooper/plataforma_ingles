import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StudentPage from '../pages/StudentPage';

describe('StudentPage Component', () => {
  it('renders StudentPage without crashing', () => {
    const mockUser = { id: 1, name: 'Student Test', role: 'student', email: 'student@test.com' };
    const mockAuthContext = {
      user: mockUser,
      logout: vi.fn(),
      token: 'fake-token'
    };

    expect(() => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthContext}>
            <StudentPage />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    }).not.toThrow();
  });
});
