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


export default router 