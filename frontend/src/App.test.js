import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('debe mostrar un mensaje de error cuando la contraseña es incorrecta', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'usuario@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'incorrecta' } });
    fireEvent.click(screen.getByText(/iniciar sesión/i));

    const errorMessage = await screen.findByText(/credenciales incorrectas/i);
    expect(errorMessage).toBeInTheDocument();
});
