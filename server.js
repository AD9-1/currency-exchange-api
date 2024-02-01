require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors())
const userRoute=require("./routes/userRoute")
app.use("/registerUsers",userRoute)


app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });
  