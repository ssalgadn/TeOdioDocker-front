import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';

const signupMock = jest.fn();
export { signupMock as signupMock };

jest.mock('lucide-react', () => ({
  Eye: (props) => <svg data-testid="eye" {...props} />,
  EyeOff: (props) => <svg data-testid="eye-off" {...props} />,
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signup: signupMock, isLoading: false }),
}));

const setup = () => render(<RegisterPage />);

describe('RegisterPage', () => {
  afterEach(() => {
    signupMock.mockReset();
  });

  it('toggles password visibility', () => {
    setup();
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const toggleBtn = screen.getAllByTestId('eye')[0];
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('shows error when passwords do not match', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Nombre de usuario'), { target: { value: 'Ash' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'ash@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Password1!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'Different1!' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('validates password policy', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Nombre de usuario'), { target: { value: 'Misty' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'misty@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    expect(screen.getByText(/La contraseña debe cumplir/i)).toBeInTheDocument();
    expect(signupMock).not.toHaveBeenCalled();
  });

  it('calls signup with valid data', async () => {
    signupMock.mockResolvedValueOnce();
    setup();
    fireEvent.change(screen.getByPlaceholderText('Nombre de usuario'), { target: { value: 'Brock' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'brock@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'StrongPass1!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'StrongPass1!' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    await waitFor(() => expect(signupMock).toHaveBeenCalledWith('brock@example.com', 'StrongPass1!', 'Brock'));
  });
});
