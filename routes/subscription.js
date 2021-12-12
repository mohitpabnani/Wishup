var express = require("express");
var router = express.Router();
var moment = require("moment");
const subscription = require("../models/subscription");
const users = require("../models/users");
const subscriptionPlan = require("../models/subscription_plans");

/* Add Subsription. */
router.post("/addSubscription", async (req, res) => {
  const userData = await users.find({
    user_name: req.body.username.toUpperCase(),
  });
  if (userData.length > 0) {
    const subscriptionPlans = await subscriptionPlan.find({
      plan_id: req.body.planId,
    });
    // Add 10 years for infinite subscription.
    const endDate =
      subscriptionPlans[0].validity === "Infinite"
        ? moment(req.body.startDate).add(10, "years")
        : moment(req.body.startDate).add(subscriptionPlans[0].validity, "days");
    const addSubscription = new subscription({
      user_name: req.body.username.toUpperCase(),
      plan_id: req.body.planId,
      start_date: req.body.startDate,
      valid_till: endDate,
    });
    await addSubscription
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Subscription Added Successfully",
          result: {
            amount: -subscriptionPlans[0].cost,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Some Error Occured",
          error: error,
        });
      });
  } else {
    res.status(401).json({
      message: "User does not exists",
    });
  }
});

/* GET Subscription. */
router.get("/getSubscription", async (req, res) => {
  let query;
  if (req.query.inputDate === null || req.query.inputDate === undefined) {
    query = { user_name: req.query.username.toUpperCase() };
    await subscription
      .find(query, { plan_id: 1, start_date: 1, valid_till: 1 })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            result: result,
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
  } else {
    query = {
      user_name: req.query.username.toUpperCase(),
      $and: [
        {
          start_date: {
            $lte: new Date(req.query.inputDate),
          },
        },
        {
          valid_till: {
            $gte: new Date(req.query.inputDate),
          },
        },
      ],
    };
    await subscription
      .find(query, { plan_id: 1, start_date: 1, valid_till: 1 })
      .then((result) => {
        if (result.length > 0) {
          const outputArray = [];
          result.map((element) => {
            const obj = {
              plan_id: element.plan_id,
              days_left:
                element.plan_id === "FREE"
                  ? "Infinite"
                  : moment(element.valid_till).diff(
                      moment(req.query.inputDate),
                      "days"
                    ),
            };
            outputArray.push(obj);
          });
          res.status(200).json({
            result: outputArray,
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
  }
});

module.exports = router;
