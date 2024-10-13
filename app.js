import {connect} from "mongoose";
import {config} from "dotenv";
import cors from "cors";
import express , {json} from "express";
import cookieParser from "cookie-parser";
import GodownRoutes from "./routes/godowns.js"
import itemsRoutes from "./routes/items.js";
import AuthRoutes from "./routes/auth.js";
const app = express();
config();
const corsOrigin ={
  origin: 'https://tree-view-app-backend.onrender.com',
  credentials:true,
  optionSuccessStatus:200
}
app.use(json());
app.use(cookieParser());
app.use(cors(corsOrigin));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const uri = process.env.MONGO_URI;
connect(uri)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log("Error in connecting to MongoDB");
  console.log(err);
});
app.get("/", (req, res) => { res.status(200).send("Welcome to the godown management system"); });

app.use("/user", AuthRoutes);

app.use("/godowns", GodownRoutes);

app.use("/items", itemsRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
      success: false,
      statusCode,
      message
  });
});
