import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "KSh",
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Association
User.hasMany(Product, { foreignKey: "vendorId" });
Product.belongsTo(User, { as: "vendor", foreignKey: "vendorId" });

export default Product;
