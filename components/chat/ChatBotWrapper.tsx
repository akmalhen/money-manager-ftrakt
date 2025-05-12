'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

// Dynamically import the ChatBot component to avoid server-side rendering issues
const ChatBot = dynamic(() => import('./ChatBot'), { ssr: false });

const ChatBotWrapper = () => {
  const { data: session, status } = useSession();

  // Only show the ChatBot if the user is authenticated
  if (status !== 'authenticated' || !session) {
    return null;
  }

  return <ChatBot />;
};

export default ChatBotWrapper;
