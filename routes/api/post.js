var router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// Connection URL
const url = process.env.MONGODB_URI;
// Database Name MODIFICAR
const dbName = process.env.DB_NAME;
// Collection Name MODIFICAR
const collectionName = 'rates';

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
  });

router.post('/api/post', (req, res, next) => {
  const { body } = req;
  const {
    name
  } = body;
  let {
    rate
  } = body;
  console.log('Please');
  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  MongoClient.connect(url, function (err,db) {
    if(err) throw err;
    const dbo = db.db(dbName);
    dbo.collection('rates').insertOne({"name": name, "rate": rate}, function(err,res){
      if (err) throw err;
      console.log('1 document inserted');
      db.close();
    });
  });

});

module.exports = router;

