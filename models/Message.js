import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

export const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  senderId: { type: DataTypes.INTEGER, allowNull: false },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.STRING, allowNull: false },
  roomId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: "normal" },
});

// Associations
User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });
