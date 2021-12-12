var express = require("express");
var router = express.Router();
var moment = require("moment");
const users = require("../models/users");

/* Add User. */
router.put("/addUser", async (req, res) => {
  await users
    .findOne({ user_name: req.body.username.toUpperCase() })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "User already exists",
        });
      } else {
        const saveUser = new users({
          user_name: req.body.username.toUpperCase(),
        });
        saveUser
          .save()
          .then((result) => {
            res.status(200).json({
              message: "User Added Successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Some Error Occured",
              error: error,
            });
          });
      }
    });
});

/* GET users listing. */
router.get("/getUser", async (req, res) => {
  await users
    .findOne({ user_name: req.query.username.toUpperCase() })
    .then((result) => {
      if (result) {
        res.status(200).json({
          result: {
            user_name: result.user_name,
            created_at: moment(result.created_at).format("YYYY-MM-DD HH:mm:ss"),
          },
        });
      } else {
        res.status(204).json({
          message: "No record found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Some Error Occured",
        error: error,
      });
    });
});

module.exports = router;
