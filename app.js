require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const userrouters = require("./routes/userrouters");
const measurementRoutes = require("./routes/measurementRoutes");
const { getUserDetails } = require("./controllers/userDetails");
const authMiddleware = require("./middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ extended: false }));



app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/userDetails", userrouters);


cloudinary.config({
  cloud_name: process.env.CLUODNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APIKEY_SECRET,
});

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/api/photos", upload.single("photo"), (req, res) => {
  const file = req.file.path;
  cloudinary.uploader.upload(
    file,
    {
      folder: "shopPhotos",
      transformation: { quality: "auto", fetch_format: "auto" },
    },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ uri: result.public_id.replace("shopPhotos/", "") });
      }
    }
  );
});

app.get("/api/photos/:public_id", (req, res) => {
  const public_id = req.params.public_id;
  const imageUrl = cloudinary.url(`shopPhotos/${public_id}`);
  res.redirect(imageUrl);
});

app.get("/api/userDetails/:id", authMiddleware, getUserDetails);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
