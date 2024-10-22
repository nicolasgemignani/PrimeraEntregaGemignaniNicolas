import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const collectionName = 'users'

const user2Schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Valida formato de email
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    carts: {
        type: [{
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'carts'
            }
        }],
        default: [] // Valor por defecto de un carrito vacío
    }
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar el usuario
user2Schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        return next(error)
    }
});

// Método para comparar contraseñas
user2Schema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model(collectionName, user2Schema)

export default userModel