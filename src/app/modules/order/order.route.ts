import express from "express";
import { OrderControllers } from "./order.controller";

const router = express.Router();

// create an order
router.post("/", OrderControllers.createOrder);

// get all orders
router.get("/", OrderControllers.getAllOrders);

export const OrderRoutes = router;
