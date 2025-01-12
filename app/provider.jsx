"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function Provider({ children }) {
  const [Messages, setMessages] = useState([]); // Initialize as an empty array
  const [User, setUser] = useState(null); // Initialize as null

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <UserDetailContext.Provider value={{ User, setUser }}>
        <MessageContext.Provider value={{ Messages, setMessages }}>
          <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemeProvider>
        </MessageContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
