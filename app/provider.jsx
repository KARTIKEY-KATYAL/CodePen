"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Codepen",
  description: "An AI-Based Code Generator.",
};

function Provider({ children }) {
  const [Messages, setMessages] = useState([]); // Initialize as an empty array
  const [User, setUser] = useState(null); // Initialize as null
  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);

const isAuthenticated = async () => {
  try {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.email) {
        console.log("User found in localStorage:", user);

        // Fetch user data from the database using Convex
        const result = await convex.query(api.users.GetUser, {
          email: user.email,
        });

        if (result) {
          setUser(result);
          console.log("User fetched from database:", result);
        } else {
          console.warn("No user found in the database for the given email.");
          setUser(null); // Clear user state if not found
        }
      } else {
        console.warn("No user data or email found in localStorage.");
      }
    }
  } catch (error) {
    console.error("Error during user authentication:", error);
  }
};


  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <UserDetailContext.Provider value={{ User, setUser }}>
        <MessagesContext.Provider value={{ Messages, setMessages }}>
          <NextThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </NextThemeProvider>
        </MessagesContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
