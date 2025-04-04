require("dotenv").config();

module.exports =
    uri = `mongodb+srv://myAtlasDBUser:${process.env.MONGODB_PASSWORD}@myatlasclusteredu.pzi4jw2.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU`;
