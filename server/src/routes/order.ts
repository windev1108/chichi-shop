// @ts-ignore
import { createEightStatus, createFirstStatus, createFiveStatus, createFourStatus, createNineStatus, createOrder, createSecondStatus, createSevenStatus, createSixStatus, createThirdStatus, deleteOrder, getOrderById, getOrders, getOrdersByUser, nextStatus, prevStatus, updateOrder } from '../controllers/order.ts'
import express from 'express'

const router = express.Router()


router.get("/", getOrders)

router.get("/:orderId", getOrderById)

router.get("/users/:userId", getOrdersByUser)

router.post("/", createOrder)

router.put("/:orderId", updateOrder)

router.delete("/:orderId", deleteOrder)


router.get("/:orderId/status/1", createFirstStatus)

router.get("/:orderId/status/2", createSecondStatus)

router.get("/:orderId/status/3", createThirdStatus)

router.get("/:orderId/status/4", createFourStatus)

router.get("/:orderId/status/5", createFiveStatus)

router.get("/:orderId/status/6", createSixStatus)

router.get("/:orderId/status/7", createSevenStatus)

router.get("/:orderId/status/8", createEightStatus)






export default router