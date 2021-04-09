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
var Category = require("../Objects/Category.js")
var Manufacturer = require("../Objects/Manufacturer.js")
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
  var md5pass = "576e9415296265f2a0e96260cdbbbe11";
  if (pass == md5pass) {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Banners").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Banners").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Categories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Categories").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Manufacturers").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Manufacturers").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Orders").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Orders").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Products").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Products").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("SubCategories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("SubCategories").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("SubCategories").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("SubCategories").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Users").insertOne({ dummy: "dummy" }, function (err) {
        dbo.collection("Users").deleteMany({ dummy: "dummy" });
      });
      dbo.collection("Admin").insertOne({ user: "admin", password: "458d523af85e1779931973d13a1b3795", token: "" });
      console.log("db created!");
      res.end();
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


router.post("/addbanner", function (req, res) {
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
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var path = "/banners/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + path, function (err) {
            var bannerobj = new Banner(req.body.description, path);
            dbo.collection("Banners").insertOne(bannerobj, function (err) {
              res.redirect("/adminpanel/dashboard");
              res.end();
            })
          })
        }
      })
    })
  }
})



router.post("/addcategory", function (req, res) {
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
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var path = "/categories/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + path, function (err) {
            var category = new Category(req.body.name, path);
            dbo.collection("Categories").insertOne(category, function (err) {
              res.redirect("/adminpanel/categories/");
              res.end();
            })
          })
        }
      })
    })
  }
})


router.get("/addsubcategory",function(req,res){
  var query=url.parse(req.url,true).query;
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
          // var temp = req.files.image.name.split(".")
          // var format = temp[temp.length - 1]
          // var path = "/categories/" + new Date().getTime().toString() + "." + format;
          // mv(req.files.image.tempFilePath, "public" + path, function (err) {
          //   var category = new Category(req.body.name, path);
          //   dbo.collection("Categories").insertOne(category, function (err) {
          //     res.redirect("/adminpanel/categories/");
          //     res.end();
          //   })
          // })
          res.render("AdminPanel/addsubcategory.ejs",{parent:query.for});
          res.end();
        }
      })
    })
  }
})




router.post("/addmanufacturer", function (req, res) {
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
          if (typeof req.body.categories == "string") {
            req.body.categories = [req.body.categories]
          }
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var logo = "/logos/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + logo, function (err) {
            var manufacture = new Manufacturer(req.body.name,req.body.shortdescription, req.body.description, logo, req.body.address, req.body.phonenumber, req.body.email,req.body.website ,req.body.categories);
            dbo.collection("Manufacturers").insertOne(manufacture, function (err) {
              res.redirect("/adminpanel/manufacturers/" + manufacture._id);
              res.end();
            })
          })
        }
      })
    })
  }
})

router.post("/addimgvdo", function (req, res) {
  var query=url.parse(req.url,true).query;
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
          var id=ObjectID(query.for);
          var temp = req.files.image_video.name.split(".")
          var format = temp[temp.length - 1]
          var path = "/intros/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image_video.tempFilePath, "public" + path, function (err) {
            dbo.collection("Manufacturers").updateOne({_id:id},{$addToSet:{images:path}},function(err,result){
              res.redirect("/adminpanel/manufacturers/"+id);
            })
          })
        }
      })
    })
  }
})


router.get("/adminpanel/categories/", function (req, res) {
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({}, async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var categories = await dbo.collection("Categories").find({}).toArray();
          res.render("AdminPanel/categories.ejs", { categories: categories });
          res.end();
        }
      })
    })
  }
})

router.get("/adminpanel/manufacturers/", function (req, res) {
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({}, async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var manufacturers = await dbo.collection("Manufacturers").find({}).toArray();
          res.render("AdminPanel/manufacturers.ejs", { manufacturers: manufacturers });
          res.end();
        }
      })
    })
  }
})

router.get("/adminpanel/manufacturers/:id", function (req, res) {
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
          var id = ObjectID(req.params.id);
          dbo.collection("Manufacturers").findOne({ _id: id }, function (err, mfu) {
            res.render("AdminPanel/manufacturer-page.ejs", { mfu: mfu });
            res.end();
          })
        }
      })
    })
  }
})

router.get("/addproduct",function(req,res){
  console.log("hi");
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