import userModel from "../../models/usersModel.js";

class userDaosMongo {
    constructor() {
        this.model = userModel;
    }

    // Crear un nuevo usuario
    createUser = async (user) => {
        try {
            const newUser = await this.model.create(user); // Falta await
            return newUser;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error; // Lanzar el error para que el controlador lo maneje
        }
    }

    // Buscar un usuario por filtro
    getUser = async (filter) => {
        try {
            const user = await this.model.findOne(filter);
            if (!user) {
                console.log('Usuario no encontrado');
                return null; // O lanzar un error si prefieres
            }
            return user;
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            throw error; // Lanzar el error para que el controlador lo maneje
        }
    }

    // Obtener todos los usuarios
    getAllUsers = async () => {
        try {
            const users = await this.model.find();
            return users;
        } catch (error) {
            console.error('Error buscando usuarios:', error);
            throw error; // Lanzar el error para que el controlador lo maneje
        }
    }
    
    // Actualizar un usuario por ID
    updateUser = async (userId, updateData) => {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(userId, updateData, { new: true }); // Devuelve el usuario actualizado
            if (!updatedUser) {
                console.log('Usuario no encontrado para actualizar');
                return null;
            }
            return updatedUser;
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error; // Lanzar el error para que el controlador lo maneje
        }
    }

    // Borrar un usuario por ID
    deleteUser = async (userId) => {
        try {
            const deletedUser = await this.model.findByIdAndDelete(userId);
            if (!deletedUser) {
                console.log('Usuario no encontrado para borrar');
                return null;
            }
            return deletedUser;
        } catch (error) {
            console.error('Error al borrar usuario:', error);
            throw error; // Lanzar el error para que el controlador lo maneje
        }
    }
}

export default userDaosMongo