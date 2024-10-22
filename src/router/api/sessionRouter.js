import { Router } from "express";
/* import passport from "passport"; */

import usersDaosMongo from '../../daos/mongo/usersDaosMongo.js'
import { generateToken } from "../../utils/jwtToken.js"
import { passportCall } from "../../midllewares/passportMiddle.js";
import { authorization } from "../../midllewares/authorization.js";

const router = Router()
const userService = new usersDaosMongo()

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Ingrese email y password' })
    }

    const userFound = await userService.getUser({ email })

    if (userFound) {
        return res.status(401).send({ status: 'error', error: 'El usuario ya existe' })
    }

    const newUser = {
        first_name,
        last_name,
        email,
        password
    };

    const result = await userService.createUser(newUser)
    res.redirect('/login') // Mensaje de éxito
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const userFound = await userService.getUser({ email })
        if (!userFound) {
            return res.status(404).send({ status: 'error', error: 'No existe el usuario' })
        }

        const isMatch = await userFound.comparePassword(password)
        if (!isMatch) {
            return res.render('login', { error: 'Contraseña incorrecta' })
        }

        const token = generateToken({ id: userFound._id, role: userFound.role, first_name: userFound.first_name })

        res.cookie('token', token, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        return res.redirect('/products')
    } catch (error) {
        console.error(error); // Log para el seguimiento de errores
        res.render('login', { error: 'Error al iniciar sesión. Inténtalo de nuevo.' })
    }
});

router.post('/logout', passportCall('jwt', { session: false }), async (req, res) => {
    res.clearCookie('token'); // Limpia la cookie del token
    res.redirect('/login')
});

router.get('/current', passportCall('jwt', {session: false}), authorization('admin'), async (req, res) => {
    res.send({ dataUser: req.user, message: 'datos senscibles' })
})


export default router