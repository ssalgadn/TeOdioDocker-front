import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mocks
const mockPush = jest.fn();
export const mockLogin = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('lucide-react', () => ({
  Eye: (props) => <svg data-testid="eye" {...props} />,
  EyeOff: (props) => <svg data-testid="eye-off" {...props} />,
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ login: require('./LoginPage.test').mockLogin }),
}));

const customRender = () => render(<LoginPage />);

describe('LoginPage', () => {
  afterEach(() => {
    mockLogin.mockReset();
    mockPush.mockReset();
  });

  it('toggles password visibility', () => {
    mockLogin.mockResolvedValueOnce();
    customRender();
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const toggleBtn = screen.getByTestId('eye');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('submits with email and password and redirects on success', async () => {
    mockLogin.mockResolvedValueOnce();
    customRender();
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'secret'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'));
    customRender();
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'fail@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(() => expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument());
  });
});
