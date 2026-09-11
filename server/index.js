const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/student_registration";

const bloodGroups = new Set(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]);
const genders = new Set(["Male", "Female", "Other"]);
const requiredFields = [
  "name",
  "fatherName",
  "motherName",
  "email",
  "phone",
  "address",
  "pinCode",
  "bloodGroup",
  "gender"
];

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true, enum: [...bloodGroups] },
    gender: { type: String, required: true, enum: [...genders] }
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

app.use(cors());
app.use(express.json());

function validateRegistration(body) {
  const missingField = requiredFields.find(
    (field) => typeof body[field] !== "string" || body[field].trim() === ""
  );

  if (missingField) {
    return `${missingField} is required.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "Please provide a valid email address.";
  }

  if (!/^\d{10}$/.test(body.phone)) {
    return "Phone number must contain exactly 10 digits.";
  }

  if (!/^\d{6}$/.test(body.pinCode)) {
    return "PIN code must contain exactly 6 digits.";
  }

  if (!bloodGroups.has(body.bloodGroup)) {
    return "Please select a valid blood group.";
  }

  if (!genders.has(body.gender)) {
    return "Please select a valid gender.";
  }

  return null;
}

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "unavailable",
    database: databaseConnected ? "connected" : "disconnected"
  });
});

app.post("/api/register", async (req, res) => {
  const validationError = validateRegistration(req.body || {});

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const registration = await Registration.create(
      Object.fromEntries(requiredFields.map((field) => [field, req.body[field].trim()]))
    );

    return res.status(201).json({
      message: "Registration successful.",
      registration: { id: registration._id }
    });
  } catch (error) {
    console.error("Unable to save registration:", error);
    return res.status(500).json({ message: "Unable to save registration." });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }

  return next(error);
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    app.listen(port, () => {
      console.log(`Registration server running at http://localhost:${port}`);
      console.log("Connected to MongoDB.");
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
