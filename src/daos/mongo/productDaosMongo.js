// Importa el modelo de productos desde la carpeta de modelos
import productModel  from "../../models/productsModel.js";

// Clase para manejar las operaciones relacionadas con productos usando MongoDB a travez de Mongoose
class ProductDaosMongo {
    constructor(){
        this.model = productModel // Asigna el modelo de productos al atributo 'model' de la clase
    }

    // Metodo para obtener una lista de productos con paginacion, filtrado y ordenamiento
    getProducts = async ({ limit = 10, page = 1, sort = { price: 1 }, query = {} }) => {
        try {
            // Opciones de paginacion, ordenamiento y proyeccion para la consulta
            const options = {
                limit,
                page,
                sort,
                lean: true // Devuelve objetos de JavaScript en lugar de documentos Mongoose
            }

            // Realiza la consulta paginada usando el metodo 'paginate' del modelo
            const result = await productModel.paginate(query, options)
            return result // Retorna el resultado de la consulta
        } catch (error) {
            console.error('Error fetching products:', error)
            throw new Error('Error fetching products')
        }
    }

    // Metodo para obtener un producto por su ID
    getProductById = async (productId) => {
        try {
            // Busca el producto por su ID y devuelve un objeto plano (lean)
            const product = await this.model.findById(productId).lean()
            if (!product) {
                // Lanza un error si el producto no se encuentra
                throw new Error(`Product with ID ${productId} not found`)
            }
            return product // Retorna el producto encontrado
        } catch (error) {
            console.error(`Error fetching product by ID: ${productId}`, error)
            throw new Error('Error fetching product by ID')
        }
    };
    
    // Metodo para crear un nuevo producto
    createProduct = async (productData) => {
        try {
            // Crea un nuevo producto en la base de datos
            const newProduct = await this.model.create(productData)
            return newProduct // Retorna el producto creado
        } catch (error) {
            console.error('Error creating product:', error)
            throw new Error('Error creating product')
        }
    }
    
    // Metodo para actualizar un producto existente por su ID
    updateProduct = async (productId, updateData) => {
        try {
            // Actualizar el producto por su ID con los datos proporcionados, y devuelve el producto actualizado
            const updatedProduct = await this.model.findByIdAndUpdate(productId, updateData, { new: true, lean: true })
            if (!updatedProduct) {
                // Lanza un error si el producto no se encuentra
                throw new Error(`Product with ID ${productId} not found`)
            }
            return updatedProduct // Retorna el producto actualizado
        } catch (error) {
            console.error('Error updating product:', error)
            throw new Error('Error updating product')
        }
    }
    
    // Metodo para eleminar un producto por su ID
    deleteProduct = async (productId) => {
        try {
            // Elimina el producto por su ID
            const deletedProduct = await this.model.findByIdAndDelete(productId)
            if (!deletedProduct) {
                // Lanza un error si el producto no se encuentra
                throw new Error(`Product with ID ${productId} not found`)
            }
            return deletedProduct // Retorna el producto eliminado
        } catch (error) {
            console.error('Error deleting product:', error)
            throw new Error('Error deleting product')
        }
    }
}

export default ProductDaosMongo