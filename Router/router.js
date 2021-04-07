const express = require('express');
const router = express.Router();
const fs = require('fs');
const url = require('url');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cookieParser = require('cookie-parser');
var formidable = require("formidable");
var mv = require('mv');
const TokenGenerator = require('uuid-token-generator');
const tokgen = new TokenGenerator();
var dburl = "mongodb://localhost:27017/";          //url of database            auth o doros kon 
var lodash = require('lodash');
var persianDate = require('persian-date');
var request = require('request');
var md5 = require('md5');
var Banner = require("../Objects/Banner.js")
const { ObjectID } = require('mongodb');
const { debugPort } = require('process');
const { Buffer } = require('buffer');
const { query, json } = require('express');
const fileUpload = require('express-fileupload');
const e = require('express');
const { setTimeout } = require('timers');
const { log } = require('console');



router.post("/createDataBase", function (req, res) {
  if (req.body.password == undefined) {
    req.body.password = "dummy";
  }
  let pass = md5(req.body.password).toString();
  md5pass = "576e9415296265f2a0e96260cdbbbe11";
  if (pass == md5pass) {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Banners").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Banners").deleteMany({});
      });
      dbo.collection("Categories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Categories").deleteMany({});
      });
      dbo.collection("Manufacturers").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Manufacturers").deleteMany({});
      });
      dbo.collection("Orders").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Orders").deleteMany({});
      });
      dbo.collection("Products").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Products").deleteMany({});
      });
      dbo.collection("SubCategories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("SubCategories").deleteMany({});
      });
      dbo.collection("SubCategories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("SubCategories").deleteMany({});
      });
      dbo.collection("Users").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Users").deleteMany({});
      });
      dbo.collection("Admin").insertOne({ user: "admin", password: "458d523af85e1779931973d13a1b3795", token: "" });
      console.log("db created!");
      res.end();
      db.close();
    })
  }
  else {
    console.log("wrong password");
    res.end();
  }
})

router.get("/adminlogin", function (req, res) {
  res.render("loginadmin.ejs", { wrongflag: 0 });
  res.end();
})

router.post("/adminlogin", function (req, res) {
  var pass = "dummy"
  if (req.body.pass != undefined) {
    pass = req.body.pass;
  }
  MongoClient.connect(dburl, function (err, db) {
    var dbo = db.db("nahoor");
    dbo.collection("Admin").findOne({}, function (err, admin) {
      if (admin.user != req.body.username || admin.password != md5(pass).toString()) {
        res.render("loginadmin.ejs", { wrongflag: 1 });
        res.end();
        db.close();
      }
      else {
        var mytoken;
        mytoken = tokgen.generate();
        dbo.collection("Admin").updateOne({}, { $set: { token: mytoken } });
        res.cookie('admintoken', mytoken);
        res.redirect("/adminpanel/dashboard");
        db.close()
      }
    })
  })
})

router.get("/adminpanel/dashboard", function (req, res) {
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({}, function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          res.render("AdminPanel/dashboard.ejs");
          res.end();
        }
      })
    })
  }
})


router.get('/exit', function (req, res) {
  req.session.prevurl = req.session.currurl;
  req.session.currurl = req.url;
  MongoClient.connect(dburl, function (err, db) {
    var dbo = db.db("mydb");
    res.clearCookie('usertoken');
    res.clearCookie('doctortoken');
    res.clearCookie('admintoken');
    res.clearCookie('HCtoken');
    db.close();
    res.redirect("/adminlogin");
    res.end();
  })
})


router.get('*', function (req, res) {
  req.session.prevurl = req.session.currurl;
  req.session.currurl = req.url;
  res.redirect("/adminlogin");
  res.statusCode = 404;
  res.end();
});

router.post('*', function (req, res) {
  req.session.prevurl = req.session.currurl;
  req.session.currurl = req.url;
  res.redirect("/adminlogin");
  res.statusCode = 404;
  res.end();
});


module.exports = router;