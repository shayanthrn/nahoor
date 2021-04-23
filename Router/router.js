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
var SubCategory = require("../Objects/SubCategory.js")
var Product = require("../Objects/Product.js");
var User = require("../Objects/User.js");
var Order =require("../Objects/Order.js")
const { ObjectID } = require('mongodb');
const { debugPort } = require('process');
const { Buffer } = require('buffer');
const { query, json } = require('express');
const fileUpload = require('express-fileupload');
const e = require('express');
const { setTimeout } = require('timers');
const { log } = require('console');


//----------------------------API----------------------------

router.get("/api/getbanners",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      banners=await dbo.collection("Banners").find({}).toArray();
      res.json({"response":banners});
      res.end()
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getcategories",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      categories=await dbo.collection("Categories").find({}).toArray();
      res.json({"response":categories});
      res.end()
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getsubcategories",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      categories=await dbo.collection("SubCategories").find({}).toArray();
      res.json({"response":categories});
      res.end()
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getsubcategoriesbycategory",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      subcategories=await dbo.collection("SubCategories").find({parentname:query.category}).toArray();
      res.json({"response":subcategories})
      res.end()
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})



router.get("/api/gettopfactories",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      factories=await dbo.collection("Manufacturers").find({}).toArray()
      sortbyrate(factories);
      res.json({"response":factories.slice(0,5)});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getfactoriesbycategory",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      factories=await dbo.collection("Manufacturers").find({categories:query.category}).toArray();
      res.json({"response":factories});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getbannersofsubcategory",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      category=await dbo.collection("SubCategories").findOne({name:query.category});
      res.json({"response":category.banners});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getfactory",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var id=ObjectID(query.id)
      factory=await dbo.collection("Manufacturers").findOne({_id:id});
      res.json({"response":factory});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getfactoryproducts",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      products=await dbo.collection("Products").find({manufacturer:query.id}).toArray();
      res.json({"response":products});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getfactoryproductsbycategory",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      products=await dbo.collection("Products").find({manufacturer:query.id,category:query.category}).toArray();
      res.json({"response":products});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getproduct",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var id=ObjectID(query.id)
      product=await dbo.collection("Products").findOne({_id:id});
      res.json({"response":product});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.post("/api/signupuser",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var user=new User(req.body.name,req.body.password,req.body.phonenumber,req.body.address);
      dbo.collection("Users").insertOne(user);
      res.json({"response":"ok"});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/login",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      dbo.collection("Users").findOne({phonenumber:req.body.phonenumber},function(err,user){
        if(user==null){
          res.json({"response":"not found"});
        }
        else{
          if(user.password==req.body.password){
            res.json({"response":user._id});
          }
          else{
            res.json({"response":"wrong pass"});
          }
        }
        res.end();
      })
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getuserinfo",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var id=ObjectID(query.id)
      dbo.collection("Users").findOne({_id:id},function(err,user){
        res.json({"response":user});
        res.end();
      })
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})


router.post("/api/submitorder",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var order=new Order(req.body.phonenumber,req.body.listofproducts,req.body.totalcost,req.body.manufacturer);
      dbo.collection("Orders").insertOne(order);
      res.json({"response":"ok"});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.get("/api/getorders",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      orders=await dbo.collection("Orders").find({userphonenumber:query.phonenumber}).toArray()
      res.json({"response":orders});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

router.post("/api/editinfo",function(req,res){
  var query=url.parse(req.url,true).query;
  var secret = new Date().getDate();
  secret=md5(secret.toString())
  if(query.secret==secret){
    MongoClient.connect(dburl,async function(err,db){
      var dbo=db.db("nahoor");
      var id=ObjectID(req.body.id);
      dbo.collection("Users").updateOne({_id:id},{$set:{name:req.body.name,phonenumber:req.body.phonenumber,address:req.body.address,password:req.body.password}});
      res.json({"response":"ok"});
      res.end();
    })
  }
  else{
    res.json({"response":"noaccess"});
    res.end();
  }
})

//----------------------------END API----------------------------


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
          res.render("AdminPanel/addsubcategory.ejs",{parent:query.for});
          res.end();
        }
      })
    })
  }
})

router.post("/addsubcategory",function(req,res){
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
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var path = "/subcategories/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + path, function (err) {
            var subcategory=new SubCategory(req.body.name,req.body.parent,path);
            dbo.collection("SubCategories").insertOne(subcategory, function (err) {
              res.redirect("/adminpanel/subcategories/addimg/"+subcategory._id);
              res.end();
            })
          })
        }
      })
    })
  }
})

router.get("/adminpanel/subcategories/addimg/:id",function(req,res){
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(req.params.id);
          subcat=await dbo.collection("SubCategories").findOne({_id:id})
          res.render("AdminPanel/subcategory_addbaner.ejs",{id:req.params.id,banners:subcat.banners})
          res.end();
        }
      })
    })
  }
})


router.post("/addimgsubcategory",function(req,res){
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
          var id=ObjectID(req.body.id)
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var path = "/subcategories/banners/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + path, function (err) {
            dbo.collection("SubCategories").updateOne({_id:id},{$addToSet:{banners:path}},function(err,result){
              res.redirect("/adminpanel/subcategories/addimg/"+id);
            })
          })
        }
      })
    })
  }
})


router.get("/addproduct",function(req,res){
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
          res.render("AdminPanel/addproduct.ejs",{category:query.cat,id:query.for});
          res.end();
        }
      })
    })
  }
})


