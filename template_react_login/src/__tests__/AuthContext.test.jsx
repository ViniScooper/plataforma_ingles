import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('provides default values', () => {
    let contextValues;
    
    function TestComponent() {
      contextValues = useContext(AuthContext);
      return <div>Test</div>;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(contextValues.user).toBeNull();
    expect(contextValues.token).toBeNull();
    expect(contextValues.loading).toBe(false);
  });

  it('login function sets user and token', () => {
    let contextValues;
    
    function TestComponent() {
      contextValues = useContext(AuthContext);
      return (
        <button onClick={() => contextValues.login({ name: 'John' }, 'fake-token')}>
          Login
        </button>
      );
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    expect(contextValues.user).toEqual({ name: 'John' });
    expect(contextValues.token).toBe('fake-token');
    expect(sessionStorage.getItem('token')).toBe('fake-token');
    expect(sessionStorage.getItem('user')).toBe(JSON.stringify({ name: 'John' }));
  });

  it('logout function clears user and token', () => {
    let contextValues;
    sessionStorage.setItem('token', 'fake-token');
    sessionStorage.setItem('user', JSON.stringify({ name: 'John' }));
    
    function TestComponent() {
      contextValues = useContext(AuthContext);
      return (
        <button onClick={() => contextValues.logout()}>
          Logout
        </button>
      );
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(contextValues.user).toEqual({ name: 'John' });

    act(() => {
      screen.getByText('Logout').click();
    });

    expect(contextValues.user).toBeNull();
    expect(contextValues.token).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });
});
