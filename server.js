require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const connectTODB = require("./database/db");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/image");
const app = express();
// Middlewares
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadRoutes);

app.listen(PORT, async () => {
  await connectTODB();
  console.log(`Serever is running on port ${PORT}`);
});
