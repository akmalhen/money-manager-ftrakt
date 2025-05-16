import mongoose from "mongoose";

let isConnected = false;
const defaultMongoUri = "mongodb://localhost:27017/fintrack"; // Fallback for development

export const connectToDB = async () => {

  if (typeof window !== 'undefined') {
    console.log("Client-side: No need to connect to MongoDB directly");
    return;
  }
  
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }
  
  const mongodbUri = process.env.MONGODB_URI || defaultMongoUri;
  
  if (!mongodbUri) {
    console.error("MONGODB_URI environment variable is not defined and fallback is not available");
    throw new Error("MongoDB connection string not available");
  }
  
  try {
    console.log("Connecting to MongoDB...");
    
    mongoose.set('strictQuery', true);
    
    let sanitizedUri = "mongodb://[hidden-credentials]";
    try {
      const uri = new URL(mongodbUri);
      if (uri.password) uri.password = "****";
      sanitizedUri = uri.toString();
    } catch (e) {

    }
    console.log("Using MongoDB URI:", sanitizedUri);
    

    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(mongodbUri, {
 
        });
        break; 
      } catch (error) {
        console.error(`MongoDB connection attempt failed. Retries left: ${retries - 1}`);
        if (retries === 1) throw error; 
        retries--;

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    isConnected = true;
    console.log("MongoDB connected successfully to:", mongoose.connection.name);
    
  
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log("Available collections:", collectionNames);
    } catch (err) {
      console.warn("Could not list collections:", err);
    }
    

    try {
      const collection = mongoose.connection.collection('userprogresses');

      const indices = await collection.indexInformation();
      
      if (!indices.user_1) {

        await collection.createIndex({ user: 1 }, { unique: true });
        console.log("Created unique index on user field in UserProgress collection");
      }
    } catch (indexError) {
      console.warn("Failed to create index:", indexError);

    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    isConnected = false;
    throw error; 
  }
};
