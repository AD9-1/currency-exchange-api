require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const jsonKey = process.env.jsonKey;

function authorize(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(400).json({ message: "No Token Provided" });
  } else {
    jwt.verify(token, jsonKey, (err, decoded) => {
      if (err) return res.status(403).json("Token validation failed");
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
}
router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await knex("registerUser");
      res.status(200).json(users);
    } catch (error) {
      res.status(403).json({ message: "Error retrieving the users" });
      console.log(error);
    }
  })
  .post(async (req, res) => {
    if (
      !req.body.name ||
      req.body == "" ||
      req.body.email == "" ||
      req.body.password == "" ||
      req.body.dob == "" ||
      req.body.name == ""
    ) {
      return res.status(403).json({
        message:
          "Please enter the name,email-id , password and date of birth properly",
      });
    }
    try {
      const newUserId = await knex("registerUser").insert(req.body);
      const newUser = await knex("registerUser").where({ id: newUserId[0] });
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(400).json({ message: "Email address is in use" });
    }
  });

router.post("/loginUser", async (req, res) => {
  if (!req.body || req.body.email == "" || req.body.password == "") {
    return res.status(400).json("Please enter the email and password");
  }
  try {
    const getSingleUser = await knex("registerUser").where({
      email: req.body.email,
      password: req.body.password,
    });
    if (getSingleUser.length == 0) {
      return res.status(403).json({ message: "Please Register First" });
    } else {
      console.log(getSingleUser[0].id);
      const token = jwt.sign({ dob: getSingleUser[0].dob }, jsonKey);
      return res.status(200).json({
        token: token,
        message: `You are logged in and able to send money ${getSingleUser[0]}`,
        userId: getSingleUser[0].id,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to Find the user in database" });
  }
});

router.post("/sendMoney/:userId", authorize, async (req, res) => {
  if (
    !req.body.sendMoney ||
    req.body.sendMoney == "" ||
    req.params.userId === "" ||
    !req.body.sendCurrency ||
    req.body.sendCurrency == ""
  ) {
    return res.status(400).json("Please enter the proper details");
  }
  try {
    const getSingleUser = await knex("registerUser")
      .update({
        send_money: req.body.sendMoney,
        currency: req.body.sendCurrency,
      })
      .where({ id: req.params.userId });

    if (getSingleUser == 0) {
      return res.status(400).json("Unable to find the user in the database");
    } else {
      const getName = await knex("registerUser").select("name").where({
        id: req.params.userId,
      });
      console.log(getName);
      const newEntry = {
        userId: req.params.userId,
        name: getName[0].name,
        send_money: req.body.sendMoney,
        currency: req.body.sendCurrency,
      };
      const userInfoNewId = await knex("userInfo").insert(newEntry);
      const newUserInfo = await knex("userInfo").where({
        id: userInfoNewId[0],
      });
      return res
        .status(200)
        .json({ userId: userInfoNewId[0], username: getName[0].name });
    }
  } catch (error) {
    return res.status(403).json({ message: `${error}` });
  }
});

router.get("/userInfo/:userId", async (req, res) => {
  if (!req.params.userId || req.params.userId == "")
    res.status(403).json("Please Enter the proper details");
  else {
    try {
      const getData = await knex("userInfo").where({
        userId: req.params.userId,
      });
      if (getData.length == 0)
        res.status(400).json({
          message: `userId ${req.params.userId} has not made any transaction`,
        });
      else {
        res.status(200).json(getData);
      }
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
});
module.exports = router;
