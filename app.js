require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const measurementRoutes = require("./routes/measurementRoutes");
const Customer = require("./models/Customer");
const { getUserDetails } = require("./controllers/userDetails");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Connect to Database
connectDB();

// Routes
app.get("/api/customers/search", async (req, res) => {
  const { search } = req.query;

  try {
    // Check if search term can be converted to a number
    const searchNumber = parseInt(search, 10);
    if (isNaN(searchNumber)) {
      // Handle non-numeric search (e.g., search by name)
      const query = new RegExp(search, "i");
      const customers = await Customer.find({ name: query });
      return res.json(customers);
    }

    // If numeric, search by customer_id or phone_number
    const customers = await Customer.find({
      $or: [{ customer_id: searchNumber }, { phone_number: searchNumber }],
    });
    res.json(customers);
  } catch (err) {
    res.status(404).json({ err: "Customers not found" });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);



// File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/photos", upload.single("photo"), (req, res) => {
  const file = req.file;
  const uri = `/api/photos/${file.filename}`;
  res.json({ file, uri });
});

app.get("/api/photos/:filename", (req, res) => {
  const file = req.params.filename;
  const filePath = path.join(__dirname, "public/uploads", file);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ err: "No file exists" });
    }
    res.sendFile(filePath);
  });
});

app.get('/api/userDetails/:id', authMiddleware, getUserDetails);

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
