
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/onlineSurvey")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });

// Survey answer schema
const answerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  programmingLanguage: {
    type: String,
    required: true
  },
  studyHours: {
    type: String,
    required: true
  },
  teachingSatisfaction: {
    type: String,
    required: true
  }
});

// Create model
const Answer = mongoose.model("Answer", answerSchema);

// Submit survey answers
app.post("/submit", async (req, res) => {
  try {
    const answer = await Answer.create(req.body);

    res.status(201).json({
      message: "Survey submitted successfully!",
      data: answer
    });
  } catch (err) {
    console.log("Submit error:", err.message);

    res.status(400).json({
      message: "Submission failed",
      error: err.message
    });
  }
});

// Get all survey answers
app.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.find();

    res.status(200).json(answers);
  } catch (err) {
    console.log("Fetch error:", err.message);

    res.status(500).json({
      message: "Could not fetch answers"
    });
  }
});

// Get one survey answer by ID
app.get("/answers/:id", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Survey answer not found"
      });
    }

    res.json(answer);
  } catch (err) {
    res.status(400).json({
      message: "Invalid answer ID"
    });
  }
});

// Delete a survey answer
app.delete("/answers/:id", async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);

    if (!answer) {
      return res.status(404).json({
        message: "Survey answer not found"
      });
    }

    res.json({
      message: "Survey answer deleted successfully"
    });
  } catch (err) {
    res.status(400).json({
      message: "Could not delete survey answer"
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