router.post("/addproduct",function(req,res){
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
          var temp = req.files.image.name.split(".")
          var format = temp[temp.length - 1]
          var logo = "/products/" + new Date().getTime().toString() + "." + format;
          mv(req.files.image.tempFilePath, "public" + logo, function (err) {
            var features=[]
            if(typeof req.body.features == "string"){
              features=[req.body.features];
            }
            else{
              features=req.body.features;
            }
            var product= new Product(req.body.name,req.body.priceT,req.body.priceA,query.category,req.body.weight,req.body.countperbox,query.for,req.body.features_title,features,logo);
            dbo.collection("Products").insertOne(product,function(err,result){
              res.redirect("/adminpanel/manufacturers/"+query.for);
            })
          })
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
          dbo.collection("Manufacturers").findOne({ _id: id },async function (err, mfu) {
            var subcats = await dbo.collection("SubCategories").find().toArray()
            res.render("AdminPanel/manufacturer-page.ejs", { mfu: mfu,subcats:subcats });
            res.end();
          })
        }
      })
    })
  }
})


router.post("/setrate",function(req,res){
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
          dbo.collection("Manufacturers").updateOne({_id:id},{$set:{rate:Number(req.body.rate)}},function(err,result){
            res.redirect("/adminpanel/manufacturers/"+id);
          })
        }
      })
    })
  }
})

function sortbyrate(objects){
  for(let i=0;i<objects.length;i++){
    for(let j=0;j<i;j++){
      if(objects[i].rate>=objects[j].rate){
        var b = objects[i];
        objects[i] = objects[j];
        objects[j] = b;
      }
    }
  }
}

router.post("/addmftosubcat",function(req,res){
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
          dbo.collection("Manufacturers").updateOne({_id:id},{$addToSet:{categories:req.body.category}},function(err,result){
            res.redirect("/adminpanel/manufacturers/"+id);
          })
        }
      })
    })
  }
})



router.get("/adminpanel/banners",function(req,res){
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          banners= await dbo.collection("Banners").find({}).toArray()
          res.render("AdminPanel/banners.ejs",{banners:banners});
          res.end();
        }
      })
    })
  }
})

router.get("/removebanner",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("Banners").findOneAndDelete({_id:id},function(err,banner){
            fs.unlink("public"+banner.value.image, function (err) {
              res.redirect("/adminpanel/banners");
              db.close();
            })
          })
        }
      })
    })
  }
})


router.get("/removecategory",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          dbo.collection("Categories").findOneAndDelete({name:query.for},function(err,cat){
            dbo.collection("SubCategories").deleteMany({parentname:cat.value.name});
            fs.unlink("public"+cat.value.image, function (err) {
              res.redirect("/adminpanel/categories");
              db.close();
            })
          })
        }
      })
    })
  }
})

router.get("/subcategories",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          subcategories=await dbo.collection("SubCategories").find({parentname:query.for}).toArray()
          res.render("AdminPanel/subcategories.ejs",{categories:subcategories,parent:query.for});
          res.end();
        }
      })
    })
  }
})

router.get("/removesubcategorybanner",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("SubCategories").updateOne({_id:id},{$pull:{banners:query.name}});
          fs.unlink("public/"+query.name,function(err){
            res.redirect("/adminpanel/subcategories/addimg/"+id)
          })
        }
      })
    })
  }
})

router.get("/removesubcategory",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          dbo.collection("SubCategories").findOneAndDelete({name:query.for},function(err,subcat){
            for(let i=0;i<subcat.value.banners.length;i++){
              fs.unlink("public/"+subcat.value.banners[i],function(err){
                console.log("hi");
              })
            }
            res.redirect("/adminpanel/categories")
          })          
        }
      })
    })
  }
})


router.get("/intros",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("Manufacturers").findOne({_id:id},function(err,mfu){
            intros=mfu.images;
            res.render("AdminPanel/intros.ejs",{intros:intros,id:mfu._id});
            res.end();
          })   
        }
      })
    })
  }
})


router.get("/removeintro",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("Manufacturers").updateOne({_id:id},{$pull:{images:query.name}});
          fs.unlink("public/"+query.name,function(err){
            res.redirect("/intros?id="+id)
          })
        }
      })
    })
  }
})


router.get("/products",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          products=await dbo.collection("Products").find({manufacturer:query.id}).toArray()  
          res.render("AdminPanel/products.ejs");
          res.end(); 
        }
      })
    })
  }
})

router.get("/removeproduct",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("Products").findOneAndDelete({_id:id},function(err,pd){
            product=pd.value;
            fs.unlink("public"+product.image,function(err){
              res.redirect("/products/?id="+product.manufacturer)
            })
          });
        }
      })
    })
  }
})



router.get("/removemanufacturer",function(req,res){
  var query=url.parse(req.url,true).query;
  if (req.cookies.admintoken == undefined) {
    res.redirect("noaccess")
  }
  else {
    MongoClient.connect(dburl, function (err, db) {
      var dbo = db.db("nahoor");
      dbo.collection("Admin").findOne({},async function (err, admin) {
        if (admin.token != req.cookies.admintoken) {
          res.redirect("noaccess");
          db.close();
        }
        else {
          var id=ObjectID(query.id);
          dbo.collection("Manufacturers").findOneAndDelete({_id:id},function(err,mfu){
            mf=mfu.value;
            fs.unlink("public"+mf.logo,function(err){
              for(let i =0 ; i<mf.images.length;i++){
                fs.unlink("public"+mf.images[i],function(err){
                  console.log("hi");
                })
              }
            })
            res.redirect("/adminpanel/manufacturers")
          });
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