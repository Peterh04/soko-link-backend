import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";
import { Message } from "../models/Message.js";
import { Comment } from "../models/Comment.js";

export const createInvoice = async (req, res) => {
  try {
    const { buyerId, productId, amount, phone, transactionID } = req.body;
    const vendorId = req.user.id;
    const invoiceNumber = Math.floor(100000 + Math.random() * 900000);
    const invoice = await Invoice.create({
      vendorId,
      buyerId,
      productId,
      amount,
      phone,
      invoiceNumber,
      transactionID,
    });

    await Message.create({
      senderId: vendorId,
      receiverId: buyerId,
      content: `invoice:${invoice.id}`,
      roomId: `${buyerId}-${vendorId}`,
      type: "invoice",
    });

    res
      .status(200)
      .json({ message: "Successfully created the Invoice", invoice });
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ message: "Failed to create invoice" });
  }
};

export const getIvoice = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const invoice = await Invoice.findOne({
      where: { buyerId: userId, id },
      attributes: [
        "id",
        "amount",
        "phone",
        "status",
        "productId",
        "transactionID",
        "createdAt",
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price"],
        },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Check if the user has already commented
    const comment = await Comment.findOne({
      where: {
        buyerId: userId,
        productId: invoice.productId,
        invoiceId: invoice.id,
      },
    });

    const result = {
      ...invoice.toJSON(),
      product: {
        ...invoice.product.toJSON(), // lowercase 'product'
        alreadyReviewed: comment ? true : false,
      },
    };

    res
      .status(200)
      .json({ message: "Successfully fetched the invoice", invoice: result });
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};

export const getUserInvoices = async (req, res) => {
  const userId = req.user.id;

  try {
    const invoices = await Invoice.findAll({
      where: {
        buyerId: userId,
        status: "paid",
      },
    });

    res
      .status(200)
      .json({ message: "Succesfully fetched users ivoices", invoices });
  } catch {
    res.status(500).json({ message: "Failed to fetch User's invoices" });
  }
};
