require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoute = require('./routes/authRoute');
const bookRoute = require('./routes/bookRoute');
const aiRoute = require('./routes/aiRoute');
const exportRoute = require('./routes/exportRoute');

const app = express();

//middleware to handle cors
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Connect to the database
connectDB();

//middleware
app.use(express.json());

//static folder for uploads
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

//routes
app.use('/api/auth', authRoute);
app.use('/api/books', bookRoute);
app.use('/api/ai', aiRoute);
app.use('/api/export', exportRoute);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 