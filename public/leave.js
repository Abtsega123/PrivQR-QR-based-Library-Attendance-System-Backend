// leave.js
document.addEventListener("DOMContentLoaded", () => {
  const leaveForm = document.getElementById("leaveForm");
  const leaveNameInput = document.getElementById("leaveName");

  leaveForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const leaveTime = new Date().toLocaleTimeString(); // Get current time

    // Fetch the data from the Google Sheet using your method
    // (You might need to modify this based on your specific data retrieval method)
    const sheetData = await fetchSheetData();

    const matchingRow = sheetData.find(
      (row) => row.name === leaveNameInput.value
    );

    if (matchingRow) {
      // Append the leave time to the existing row data
      matchingRow.leaveTime = leaveTime;

      // Update the sheet with the modified row
      await updateSheetData(matchingRow);

      alert("Leaving recorded successfully");
    } else {
      alert("Name not found on the sheet");
    }
  });
});

// Function to fetch data from the Google Sheet (you need to implement this)
async function fetchSheetData() {
  // Implement your data retrieval logic here
  // Return an array of objects representing rows
  // Each object should have properties like 'name', 'email', etc.
}

// Function to update data in the Google Sheet (you need to implement this)
async function updateSheetData(updatedRow) {
  // Implement your data updating logic here
  // Update the corresponding row with the leaveTime value
}
