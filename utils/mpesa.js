import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SANDBOX_TOKEN_URL =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const PROD_TOKEN_URL =
  "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

export async function generateMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) throw new Error("MPESA_KEY/SECRET not set in .env");

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const url =
    (process.env.MPESA_ENV || "sandbox") === "production"
      ? PROD_TOKEN_URL
      : SANDBOX_TOKEN_URL;

  const resp = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
    timeout: 10000,
  });

  return resp.data.access_token;
}

export function generateTimestamp() {
  const now = new Date();
  return (
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0")
  );
}

export function generatePassword(shortcode, passkey, timestamp) {
  const raw = shortcode + passkey + timestamp;
  return Buffer.from(raw).toString("base64");
}
