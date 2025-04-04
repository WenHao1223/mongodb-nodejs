const { MongoClient } = require('mongodb');
const uri = require("./atlas_uri");

console.log(uri);

const client = new MongoClient(uri);
const dbname = "training";

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
};

const listDatabases = async (client) => {
  databasesList = await client.db().admin().listDatabases();

  // List in table
  console.table(databasesList.databases);

  // List only the names
  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const main = async () => {
  try {
    await connectToDatabase();

    await listDatabases(client);

    await client.close();
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
}

main();