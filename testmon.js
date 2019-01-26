var MongoClient = require('mongodb').MongoClient,assert = require('assert');

MongoClient.connect('mongodb://test:123test@ds263619.mlab.com:63619/todo', function(err, db) {

assert.equal(err, null);
console.log("Successfully connected to MongoDB.");

db.collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
    console.log("done");

  });
  db.collection("users").createIndex({username:"text"});
  db.collection("users").find({ $text :{ $search : "mishra"}}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
