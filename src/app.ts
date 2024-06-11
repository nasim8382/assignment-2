import express, { Application, Request, Response } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.route";
import { OrderRoutes } from "./app/modules/order/order.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// product routes
app.use("/api/products", ProductRoutes);

// order routes
app.use("/api/orders", OrderRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const notFound = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    error: "",
  });
};

app.use(notFound);

export default app;
