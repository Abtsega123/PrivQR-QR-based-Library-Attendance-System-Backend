import { google } from "googleapis";

import key from "../secret.json" assert { type: "json" };

export const SHEET_ID = "1Ii8-X1W4PCCHyCmFnzB8TJrbIUCEbi9z5UOGk-S2zwI";


const client = new google.auth.JWT(key.client_email, null, key.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);
const sheets = google.sheets({ version: "v4", auth: client });

export default sheets;
