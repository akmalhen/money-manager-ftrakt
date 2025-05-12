import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

type AuthConfig = {
  providers: any[];
  callbacks: {
    jwt: (params: { token: any; user: any }) => Promise<any>;
    session: (params: { session: any; token: any }) => Promise<any>;
  };
  pages: {
    signIn: string;
  };
  session: {
    strategy: "jwt";
  };
};

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // This is a simplified auth setup for the quiz feature
        // In a real app, you would validate credentials against your database
        
        // For now, we'll just return a mock user to make the quiz feature work
        return {
          id: "user-1",
          name: "Demo User",
          email: "user@example.com",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

// This is needed for NextAuth.js type augmentation
declare module "next-auth" {
  interface User {
    id: string;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
