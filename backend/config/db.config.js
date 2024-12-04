import mongoose from "mongoose";

export default async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successfully')
    }
    catch(err){
        console.log('Error in connecting DB')
    }
}