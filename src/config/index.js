// Importa la funcion 'connect' de mongoose para establecer la conexion con MongoDB
import { connect } from "mongoose";

export default async () => {
    try {
        // Conecta con la base de datos de MongoDB usando un URI de conexion
        await connect('mongodb+srv://nicolasgemignani:GFzb1IGgC88ILOB9@codercluster.nyb7o.mongodb.net/BaseMongo?retryWrites=true&w=majority&appName=CoderCluster')
    } catch (error) {
        console.error('Error al conectar con la base de datos', error)
    }
}