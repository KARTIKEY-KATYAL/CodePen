"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import Link from "next/link"; // Ensure this import is added
// import { ArrowRight, LinkIcon } from "@heroicons/react/solid"; // Ensure these imports are correct
import { ArrowRight ,LinkIcon } from "lucide-react";

function Chatview() {
  const { id } = useParams(); // Workspace ID from URL params
  const convex = useConvex();
  const { Messages, setMessages } = useContext(MessagesContext);
  const { User } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");

  // Fetch workspace data when `id` changes
  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  // Function to fetch workspace data
  const GetWorkspaceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await convex.query(api.workspace.Getworkspaces, {
        workspaceId: id,
      });

      setMessages(result?.messages || []); // Ensure Messages is always an array
      console.log("Workspace Data:", result);
    } catch (err) {
      setError("Failed to load workspace data. Please try again later.");
      console.error("Error fetching workspace data:", err);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    console.log("User input submitted:", input);
    // Add logic to handle message generation/sending
  };

  const inputPlaceholder = "Type your message...";

  return (
    <main className="bg-slate-800 w-3/4 p-4 min-h-screen rounded-md relative">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-white">Loading messages...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mb-4">{error}</div>
      ) : (
        <div>
          {Messages?.length > 0 ? (
            Messages.map((msg, index) => (
              <div
                key={index}
                className="flex items-start bg-slate-900 p-4 rounded-lg shadow-md space-x-4 mb-4"
              >
                {msg.role === "user" && (
                  <Image
                    src={User?.picture || "/default-user.png"}
                    alt="UserImage"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <p className="font-semibold text-lg text-yellow-400">
                    {msg.content}
                  </p>
                  <p className="text-sm text-gray-500">{msg.role}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages to display</p>
          )}

          {/* Textarea with Icons */}
          <div className="relative mt-4 max-w-2xl">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              rows={7}
            />

            {/* Link Icon */}
            <Link
              href="#"
              className="absolute bottom-2 left-2 text-blue-400 hover:text-blue-500"
            >
              <LinkIcon className="h-5 w-5" />
            </Link>

            {/* Arrow Icon */}
            {userInput && (
              <button
                onClick={() => onGenerate(userInput)}
                className="absolute bottom-2 right-2 bg-blue-700 p-2 flex items-center justify-center rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Submit"
              >
                <ArrowRight className="text-white h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Chatview;
