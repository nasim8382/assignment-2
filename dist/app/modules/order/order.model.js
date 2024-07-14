"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const orderSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    productId: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
orderSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = this;
        const product = yield product_model_1.Product.findById({ _id: order.productId });
        if (!product) {
            throw new Error("Product does not exists");
        }
        const { inventory } = product;
        if (order.quantity > inventory.quantity) {
            product.inventory.inStock = false;
            yield product_model_1.Product.updateOne({ _id: order.productId }, {
                $set: { "inventory.inStock": false },
            });
            throw new Error("Insufficient quantity available in inventory");
        }
        const newQuantity = inventory.quantity - order.quantity;
        yield product_model_1.Product.updateOne({ _id: order.productId }, {
            $set: { "inventory.quantity": newQuantity },
            "inventory.inStock": newQuantity > 0,
        });
        next();
    });
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
