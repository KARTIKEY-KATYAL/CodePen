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
import { useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid"; // Correct import for UUID
import { api } from "@/convex/_generated/api";

function SignInDialog({ openDialog, closeDialog }) {
  const { setUser } = useContext(UserDetailContext); // User is not being used directly

  const CreateUser = useMutation(api.users.CreateUser); // Convex mutation to create a user

  // Google Login Function
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`, // Ensure proper header formatting
            },
          }
        );

        const user = userInfo.data;

        // Save user in Convex
        const newUser = {
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uid: uuidv4(),
        };

        await CreateUser(newUser);

        // Set user details in context
        setUser(newUser);

        // Save user details in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(newUser));
        }

        // Close the dialog after successful login
        closeDialog(false);
      } catch (error) {
        console.error("Failed to fetch or save user information:", error);
        alert("An error occurred while signing in. Please try again.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      alert("Google Login failed. Please try again.");
    },
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
