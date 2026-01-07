import { Comment } from "../models/Comment.js";
import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
User;

export const comment = async (req, res) => {
  try {
    const { content, images, vendorId, rating, productId, invoiceId } =
      req.body;
    const buyerId = req.user.id;

    const invoice = await Invoice.findOne({
      where: { id: invoiceId, buyerId, productId, status: "paid" },
    });

    if (!invoice) {
      return res.status(400).json({
        message: "You cannot comment on a product you haven't bought",
      });
    }

    const existingComment = await Comment.findOne({
      where: { buyerId, productId, invoiceId },
    });

    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already commented on this product" });
    }

    const newComment = await Comment.create({
      content,
      images,
      buyerId,
      vendorId,
      rating,
      productId,
      invoiceId,
    });

    res
      .status(200)
      .json({ message: "Comment created successfully!", comment: newComment });
  } catch (error) {
    console.error("Comment Error:", error);
    res
      .status(500)
      .json({ message: "Unable to create the comment", error: error.message });
  }
};

export const getVendorComments = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const comments = await Comment.findAll({
      where: { vendorId },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: ["id", "name", "profileImage"],
        },
      ],
    });
    res.status(200).json({
      message: "Featch all comments successfully",
      comments: comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching  comments", error: error });
  }
};
