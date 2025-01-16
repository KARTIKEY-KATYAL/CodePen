"use client"; // Enables client-side rendering for this layout

import { ConvexProvider, ConvexReactClient } from "convex/react";
import "./globals.css"; // Global CSS styles
import Provider from "./provider"; // Your custom Provider (ensure it’s properly set up)
import Header from "@/components/custom/Header"; // Header component
import { GoogleOAuthProvider } from "@react-oauth/google"; // Google OAuth provider

// Initialize Convex client
const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Wrapping all children with GoogleOAuth and Convex context */}
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
        >
          <ConvexProvider client={convexClient}>
            <Provider>
              {/* Static Header and dynamic children */}
              <Header />
              {children}
            </Provider>
          </ConvexProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
