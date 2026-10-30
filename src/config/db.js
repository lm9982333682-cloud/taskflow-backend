import mongoose from "mongoose";
import config from './config.js';


const dbConnection = async (req, res) => {
    try {

        const res = await mongoose.connect(config.DBURL);
        console.log("mongodb connected successfully", res.connection.host)

    } catch (err) {
        console.log('mongodb connted error:-', err)
    }
};

export default dbConnection