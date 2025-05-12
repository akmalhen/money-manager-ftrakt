# Environment Setup Guide

## Required Environment Variables

Create or update your `.env.local` file in the root of your project with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://yourusername:yourpassword@your-cluster.mongodb.net/fintrack?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-long
NEXTAUTH_URL=http://localhost:3000
```

Replace the placeholder values with your actual MongoDB connection string and a secure random string for NextAuth.

## Getting a MongoDB Connection String

1. Sign up or log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use an existing one)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string and replace `<username>` and `<password>` with your database user credentials

## Setting Up NextAuth Secret

Generate a secure random string (at least 32 characters) using a tool like:

```bash
openssl rand -base64 32
```

or by using an online secure key generator.

## After Setup

After setting up these environment variables, restart your development server:

```bash
npm run dev
```

## Testing

Once properly configured, you should be able to:

1. Register/login
2. Create tasks without errors
3. View and manage your tasks
