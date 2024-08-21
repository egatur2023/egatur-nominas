import { useState } from 'react';
import { Container, Box, TextField, Button, Typography, MenuItem, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';

const roles = [
    { id: 1, name: 'ADMIN' },
    { id: 2, name: 'SUPERVISOR' },
    { id: 3, name: 'ADVISOR' },
    { id: 4, name: 'GUEST' }
];

const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState(roles[0].id);
    const [open, setOpen] = useState(false); // Estado para manejar la visibilidad del Snackbar
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/user/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username, roleId }),
        });

        if (res.ok) {
            setSnackMessage('Usuario creado exitosamente');
            setSnackSeverity('success');
            setOpen(true); // Mostrar el Snackbar
            // Limpiar los campos del formulario
            setEmail('');
            setPassword('');
            setUsername('');
            setRoleId(roles[0].id);
        } else {
            setSnackMessage('Error al crear el usuario');
            setSnackSeverity('error');
            setOpen(true); // Mostrar el Snackbar
        }
    };

    const handleClose = () => {
        setOpen(false); // Ocultar el Snackbar
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Crear Usuario
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Correo Electrónico"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Nombre de Usuario"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        select
                        label="Rol"
                        fullWidth
                        margin="normal"
                        value={roleId}
                        onChange={(e) => setRoleId(parseInt(e.target.value))}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Guardar
                    </Button>
                </form>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity={snackSeverity} sx={{ width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default CreateUser;
