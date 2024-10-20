const fs = require("fs");
const path = require("path");

// Define input and output file paths
const inputFile = path.join(__dirname, "questions.txt");
const outputFile = path.join(__dirname, "public/questions.json");

// Read questions from the text file
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Split the file content by new lines and clean up each line
  const questions = data
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim()) // Remove number and trim spaces
    .filter(Boolean); // Remove any empty lines

  // Create JSON structure
  const jsonContent = {
    questions: questions,
  };

  // Write JSON to the output file
  fs.writeFile(
    outputFile,
    JSON.stringify(jsonContent, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing the JSON file:", err);
      } else {
        console.log("questions.json file has been created successfully.");
      }
    },
  );
});
