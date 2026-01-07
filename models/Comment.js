import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Product from "./Product.js";
import Invoice from "./Invoice.js";

export const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },

  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  rating: {
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

  images: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Association
User.hasMany(Comment, { foreignKey: "buyerId" });
Comment.belongsTo(User, { as: "buyer", foreignKey: "buyerId" });

User.hasMany(Comment, { foreignKey: "vendorId" });
Comment.belongsTo(User, { as: "vendor", foreignKey: "vendorId" });

Product.hasMany(Comment, { foreignKey: "productId" });
Comment.belongsTo(Product, { foreignKey: "productId" });

Invoice.hasMany(Comment, { foreignKey: "invoiceId" });
Comment.belongsTo(Invoice, { foreignKey: "invoiceId" });
