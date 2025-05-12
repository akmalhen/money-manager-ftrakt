import mongoose from "mongoose";

let isConnected = false;
const defaultMongoUri = "mongodb://localhost:27017/fintrack"; // Fallback for development

export const connectToDB = async () => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    console.log("Client-side: No need to connect to MongoDB directly");
    return;
  }
  
  // Check if already connected
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }
  
  // Get MongoDB URI from env or use fallback
  const mongodbUri = process.env.MONGODB_URI || defaultMongoUri;
  
  if (!mongodbUri) {
    console.error("MONGODB_URI environment variable is not defined and fallback is not available");
    throw new Error("MongoDB connection string not available");
  }
  
  try {
    console.log("Connecting to MongoDB...");
    
    // Configure mongoose settings
    mongoose.set('strictQuery', true);
    
    // Sanitize URI for logging (hide password)
    let sanitizedUri = "mongodb://[hidden-credentials]";
    try {
      const uri = new URL(mongodbUri);
      if (uri.password) uri.password = "****";
      sanitizedUri = uri.toString();
    } catch (e) {
      // Invalid URI format, use default sanitized string
    }
    console.log("Using MongoDB URI:", sanitizedUri);
    
    // Connect with retries
    let retries = 3;
    while (retries > 0) {
      try {
        await mongoose.connect(mongodbUri, {
          // Optional connection settings if needed
        });
        break; // Connection successful, exit loop
      } catch (error) {
        console.error(`MongoDB connection attempt failed. Retries left: ${retries - 1}`);
        if (retries === 1) throw error; // Last retry, rethrow
        retries--;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    isConnected = true;
    console.log("MongoDB connected successfully to:", mongoose.connection.name);
    
    // List available collections
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log("Available collections:", collectionNames);
    } catch (err) {
      console.warn("Could not list collections:", err);
    }
    
    // Ensure UserProgress has a unique index on the user field
    // This only needs to be done once when the connection is established
    try {
      const collection = mongoose.connection.collection('userprogresses');
      
      // Check if the index already exists
      const indices = await collection.indexInformation();
      
      if (!indices.user_1) {
        // Create a unique index on the user field if it doesn't exist
        await collection.createIndex({ user: 1 }, { unique: true });
        console.log("Created unique index on user field in UserProgress collection");
      }
    } catch (indexError) {
      console.warn("Failed to create index:", indexError);
      // Don't throw error as this is not critical for operation
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Reset connection flag to allow future retry attempts
    isConnected = false;
    throw error; // Re-throw to allow proper error handling
  }
};
