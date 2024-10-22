// Importa los modelos de mongoose para el manejo de carritos y productos
import cartModel from '../../models/cartsModel.js'
import productModel from '../../models/productsModel.js'

// Clase para gestionar las operaciones de carritos utilizando MongoDB a traves de Mongoose
class CartDaosMongo {
    constructor(){
        // Define el modelo de carrito que se utilizara para todas las operaciones
        this.model = cartModel
    }

    // Metodo para crear un nuevo carrito vacio
    createCart = async () => {
        try {
            // Crea una instancia de carrito con un arreglo vacio de productos
            const newCart = new this.model({ products: [] })

            await newCart.save() // Guarda el nuevo carrito en la base de datos

            return newCart // Retorna el carrito creado
        } catch (error) {
            console.log(error)
        }
    }

    // Metodo para obtener un carrito por su ID
    getCartById = async (cartId) => {
        try {
            // Busca el carrito por ID
            const cart = await this.model.findById(cartId)
            if (!cart) {
                console.log('Error')
            }
            return cart
        } catch (error) {
            console.log(error)
        }
    }

    // Metodo para agregar un producto al carrito con la cantidad especifica
    addProductToCart = async (cartId, productId, quantityToAdd = 1) => {
    try {
        // Busca el carrito por ID
        const cart = await this.model.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Busca el producto por ID
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Intenta actualizar la cantidad del producto en el carrito
        const updateResult = await this.model.updateOne(
            { _id: cartId, 'products.product': productId },
            {
                $inc: { 'products.$.quantity': quantityToAdd }
            }
        );

        // Si no se actualizó, significa que el producto no estaba en el carrito
        if (updateResult.modifiedCount === 0) {
            // Agrega el nuevo producto al carrito
            cart.products.push({ product: productId, quantity: quantityToAdd });
            await cart.save(); // Guarda el carrito actualizado
        }

        return cart; // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error agregando el producto al carrito:', error);
        throw new Error('No se pudo agregar el producto al carrito');
    }
}


    // Metodo para actualizar los productos de un carrito
    updateCartProducts = async (cartId, newProducts) => {
        try {
            // Busca el carrito por ID
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            
            // Obtener los Ids de los nuevos productos
            const productIds = newProducts.map(p => p.product);

            // Verifica si todos los productos existen en la base de datos
            const existingProducts = await productModel.find({ _id: { $in: productIds } });
            const existingProductIds = new Set(existingProducts.map(p => p._id.toString()));
    
            if (productIds.some(id => !existingProductIds.has(id))) {
                throw new Error('Uno o más productos no existen en la colección');
            }
    
            // Mapea los nuevos productos a un objeto para una facil busqueda
            const newProductsMap = newProducts.reduce((acc, { product, quantity }) => {
                acc[product.toString()] = quantity;
                return acc;
            }, {});
    
            // Actualizar la cantidad de los productos existentes en el carrito
            cart.products = cart.products.map(p => {
                if (newProductsMap[p.product.toString()] !== undefined) {
                    return { product: p.product, quantity: newProductsMap[p.product.toString()] };
                }
                return p;
            });
    
            // Agrega los productos nuevos que no estan en el carrito
            newProducts.forEach(({ product, quantity }) => {
                if (!cart.products.some(p => p.product.toString() === product.toString())) {
                    cart.products.push({ product, quantity });
                }
            });
    
            // Filtra los productos del carrito que ya no estan en los nuevos productos
            cart.products = cart.products.filter(p => newProductsMap[p.product.toString()] !== undefined);
    
            await cart.save(); // Guarda el carrito actualizado
            return cart;
        } catch (error) {
            console.error('Error actualizando el carrito:', error);
            throw new Error('No se pudo actualizar el carrito');
        }
    }

    // Metodo para actualizar la cantidad de un propducto en el carrito
    updateProductQuantity = async (cartId, productId, newQuantity) => {
        try {
            const cart = await this.model.findById(cartId); // Buscar el carrito por ID
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            // Buscar el producto dentro del carrito
            const product = cart.products.find(p => p.product._id.toString() === productId.toString());
            if (!product) {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            product.quantity = newQuantity; // Actualizar la cantidad del producto
            await cart.save(); // Guardar el carrito actualizado
            return cart;
        } catch (error) {
            console.error('Error actualizando la cantidad del producto:', error);
            throw new Error('No se pudo actualizar la cantidad del producto');
        }
    }
    
    // Metodo para eliminar un producto del carrito
    removeProductFromCart = async (cartId, productId) => {
        try {
            const cart = await this.model.findById(cartId) // Buscar el carrito por ID
            if (!cart) {
                console.log('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId.toString())
            if (productIndex === -1) {
                console.log('Producto no encontrado');
            }

            cart.products.splice(productIndex, 1) // Eliminar el producto del carrito
            await cart.save() // Guardar el carrito actualizado
            return cart
        } catch (error) {
            console.log(error);
        }
    }
    
    // Metodo para vaciar todos los productos de un carrito
    emptyCart = async (cartId) => {
        try {
            const cart = await this.model.findById(cartId); // Buscar el carrito por ID
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            cart.products = []; // Vaciar el arreglo de productos
            await cart.save(); // Guardar el carrito actualizado
            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            throw new Error('No se pudo vaciar el carrito');
        }
    };
    
    // Metodo para eliminar un carrito por su ID
    deleteCart = async (cartId) => {
        try {
            const result = await this.model.deleteOne({ _id: cartId }); // Eliminar el carrito por ID

            if (result.deletedCount === 0) {
                throw new Error('Carrito no encontrado'); // Lanza un error si el carrito no se encontro
            }

            return { message: 'Carrito eliminado correctamente' }; // Mensaje de exito
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw new Error('No se pudo eliminar el carrito');
        }
    };
}

export default CartDaosMongo