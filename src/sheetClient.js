import { google } from "googleapis";

import key from "../secret.json" assert { type: "json" };

export const SHEET_ID = "1E5jG1z51S4AsyKjNcbErr0xoM8HiZKKDCyoo-jRZ7GM";


const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);
const sheets = google.sheets({ version: "v4", auth: client });

export default sheets;
