require("dotenv").config();

module.exports =
    uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@myatlasclusteredu.pzi4jw2.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU`;
