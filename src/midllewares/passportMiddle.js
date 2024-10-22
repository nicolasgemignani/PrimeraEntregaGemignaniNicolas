import passport from "passport"
import jwt from 'jsonwebtoken'

export const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error) // Manejo de errores
            }
            if (!user) {
                return res.status(401).send({ error: info?.message || 'Unauthorized' })
            }
            req.user = user // Establecer el usuario autenticado en req.user
            next()
        })(req, res, next)
    };
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token // Obtenemos el token de las cookies

    console.log('Token:', token) // Verifica si el token está llegando

    if (!token) {
        req.user = null; // No hay token, no hay usuario
        console.log('No token found, setting req.user to null') // Debug log
        return next() // Pasamos al siguiente middleware
    }

    jwt.verify(token, 'CoderKeySecret@para-la-firma', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err) // Agregar un log para ver si hay error
            req.user = null // Si hay un error en la verificación, no hay usuario
            return next() // Pasamos al siguiente middleware
        }

        req.user = decoded // Agrega el usuario decodificado a req.user
        console.log('User found:', req.user);// Verifica que req.user tenga los datos esperados
        next()
    })
}