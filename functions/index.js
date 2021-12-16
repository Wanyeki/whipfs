const functions = require("firebase-functions");
const express = require("express");
const app = express();
const admin = require("firebase-admin");

admin.initializeApp({
  name: functions.config().firebase,
});

app.use("/", require("./routes"));
exports.app = functions.https.onRequest(app);
