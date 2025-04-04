const { MongoClient, ObjectId, Collection } = require("mongodb");
const uri = require("./atlas_uri");

console.log(uri);

const client = new MongoClient(uri);
const dbname = "training";
const collection_name = "grades";

const gradesCollection = client.db(dbname).collection(collection_name);

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
};

const sampleGrade = {
  // _id: new ObjectId("67e93e5fc0bbf2aed3b71242"),
  student_id: 546790,
  scores: [
    { type: "quiz", score: 60 },
    { type: "homework", score: 90 },
  ],
  class_id: 551,
  last_updated: new Date(),
};

const sampleGrades = [
  {
    student_id: 546791,
    scores: [
      { type: "quiz", score: 70 },
      { type: "homework", score: 80 },
      { type: "homework", score: 60 },
    ],
    class_id: 552,
    last_updated: new Date(),
  },
  {
    student_id: 546792,
    scores: [
      { type: "quiz", score: 70 },
      { type: "quiz", score: 60 },
      { type: "homework", score: 80 },
    ],
    class_id: 553,
    last_updated: new Date(),
  },
];

const main = async () => {
  try {
    // Connect to Atlas Cluster
    await connectToDatabase();

    // List database names
    await listDatabases(client);

    // Insert single document
    let insertOneResult = await gradesCollection.insertOne(sampleGrade);
    console.log(`Inserted document: ${insertOneResult.insertedId}`);

    // Insert multiple documents
    let insertManyResult = await gradesCollection.insertMany(sampleGrades);
    console.log(`Inserted ${insertManyResult.insertedCount} documents`);
    console.log(insertManyResult);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();
