# Set up project

- Firstly to initialize the project, create a floder (ex. FLOW.AI) and enter into that folder
  and run npm init -y to initialize the project all the package.json files and required environment to build backend code will be set-up.

- Then install required npm packages to write the code like (sqlite, sqlite3, express, cors, path, uuid, nodemon etc..) whichever is necessary by running the command (npm install <package_Name> --save) all dependencies are present in the package.json file.

- create a Database file (finance.db) which will consists of a tables i.e transactions, categories.

- create a server.js file which will contains the entire backend code.. To run the file when any changes or modifies occur in the file, Open the terminal and type (node server.js or nodemon server.js)

- server.http file contains the test requests code to the API.

# API ENDPOINTS are

- `POST /transactions`: Adds a new transaction (income or expense).
- `GET /transactions`: Retrieves all transactions.
- `GET /transactions/:id`: Retrieves a transaction by ID.
- `PUT /transactions/:id`: Updates a transaction by ID.
- `DELETE /transactions/:id`: Deletes a transaction by ID.
- `GET /summary`: Retrieves a summary of transactions, such as total income, total expenses, and balance.

# Personal Finance API

A RESTful API for managing personal financial records. Users can record their income and expenses, retrieve past transactions, and get summaries by category or time period.

## Features

- **Manage Transactions**: Add, update, delete, and retrieve transactions.
- **Categories**: Define categories for income and expenses.
- **Summary**: Get total income, total expenses, and balance.

## Technologies

- **Backend Framework**: Node.js with Express.js
- **Database**: SQLite

## Database Schema

# Create the Categories and Transactions Table:

```sql

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
);


`` sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    category_id INTEGER,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```
