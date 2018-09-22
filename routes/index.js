var express = require('express');
var router = express.Router();
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URI;

const dbName = process.env.DB_NAME;

const collectionName = 'rates';


function getData(callback){
  
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");   
    const db = client.db(dbName);
    findDocuments(db, (data)=>{
      callback(data);
      db.createUser(
        {
          user: "admin",
          pwd: "password",
          roles: [ { role: "root", db: "admin" } ]
        }
      );
      client.close();
    });

  });
}

const findDocuments = function(db, callback) {

  const collection = db.collection(collectionName);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
};



router.get('/', function(req, res, next) {

});


router.get('/getData', function(req, res) {
  //Añadimos un header para indicar que lo que envio es de tipo json 
  res.setHeader('Content-Type', 'application/json');
  getData((data)=>
    res.send(data)
  );
});

module.exports = router;
