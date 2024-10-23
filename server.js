const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const { get } = require("http");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const dbPath = path.join(__dirname, "finance.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// add transaction

app.post("/transactions", async (request, response) => {
  const { type, description, category, amount } = request.body;
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const { v4: uuidv4 } = uuid;
  let id = uuidv4();

  const addQueryCategories = `INSERT INTO categories(id, type, name)
  VALUES(
  '${id}',
  '${type}',
  '${category}'
  );
  `;

  const addQuery = `
  INSERT INTO transactions(type, amount, date, description , category_id)
  VALUES(
  '${type}',
  ${amount},
  '${date}',
  '${description}',
  '${id}'

  );
  `;

  const dbResponse = await db.run(addQuery);
  const dbCategoryResponse = await db.run(addQueryCategories);
  response.send(dbResponse);
  console.log("Transaction added Sucessfully");
});

// all transactions
app.get("/transactions", async (request, response) => {
  const getQuery = `SELECT * FROM transactions;`;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
  console.log("All transactions");
});

//transaction by id
app.get("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  const getQuery = `SELECT * FROM transactions where id = '${id}';`;

  const dbResponse = await db.get(getQuery);
  response.send(dbResponse);
  console.log("Transaction by ID");
});

//all categories
app.get("/categories", async (request, response) => {
  const getQuery = `SELECT * FROM categories;`;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
  console.log("All categories");
});

//update transaction

app.put("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  const { type, description, category, amount } = request.body;
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const updateQuery = `
    UPDATE transactions
    SET 
      type = '${type}',
      amount = ${amount},
      description = '${description}',
      date = '${date}'
    WHERE id = '${id}';  
  `;

  const updatedResponse = await db.run(updateQuery);
  response.send(updatedResponse);
  console.log("Updated Successfully");
});

//Delete transaction

app.delete("/transactions/:id", async (request, response) => {
  const { id } = request.params;
  const deleteQuery = `DELETE FROM transactions WHERE id = '${id}';`;
  const dbResponse = await db.run(deleteQuery);
  response.send(dbResponse);
  console.log("Deleted Successfuly");
});

//get Summary

app.get("/summary", async (request, response) => {
  const getSummaryQUery = `
  SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses
    FROM transactions
    ;
  `;

  const dbResponse = await db.get(getSummaryQUery);
  response.send(dbResponse);
  console.log("Overall Summary");
});

initializeDBAndServer();
