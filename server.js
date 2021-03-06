var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var url = require('url');
var querystring = require('querystring');
var ObjectID = mongodb.ObjectID;


var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");



  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/trucks"
 *    GET: finds all trucks
 *    POST: creates a new truck
 */

app.get("/trucks", function(req, res) {

  var urlString = {
    pathname: url.parse(req.url).pathname,
    queryparam: querystring.parse(url.parse(req.url).query)
  };

  console.log(urlString);

  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    console.log(docs);
    if (err) {
      handleError(res, err.message, "Failed to get trucks.");
    }else if (urlString.queryparam.callback && urlString.queryparam.callback != '?') {
      json = urlString.queryparam.callback + "(" + JSON.stringify(docs) + ");";
      res.writeHead(200, {'content-type':'application/json',
        'content-length':json.length});
      res.end(json);
    }
     else {
      console.log('serving trucks');
      res.status(200).json(docs);
    }
  });
});

app.post("/trucks", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.name)) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new truck.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.delete("/alltrucks", function(req, res) {
  db.collection(CONTACTS_COLLECTION).remove({});
});

/*
//var foodTrucks10 = [
  {
    "name": "Mammoth Meats",
    "description": "Grass fed cows cooked up caveman style.",
    "tags": [
      "steak",
      "burgers",
      "ostrich",
      "buffalo",
      "great",
      "yummy"
    ],
    "menuOfferings": [
      "Burger",
      "Salad",
      "Sticks"
    ],
    "img": "images/burger.png",
    "locTime": []
  },
  {
    "name": "The Big Cuban",
    "description": "Authentic Cuban sandwiches now that the embargo is lifted.!",
    "tags": [
      "sandwich",
      "ham",
      "great",
      "traditional"
    ],
    "menuOfferings": [
      "Cuban Sandwich",
      "Fries"
    ],
    "img": "images/bagels.png",
    "locTime": []
  },
  {
    "name": "The Icee Codfish",
    "description": "Frozen fishsticks deep fried",
    "tags": [
      "fishsticks",
      "snow cones",
      "waffle cones",
      "fishy"
    ],
    "menuOfferings": [
      "Fish Sticks",
      "Gelato"
    ],
    "img": "images/seafood.png",
    "locTime": []
  },
  {
    "name": "Tail of the Whale",
    "description": "Sushi from a food truck - awesome!",
    "tags": [
      "octopus",
      "sashimi",
      "miso",
      "delicious",
      "expensive"
    ],
    "menuOfferings": [
      "Sushi",
      "Sashimi",
      "Soup"
    ],
    "img": "images/sushi.png",
    "locTime": []
  },
  {
    "name": "Cicada Poppers",
    "description": "Awesome crunch",
    "tags": [
      "bugs",
      "crickets",
      "fried",
      "slugs",
      "cicadas",
      "cheap"
    ],
    "menuOfferings": [
      "Roll",
      "Stir Fry"
    ],
    "img": "images/chinese.png",
    "locTime": []
  },
  {
    "name": "The Sailor's Cup",
    "description": "Premium coffee from around the world",
    "tags": [
      "arabica",
      "columbian",
      "fresh",
      "roasted"
    ],
    "menuOfferings": [
      "Pastry",
      "Flavored Coffee"
    ],
    "img": "images/coffee.png",
    "locTime": []
  },
  {
    "name": "The Hole Enchilada",
    "description": "Mexican Donuts",
    "tags": [
      "glazed",
      "chili",
      "donut ham hamburger",
      "taco donut",
      "great"
    ],
    "menuOfferings": [
      "Donut",
      "Donut Holes",
      "Eclair",
      "Enchilada"
    ],
    "img": "images/taco.png",
    "locTime": []
  },
  {
    "name": "Guido's Hut",
    "description": "artisan pizza",
    "tags": [
      "sausage",
      "grilled onions",
      "grilled peppers",
      "bbq",
      "steak"
    ],
    "menuOfferings": [
      "Pizza",
      "Antipasta"
    ],
    "img": "images/pizza.png",
    "locTime": []
  },
  {
    "name": "Overdone",
    "description": "Outrageously ostentatious cupcakes",
    "tags": [
      "birthday",
      "special occasions",
      "fresh",
      "sprinkles"
    ],
    "menuOfferings": [
      "Cupcake",
      "Mini CupCakes"
    ],
    "img": "images/cupcake.png",
    "locTime": []
  },
  {
    "name": "The Potato Pup",
    "description": "Hotdogs topped with crunchy potato chips",
    "tags": [
      "sauerkraut",
      "new york",
      "chicago",
      "onions",
      "mustard"
    ],
    "menuOfferings": [
      "Hot Dog",
      "Fries"
    ],
    "img": "images/hotdog.png",
    "locTime": []
  }
];

var foodTrucks1 = foodTrucks10.slice(0,1);
var foodTrucks5 = foodTrucks10.slice(0,5);
*/