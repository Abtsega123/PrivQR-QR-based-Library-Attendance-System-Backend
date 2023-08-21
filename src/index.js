import express from "express";
import { z, ZodError } from "zod";

import sheets, { SHEET_ID } from "./sheetClient.js";


const app = express();
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  roll: z.string().min(1, { roll: "roll is required" }),

  branch: z.string().min(1, { message: "Branch is required" }),
  material: z.string().min(1, { message: "Material is required" }),
});
//middleware set up
app.use(express.json());
app.use(express.static("public"));

app.post("/send-message", async (req, res) => {
  try {
    const body = contactFormSchema.parse(req.body);

    // Add formatted timestamp to the data
    const timestamp = new Date().toLocaleTimeString(); // Get only the time part
    const rows = [...Object.values(body), timestamp]; // Add formatted timestamp at the end

    console.log(rows);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Data!A:F", // Update the range to include the new timestamp column
      insertDataOption: "INSERT_ROWS",
      valueInputOption: "RAW",
      requestBody: {
        values: [rows],
      },
    });
    res.json({ message: "Data added successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error });
    }
  }
});
// ... Your existing imports ...

app.post("/leave", async (req, res) => {
  try {
    const body = contactFormSchema.parse(req.body);
    const timestamp = new Date().toLocaleTimeString();

    // Check if the data already exists in the sheet
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Data!A:F",
    });

    const existingData = sheetData.data.values; // Get the 'values' property from the response

    if (!existingData) {
      // If there's no data in the response, initialize 'existingData' as an empty array
      existingData = [];
    }

    const rowExists = existingData.findIndex((row) => {
      return (
        row[0] === body.name &&
        row[1] === body.email &&
        row[2] === body.roll &&
        row[3] === body.branch &&
        row[4] === body.material
      );
    });

    if (rowExists === -1) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Data!A:F",
        insertDataOption: "INSERT_ROWS",
        valueInputOption: "RAW",
        requestBody: {
          values: [...Object.values(body), timestamp], // Update the values directly here
        },
      });
    } else {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Data!G${rowExists + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[timestamp]],
        },
      });
    }

    res.json({ message: "Data added successfully" });
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error });
    }
  }
});





app.listen(5000, () => console.log(`App running on http://localhost:5000`));
