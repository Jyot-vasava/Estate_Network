import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./DataBase/index.js"

dotenv.config();

app.get("/", (req, res) => {
  res.send("API is working...");
});

connectDB()
  .then(() => {
    console.log("Connected to the database successfully");

    app.on("error", (err) => {
      console.error("Server error:", err);
      throw err;
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });

    app.get("/test", (req, res) => {
      res.json({ message: "Test route working ✅" });
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
