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

// Insert single document
const sampleGrade = {
  _id: new ObjectId("67e93e5fc0bbf2aed3b71242"),
  student_id: 546790,
  scores: [
    { type: "quiz", score: 60 },
    { type: "homework", score: 90 },
  ],
  class_id: 551,
  last_updated: new Date(),
};

// Insert multiple documents
const sampleGrades = [
  {
    student_id: 546791,
    scores: [
      { type: "quiz", score: 70 },
      { type: "homework", score: 80 },
      { type: "homework", score: 60 },
    ],
    class_id: 555,
    last_updated: new Date(),
  },
  {
    student_id: 546792,
    scores: [
      { type: "quiz", score: 70 },
      { type: "quiz", score: 60 },
      { type: "homework", score: 80 },
    ],
    class_id: 555,
    last_updated: new Date(),
  },
];

// Find documents
const documentsToFind = {
  class_id: { $gt: 551 },
};

// Find single document
const documentToFind = {
  _id: new ObjectId("67e93e5fc0bbf2aed3b71238"),
};

// Update single document
const documentToUpdate = {
  _id: new ObjectId("67e94022c0bbf2aed3b7123b"),
};
const updateOneUpdate = { $inc: { "products.1.score": 2 } };

// Update multiple documents
const documentsToUpdate = {
  class_id: 550,
};
const updateManyUpdate = {
  $push: {
    products: {
      type: "extra",
      score: 20,
    },
  },
};

// Delete single document
const documentToDelete = {
  _id: new ObjectId("67e93e5fc0bbf2aed3b71242"),
};

// Delete multiple documents
const documentsToDelete = {
  class_id: 555,
};

// Create transaction
// Starts the client session
const session = client.startSession();

// Aggregate pipeline $match and $group
const pipelineMatchGroup = [
  {
    $match: {
      class_id: 550,
    },
  },
  {
    $group: {
      _id: "$student_id",
      total_height: { $sum: "$height" },
      avg_height: { $avg: "$height" },
    },
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

    // Find documents
    let findResult = gradesCollection.find(documentsToFind);
    let findDocCount = gradesCollection.countDocuments(documentsToFind);
    await findResult.forEach((doc) => console.log(doc));
    console.log(`Found ${await findDocCount} documents`);

    // Find single document
    let findOneResult = await gradesCollection.findOne(documentToFind);
    console.log(findOneResult);
    console.log("Found one document");

    // Update single document
    let updateOneResult = await gradesCollection.updateOne(
      documentToUpdate,
      updateOneUpdate
    );
    updateOneResult.modifiedCount === 1
      ? console.log("Updated one document")
      : console.log("No documents updated");

    // Update multiple documents
    let updateManyResult = await gradesCollection.updateMany(
      documentsToUpdate,
      updateManyUpdate
    );
    updateManyResult.modifiedCount > 0
      ? console.log(`Updated ${updateManyResult.modifiedCount} document`)
      : console.log("No documents updated");

    // Delete single document
    let deleteOneResult = await gradesCollection.deleteOne(documentToDelete);
    deleteOneResult.deletedCount === 1
      ? console.log("Deleted one document")
      : console.log("No documents deleted");

    // Delete multiple documents
    let deleteManyResult = await gradesCollection.deleteMany(documentsToDelete);
    deleteManyResult.deletedCount > 0
      ? console.log(`Deleted ${deleteManyResult.deletedCount} documents`)
      : console.log("No documents deleted");

    // Create transaction
    try {
      const transactionResults = await session.withTransaction(async () => {
        // Insert single document
        let insertOneResult = await gradesCollection.insertOne(sampleGrade, {
          session,
        });
        console.log(
          `Transaction: Inserted document: ${insertOneResult.insertedId}`
        );

        // Insert multiple documents
        let insertManyResult = await gradesCollection.insertMany(sampleGrades, {
          session,
        });
        console.log(
          `Transaction: Inserted ${insertManyResult.insertedCount} documents`
        );
        console.log(insertManyResult);

        // Delete single document
        let deleteOneResult = await gradesCollection.deleteOne(
          documentToDelete,
          { session }
        );
        deleteOneResult.deletedCount === 1
          ? console.log("Transaction: Deleted one document")
          : console.log("Transaction: No documents deleted");

        // Delete multiple documents
        let deleteManyResult = await gradesCollection.deleteMany(
          documentsToDelete,
          { session }
        );
        deleteManyResult.deletedCount > 0
          ? console.log(
              `Transaction: Deleted ${deleteManyResult.deletedCount} documents`
            )
          : console.log("Transaction: No documents deleted");

        return true;
      });

      // Committing transaction
      console.log("Committing transaction...");
      console.log(transactionResults);

      if (transactionResults) {
        console.log("The reservation was successfully created.");
      } else {
        console.log("The transaction was intentionally aborted.");
      }
    } catch (err) {
      console.error(`Transaction aborted: ${err}`);
      process.exit(1);
    } finally {
      await session.endSession();
    }

    // Aggregate pipeline $match and $group
    let aggregateMatchGroupResult = await gradesCollection.aggregate(
      pipelineMatchGroup
    );
    for await (const doc of aggregateMatchGroupResult) {
      console.log(doc);
    }
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();
