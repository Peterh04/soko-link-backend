import { Op, literal, where } from "sequelize";
import { Message } from "../models/Message.js";
import User from "../models/User.js";

export const saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const roomId =
      senderId < receiverId
        ? `${senderId}-${receiverId}`
        : `${receiverId}-${senderId}`;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      roomId,
    });

    res.status(200).json({ message: "Message saved", data: message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save message", error: error.message });
  }
};

export const getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.findAll({
      where: { roomId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "profileImage"],
        },
      ],
    });

    res.status(200).json({ messages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch messages", error: error.message });
  }
};

export const getLatestMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        [Op.and]: where(
          literal(`"Message"."createdAt"`),
          "=",
          literal(`(
            SELECT MAX("m2"."createdAt")
            FROM "Messages" AS "m2"
            WHERE 
              ("m2"."senderId" = "Message"."senderId" AND "m2"."receiverId" = "Message"."receiverId")
              OR
              ("m2"."senderId" = "Message"."receiverId" AND "m2"."receiverId" = "Message"."senderId")
          )`)
        ),
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profileImage"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id", "name", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ messages });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch latest messages",
        error: error.message,
      });
  }
};

export const getReceiverDetails = async (req, res) => {
  try {
    const receiverId = req.query.receiverId;
    const receiver = await User.findByPk(receiverId, {
      attributes: ["id", "name", "profileImage"],
    });

    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    res.status(200).json({ receiver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch receiver", error: error.message });
  }
};
