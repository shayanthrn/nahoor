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
const { ObjectID } = require('mongodb');
const { debugPort } = require('process');
const { Buffer } = require('buffer');
const { query, json } = require('express');
const fileUpload = require('express-fileupload');
const e = require('express');
const { setTimeout } = require('timers');
const { log } = require('console');



router.get("/",function(req,res){
  console.log("hi");
  res.end()
})



module.exports = router;