import express from 'express'
import CartDaosMongo from '../../daos/mongo/cartsDaosMongo.js'

// Crea una nueva instancia del enrutador de express
const router = express.Router()
// Crea una nueva instancia del servicio de carrito
const cartService = new CartDaosMongo()


// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Llamar al método createCart para crear un nuevo carrito
        const cart = await cartService.createCart()
        // Guarda el ID del carrito en la sesion del usuario
        req.session.cartId = cart._id
        // Responde con el ID del nuevo carrito
        res.json({ cartId: cart._id})
    } catch (error) {
        console.error('Error creando el carrito:', error)
        res.status(500).json({
            status: 'error',
            message: 'No se pudo crear el carrito'
        })
    }
})

// Ruta para obtener un carrito por su ID
router.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        // Llamar al método getCartById para obtener el carrito
        const cart = await cartService.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        console.error('Error obteniendo el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo obtener el carrito'
        });
    }
});

// Ruta para agregar un producto al carrito
router.post('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params
        const { quantityToAdd = 1 } = req.body // Obtener la cantidad desde el cuerpo de la solicitud (opcional)

        // Llamar al metodo addProductToCart para agregar el producto al carrito
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantityToAdd)

        if (!updatedCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito o producto no encontrado'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto agregado al carrito exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error agregando el producto al carrito:', error)
        res.status(500).json({
            status: 'error',
            message: 'No se pudo agregar el producto al carrito'
        })
    }
})

// Ruta para actualizar los productos en el carrito
router.put('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params
        const newProducts = req.body // El cuerpo debe ser un arreglo de productos [{ product: 'productId', quantity: 1 }, ...]

        // Validar que newProducts sea un arreglo de objetos con los campos necesarios
        if (!Array.isArray(newProducts) || newProducts.some(p => !p.product || !p.quantity)) {
            return res.status(400).json({
                status: 'error',
                message: 'Formato de productos inválido. Debe ser un arreglo de objetos con los campos "product" y "quantity".'
            })
        }

        // Llamar al método updateCartProducts para actualizar los productos del carrito
        const updatedCart = await cartService.updateCartProducts(cartId, newProducts)

        res.status(200).json({
            status: 'success',
            message: 'Carrito actualizado exitosamente',
            payload: updatedCart
        });
    } catch (error) {
        console.error('Error actualizando los productos del carrito:', error)
        res.status(500).json({
            status: 'error',
            message: 'No se pudo actualizar el carrito'
        })
    }
})

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cartId/product/:productId', async (req, res) => {
    const { cartId, productId } = req.params
    const { quantity } = req.body

    try {
        // Validar que quantity sea un numero positivo
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número positivo' })
        }

        // Llamar al servicio para actualizar la cantidad del producto
        const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity)

        // Verificar si se devolvió un carrito actualizado
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' })
        }

        // Responder con el carrito actualizado
        res.status(200).json({
            status: 'success',
            payload: updatedCart
        });
    } catch (error) {
        // Manejar y responder con errores
        console.error('Error al actualizar la cantidad del producto:', error)
        res.status(500).json({ error: 'No se pudo actualizar la cantidad del producto' })
    }
})



// Ruta para eliminar un producto del carrito
router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params

        // Llamar al método removeProductFromCart para eliminar el producto del carrito
        const updatedCart = await cartService.removeProductFromCart(cartId, productId)

        if (!updatedCart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito o producto no encontrado'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Producto eliminado del carrito exitosamente',
            payload: updatedCart
        })
    } catch (error) {
        console.error('Error eliminando el producto del carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo eliminar el producto del carrito'
        })
    }
})


// Ruta para vaciar el carrito
router.delete('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params
        
        // Llamar al método emptyCart para vaciar el carrito
        const updatedCart = await cartService.emptyCart(cartId)
        
        res.status(200).json({
            status: 'success',
            message: 'Carrito vaciado exitosamente',
            payload: updatedCart
        })
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'No se pudo vaciar el carrito'
        })
    }
})

// Ruta para eliminar el carrito
router.delete('/remove/:cartId', async (req, res) => {
    const { cartId } = req.params

    try {
        const result = await cartService.deleteCart(cartId)
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

export default router