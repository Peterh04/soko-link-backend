import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Product from "./Product.js";

export const UserWishlist = sequelize.define("UserWishlist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
});

//Associations
User.hasMany(UserWishlist, { foreignKey: "userId" });
UserWishlist.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(UserWishlist, { foreignKey: "productId" });
UserWishlist.belongsTo(Product, { foreignKey: "productId" });
