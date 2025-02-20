import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: PASSWORD,
});

const generateISBN = () => {
  const prefix = "978";
  let isbn = prefix;

  for (let i = 0; i < 9; i++) {
    isbn += faker.number.int({ min: 0, max: 9 }).toString();
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i]);
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  isbn += checkDigit;

  return isbn;
};

const generateFakeData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.words(3);
    const author = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const isbn = generateISBN();
    const pages = faker.number.int({ min: 100, max: 1000 });
    const rating = faker.number.int({ min: 1, max: 5 });
    data.push([title, author, isbn, pages, rating]);
  }
  return data;
};

const insertDataBatch = async (batchSize, totalRecords) => {
  const batchInsertQuery = `INSERT INTO books (title, author, isbn, numberOfPages, rating) VALUES ?`;
  let insertedRecords = 0;

  while (insertedRecords < totalRecords) {
    const dataBatch = generateFakeData(batchSize);
    try {
      await connection.query(batchInsertQuery, [dataBatch]);
      insertedRecords += batchSize;
      console.log(`${insertedRecords}/${totalRecords} records inserted`);
    } catch (err) {
      throw err;
    }
  }
};
const createDatabase = async () => {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`);
    await connection.query(`USE ${DATABASE}`);
    await connection.query(`
            CREATE TABLE IF NOT EXISTS books (
              id INT AUTO_INCREMENT PRIMARY KEY,
              title VARCHAR(255) NOT NULL,
              author VARCHAR(255) NOT NULL,
              isbn VARCHAR(20) UNIQUE NOT NULL,
              numberOfPages INT NOT NULL,
              rating INT NOT NULL
            )
          `);
    await connection.query(
      "CREATE INDEX idx_title_isbn ON books (title, isbn)"
    );
    console.log("Database created");
  } catch (err) {
    throw err;
  }
};
createDatabase()
  .then(() => {
    const totalRecords = 50; //10_000_000;
    const batchSize = 10; //10_000;
    insertDataBatch(batchSize, totalRecords)
      .then(() => {
        console.log("Seeding complete");
        connection.end();
      })
      .catch((err) => {
        console.error("Error seeding data:", err);
        connection.end();
      });
  })
  .catch((err) => {
    console.error("Error creating database:", err);
    connection.end();
  });
