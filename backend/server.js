import dotenv from "dotenv";
import connectDB from "./DataBase/index.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
      console.log(`Visit: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed  ", err.message);
    process.exit(1);
  });

