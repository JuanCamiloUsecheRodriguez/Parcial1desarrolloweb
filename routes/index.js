var express = require('express');
var router = express.Router();
require('dotenv').config();

//Codigo copiado de la documentacion de mongo, sirve para conectarse a mongo #GraciasFaryd
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = process.env.MONGODB_URI;

// Database Name MODIFICAR
const dbName = process.env.DB_NAME;
// Collection Name MODIFICAR
const collectionName = 'objects';

//funcion para conseguir los datos
function getData(callback){
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    //cuidado!! la conexion podria cerrarse antes de terminar el llamado a la base de datos
    const db = client.db(dbName);
    //mini callback hell
    findDocuments(db, (data)=>{
      callback(data);
      client.close();
    });

  });
}


// Fin del codigo copiado 

//Funcion para encontrar todos los documentos de la DB
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection(collectionName);
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
};
//END 


/* GET home page. */
router.get('/', function(req, res, next) {
  //Ya no voy a renderizar el template del index
  // res.render('index', { title: 'Express' });
});

/**A partir de aqui voy a crear mis propios endpoints */
//getData ejemplo
router.get('/getData', function(req, res) {
  //Añadimos un header para indicar que lo que envio es de tipo json 
  res.setHeader('Content-Type', 'application/json');
  getData((data)=>
    res.send(data)
  );
});

module.exports = router;
