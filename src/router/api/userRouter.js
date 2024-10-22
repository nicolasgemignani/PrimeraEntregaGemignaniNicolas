import { Router } from 'express';

import userDaosMongo from '../../daos/mongo/usersDaosMongo.js';
import { passportCall } from '../../midllewares/passportMiddle.js';
import { authorization } from '../../midllewares/authorization.js';

const router = Router()
const userService = new userDaosMongo()

// Obtener todos los usuarios
router.get('/', passportCall('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        const listUsers = await userService.getAllUsers();
        res.json({ status: 'success', payload: listUsers });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener usuarios', error: error.message })
    }
});

// Obtener un usuario por ID
router.get('/:id', passportCall('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' })
        }
        res.json({ status: 'success', payload: user })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener el usuario', error: error.message })
    }
});

// Crear un nuevo usuario
router.post('/', passportCall('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body)
        res.json({ status: 'success', payload: newUser })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al crear usuario', error: error.message });
    }
});

// Actualizar usuario
router.put('/:id', passportCall('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.json({ status: 'success', payload: updatedUser })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar usuario', error: error.message })
    }
});

// Eliminar usuario
router.delete('/:id', passportCall('jwt', { session: false }), authorization('admin'), async (req, res) => {
    try {
        await userService.deleteUser(req.params.id)
        res.json({ status: 'success', message: 'Usuario eliminado' })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar usuario', error: error.message })
    }
});

export default router;
