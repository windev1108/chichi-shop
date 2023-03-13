// @ts-ignore
import { addProductToCart, clearCart, getCart, plusProductItem, removeProductOutCart, takeAwayProductItem, updateCart } from '../controllers/cart.ts'
// @ts-ignore
import { createUser, deleteUserById, getUserById, getUsers, updateUserById } from '../controllers/users.ts'
import express from 'express'

const router = express.Router()


// get all users
router.get('/', getUsers)

// get user by id
router.get('/:id', getUserById)

// add user
router.post('/', createUser)

// update user
router.put('/:id', updateUserById)

// delete user
router.delete('/:id', deleteUserById)


// get cart 

router.get('/:userId/cart', getCart)
// add To cart
router.post('/:userId/cart', addProductToCart)

// update cart
router.put('/:userId/cart/:productId', updateCart)

router.delete('/:userId/cart/:productId', removeProductOutCart)
// remove product
router.delete('/:userId/cart', clearCart)

router.get('/:userId/cart/:productId/plus' , plusProductItem )


router.get('/:userId/cart/:productId/takeAway' , takeAwayProductItem )

export default router 