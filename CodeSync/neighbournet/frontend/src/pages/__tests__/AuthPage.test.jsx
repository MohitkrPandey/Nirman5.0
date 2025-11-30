import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthPage from '../AuthPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

describe('AuthPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('renders login tab by default', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.queryByLabelText('Full Name')).not.toBeInTheDocument();
    });

    it('switches to signup tab when clicked', () => {
        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );

        const signupTab = screen.getByText('Sign Up');
        fireEvent.click(signupTab);

        expect(screen.getByText('Create account')).toBeInTheDocument();
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('submits login form and navigates on success', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'test-token', user: { email: 'test@example.com' } }),
        });

        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByText('Continue'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/map');
        });
    });

    it('displays error message on failed login', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        });

        render(
            <BrowserRouter>
                <AuthPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'wrong' },
        });

        fireEvent.click(screen.getByText('Continue'));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
