import { Request, Response } from "express";
import { OrderServices } from "./order.service";

// create an order
const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.createOrderIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Order created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

// get all orders and search orders by email
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const orders = await OrderServices.getAllOrdersFromDB();

    if (!email) {
      res.status(200).json({
        success: true,
        message: "Orders fetched successfully!",
        data: orders,
      });
    } else {
      const ordersByEmail = orders.filter((order) => order.email === email);

      res.status(200).json({
        success: true,
        message: "Orders fetched successfully for user email!",
        data: ordersByEmail,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
};