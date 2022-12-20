const mongoose = require('mongoose')
const colors = require('colors');

const connectDB = async () => {

    try {
        conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb Connected :  ${conn.connection.host}`.cyan.underline)
    }
    catch (error) {
        console.log(`Mongo Error : ${error.message}`.red.bold);
        process.exit();
    }

}

module.exports = connectDB;