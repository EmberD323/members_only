#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS users,messages;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT,
  last_name TEXT,
  username VARCHAR(150),
  password VARCHAR(150),
  membership_status TEXT,
  admin_status TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT,
  time VARCHAR(250),
  text TEXT,
  userid INTEGER,
    CONSTRAINT userid_fk FOREIGN KEY (userid) REFERENCES users(id)
);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  console.log("seeding...1");
  await client.connect();
  console.log("seeding...2");
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
