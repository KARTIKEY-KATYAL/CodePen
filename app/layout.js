import "./globals.css";
import Provider from "./provider";
import Header from "@/components/custom/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "Codepen",
  description: "An AI Based Code Generator.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Header />
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
          >
            {children}
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
