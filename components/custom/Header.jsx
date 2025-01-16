import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import colors from "@/data/Colors";
import Link from "next/link";
import { UserDetailContext } from "@/context/UserDetailContext";

function Header() {
  const { User } = useContext(UserDetailContext);

  return (
    <header className="flex justify-between items-center shadow-2xl p-4">
      {/* Logo and Title */}
      <Link
        href="#"
        className="hover:opacity-80 transition-opacity duration-300"
      >
        <div className="flex items-center">
          <Image
            src="/logo.gif" // Ensure logo.gif is in the "public" folder
            width={90}
            height={90}
            className="rounded-full"
            alt="Logo"
          />
          <span className="text-2xl text-white font-bold dancing-script flex items-center ml-2">
            CodePen
            <Image
              src="/pen.svg" // Ensure pen.svg is also in the "public" folder
              width={20}
              height={20}
              alt="Pen Icon"
              className="ml-1 invert"
            />
          </span>
        </div>
      </Link>

      {/* Action Buttons */}
      {!User?.name && (
        <div className="flex space-x-4">
          {/* Sign In Button */}
          <Button
            className="text-white hover:scale-105 transition-transform duration-300 font-bold"
            variant="ghost"
            aria-label="Sign In"
          >
            Sign In
          </Button>

          {/* Getting Started Button */}
          <Button
            className="cursor-pointer hover:scale-105 transition-transform duration-300 font-bold"
            style={{
              backgroundColor: colors.BLUE,
              color: "white", // Ensure text color contrasts with the background
            }}
            aria-label="Get Started"
          >
            Getting Started
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
