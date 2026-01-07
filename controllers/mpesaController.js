import Invoice from "../models/Invoice.js";

import {
  generateMpesaToken,
  generatePassword,
  generateTimestamp,
} from "../utils/mpesa.js";
import axios from "axios";

export const getMpesaToken = async (req, res) => {
  try {
    const token = await generateMpesaToken();
    res.json({ access_token: token });
  } catch (err) {
    console.error("Failed to generate token:", err.message || err);
    res.status(500).json({ error: "Failed to generate token" });
  }
};

export const stkPush = async (req, res) => {
  const { phone, amount, invoiceId } = req.body;

  try {
    const token = await generateMpesaToken();
    const timestamp = generateTimestamp();

    const password = generatePassword(
      process.env.MPESA_SHORTCODE,
      process.env.MPESA_PASSKEY,
      timestamp
    );

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: "Sokolink",
        TransactionDesc: "Invoice Payment",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ UPDATE invoice instead of creating

    await Invoice.update(
      {
        status: "pending",
        checkoutRequestID: response.data.CheckoutRequestID,
      },
      {
        where: { id: invoiceId },
      }
    );

    res.json({
      message: "STK Push Sent",
      data: response.data,
    });
  } catch (err) {
    console.error("STK Push Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process STK Push" });
  }
};

export const callback = async (req, res) => {
  try {
    console.log("RAW CALLBACK:", JSON.stringify(req.body, null, 2));

    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) {
      return res.status(200).json({ message: "Invalid callback structure" });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = callbackData;

    const invoice = await Invoice.findOne({
      where: { checkoutRequestID: CheckoutRequestID },
    });

    if (!invoice) {
      return res.status(200).json({ message: "Invoice not found" });
    }

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];

      const amount = items.find((i) => i.Name === "Amount")?.Value;
      const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
      const phone = items.find((i) => i.Name === "PhoneNumber")?.Value;
      const transactionID = items.find(
        (i) => i.Name === "MpesaReceiptNumber"
      )?.Value;

      invoice.status = "paid";
      invoice.mpesaReceipt = receipt;
      invoice.paidAmount = amount;
      invoice.paidPhone = phone;
      invoice.transactionID = transactionID;
      await invoice.save();
      console.log("UPDATED STATUS:", invoice.status);
    } else {
      invoice.status = "failed";
      await invoice.save();
    }

    console.log("CALLBACK RECEIVED", JSON.stringify(req.body, null, 2));
    return res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    console.error("Callback error:", err);
    return res.status(500).json({ error: "Callback failed" });
  }
};
