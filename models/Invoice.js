import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Product from "./Product.js";

export const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },
  checkoutRequestID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionID: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
});

// User associations
User.hasMany(Invoice, { foreignKey: "buyerId", as: "buyerInvoices" });
User.hasMany(Invoice, { foreignKey: "vendorId", as: "vendorInvoices" });
Invoice.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Invoice.belongsTo(User, { foreignKey: "vendorId", as: "vendor" });

// Product associations (add alias here)
Product.hasMany(Invoice, { foreignKey: "productId" });
Invoice.belongsTo(Product, { foreignKey: "productId", as: "product" }); // ✅ alias added

export default Invoice;
