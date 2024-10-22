// Importa el modulo express para crear el enrutador y los modulos de los enrutadores de API
import { Router} from 'express'

import sessionRouter from './api/sessionRouter.js'
import productRouter from './api/productRouter.js'
import cartRouter from './api/cartRouter.js'
import userRouter from './api/userRouter.js'

// Crea una nueva instancia del enrutador de express
const router = Router()


router.use('/api/sessions', sessionRouter)

// Redirige las solicitudes a '/api/products' al enrutador de productos
router.use('/api/products', productRouter)

// Redirige las solicutdes a '/api/carts' al enrutador de carritos
router.use('/api/carts', cartRouter)


router.use('/api/users', userRouter)

// Exporta el enrutador para que pueda ser usado en otros modulos
export default router