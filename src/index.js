import app from "./app.js";
import connectDb from "./db/index.js"
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
connectDb().then(()=>{
    app.listen(process.env.PORT || 3000 ,()=>{
        console.log("Server is running on the"+process.env.PORT);
        
    })
}).catch(()=>{
    console.log("Mongo Db connection is failed");
}
    
    

)