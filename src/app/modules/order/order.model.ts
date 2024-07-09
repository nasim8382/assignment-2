import { Schema, model } from "mongoose";
import { TOrder } from "./order.interface";
import { Product } from "../product/product.model";

const orderSchema = new Schema<TOrder>({
  email: { type: String, required: true },
  productId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

orderSchema.pre<TOrder>("save", async function (next) {
  const order = this as TOrder;

  const product = await Product.findById({ _id: order.productId });

  if (!product) {
    throw new Error("Product does not exists");
  }

  const { inventory } = product;

  if (order.quantity > inventory.quantity) {
    product.inventory.inStock = false;

    await Product.updateOne(
      { _id: order.productId },
      {
        $set: { "inventory.inStock": false },
      }
    );

    throw new Error("Insufficient quantity available in inventory");
  }

  const newQuantity = inventory.quantity - order.quantity;

  await Product.updateOne(
    { _id: order.productId },
    {
      $set: { "inventory.quantity": newQuantity },
      "inventory.inStock": newQuantity > 0,
    }
  );

  next();
});

export const Order = model<TOrder>("Order", orderSchema);
