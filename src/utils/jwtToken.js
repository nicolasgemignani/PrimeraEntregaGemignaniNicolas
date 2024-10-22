import jwt from 'jsonwebtoken'

export const PRIVATE_KEY = 'CoderKeySecret@para-la-firma'
export const generateToken = user => jwt.sign(user, PRIVATE_KEY, { expiresIn: '1d' })