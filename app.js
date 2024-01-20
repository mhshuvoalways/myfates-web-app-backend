require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");

const userRouter = require("./routers/userRouter");
const reportRouter = require("./routers/fullReport/reportRouter");
const loveRouter = require("./routers/fullReport/loveRouter");
const financeRouter = require("./routers/fullReport/financeRouter");
const reportsRouter = require("./routers/reportsRouter");
const horoRouter = require("./routers/horoRouter");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/report", reportRouter);
app.use("/api/love", loveRouter);
app.use("/api/finance", financeRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/horo", horoRouter);

app.get("/api", (req, res) => {
  res.send("I am myfates api");
});

db(app);
