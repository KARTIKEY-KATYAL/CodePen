"use client";

import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function SignInDialog({ openDialog, closeDialog }) {
  const { User, setUser } = useContext(UserDetailContext);

  // Google Login Function
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`, // Fix: Added a space after "Bearer"
            },
          }
        );

        // Set user details in the context
        setUser(userInfo?.data);

        // Close the dialog after successful login
        closeDialog(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    },
    onError: (errorResponse) =>
      console.error("Google Login Error:", errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white">
            {Lookup.SIGNIN_HEADING || "Sign In"}
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col items-center justify-center gap-3">
              {/* Subheading */}
              <p className="mt-2 text-center text-lg text-gray-600">
                {Lookup.SIGNIN_SUBHEADING || "Access your account with ease"}
              </p>

              {/* Sign In Button */}
              <Button
                className="bg-blue-800 mt-3 text-white font-bold hover:bg-blue-500 text-center items-center"
                onClick={googleLogin}
              >
                Sign In With Google
              </Button>

              {/* Agreement Text */}
              <p className="mt-2 text-sm text-center text-gray-500">
                {Lookup.SIGNIn_AGREEMENT_TEXT ||
                  "By signing in, you agree to our Terms and Privacy Policy."}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
