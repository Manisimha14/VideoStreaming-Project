import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDb= async ()=>{
    try {
        const connectionInstance = await mongoose.connect(
          process.env.MONGODB_URL,{dbName:DB_NAME}
        );
        console.log(`MongoDb connected Successfully host ${connectionInstance.connection.host}`);
        

        
    } catch (error) {
        console.log(`Error in connection of Db ${error}`);
        process.exit(1)
        
    }
}
export default connectDb