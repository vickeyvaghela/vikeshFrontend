// Build a RESTful API with Node.js and Express.js
// Description:You are required to build a RESTful API for a simple task management system using Node.js and Express.js. The API should allow users to perform CRUD (Create, Read, Update, Delete) operations on tasks.
// Requirements:
// Create a Node.js project with Express.js to serve as the backend for the task management system.
// Implement routes for the following CRUD operations:
// Create a new task
// Retrieve all tasks
// Retrieve a single task by ID
// Update a task by ID
// Delete a task by ID
// Use a simple in-memory data store (e.g., an array) to store tasks.
// Implement input validation and error handling for each route.
// Ensure that the API responses follow RESTful conventions and return appropriate HTTP status codes.
// Include appropriate documentation (e.g., using Swagger/OpenAPI) for the API endpoints.

const express = require("express");
const cors = require("cors");


const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const uri = "mongodb+srv://vickeyvaghela82:AsrJwq4i4UvPpFuF@cluster0.ejbe4df.mongodb.net/";
// const uri = "mongodb+srv://vickeyvaghela82:srJwq4i4UvPpFuF@cluster0.ejbe4df.mongodb.net/";
// const uri = "mongodb+srv://vikesh_1_20:srJwq4i4UvPpFuF@cluster0.ejbe4df.mongodb.net/";
const client = new MongoClient(uri);

var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors({ origin: "*" }));

const port = 3001;


app.get("/getContactList", async (req, res) => {


  const database = client.db("sample_mflix");
  const contactsColl = database.collection("contacts");


  const contacts = await contactsColl.find().toArray();
  console.log('contacts', contacts);

  res.json(contacts);
});


app.delete("/deleteContact/:_id", async (req, res) => {


  const database = client.db("sample_mflix");
  const contactsColl = database.collection("contacts");


  try {
    let _id = new ObjectId(req.params._id)


    let deleteResp = await contactsColl.deleteOne({ _id });

    //const contacts = await contactsColl.find().toArray();
    // console.log('contacts',contacts);


    if (deleteResp?.deletedCount) {
      res.json({ ...deleteResp, statusCode: 200 });
    } else {
      res.json({ ...deleteResp, statusCode: 401 });
    }

    // res.json(deleteResp);
  } catch (error) {
    res.json({ error, statusCode: 500 });
  }


});

app.get("/getUserData/:_id", async (req, res) => {


  const database = client.db("sample_mflix");
  const contactsColl = database.collection("contacts");

  try {
    let _id = new ObjectId(req.params._id)


    let userData = await contactsColl.findOne({ _id });

    res.json({ ...userData, statusCode: 401 });

    // res.json(deleteResp);
  } catch (error) {
    res.json({ error, statusCode: 500 });
  }
});



app.post("/addContactList", async (req, res) => {

  let data = req.body
  const database = client.db("sample_mflix");
  const contactsColl = database.collection("contacts");

  let orQuery = {
    "$or": [
      { "email": data.email },
      {
        "phone": data.phone
      }]
  }

  const contacts = await contactsColl.find(orQuery).toArray();

  let emailError = undefined
  let phoneError = undefined
  let statusCode = 200

  if (contacts?.[0]) {
    if (contacts?.[0].email) {
      if (contacts?.[0].email === data.email) {
        emailError = "Email already exists"
        statusCode = 401
      }
      if (contacts?.[0].phone === data.phone) {
        phoneError = "Phone already exists"
        statusCode = 401
      }
    }
  }


  if (statusCode === 200) {
    let insertResp = await contactsColl.insertOne(data)
    if (insertResp && insertResp.insertedId) {
      statusCode = 200
    } else {
      statusCode = 401
    }
    console.log('insertResp', insertResp);
  }

  let respData = { emailError, phoneError, statusCode }

  res.json(respData);
});


app.put("/updateContact/:_id", async (req, res) => {

  let data = req.body
  const database = client.db("sample_mflix");
  const contactsColl = database.collection("contacts");
  let _id = new ObjectId(req.params._id)


  let orQuery = {
    "$or": [
      { "email": data.email },
      { "phone": data.phone
    }]
  }

  let fullQuery = {
    "$and": [
      orQuery,
      { "_id": {$ne: _id} }
    ]
  }

  const contacts = await contactsColl.find(fullQuery).toArray();

  let emailError = undefined
  let phoneError = undefined
  let statusCode = 200

  if (contacts?.[0]) {
    if (contacts?.[0].email) {
      if (contacts?.[0].email === data.email) {
        emailError = "Email already exists"
        statusCode = 401
      }
      if (contacts?.[0].phone === data.phone) {
        phoneError = "Phone already exists"
        statusCode = 401
      }
    }
  }

  let respData;
  if (statusCode === 200) {
    
    let insertResp = await contactsColl.updateOne({ _id }, { $set: data })

    respData = { emailError, phoneError, statusCode, insertResp }
  } else {
    respData = { emailError, phoneError, statusCode }

  }
  res.json(respData);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
