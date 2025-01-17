"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LinkIcon, LoaderIcon } from "lucide-react";
import axios from "axios";
import { useMutation } from "convex/react";
import Prompt from "@/data/Prompt";
import { useRouter } from "next/navigation";
import Colors from "@/data/Colors";
import ReactMarkdown from "react-markdown";

function Chatview() {
  const { id } = useParams(); // Workspace ID from URL params
  const convex = useConvex();
  const { Messages, setMessages } = useContext(MessagesContext);
  const { User } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const router = useRouter();
  const updateMessage = useMutation(api.workspace.UpdateMessages);

  const onGenerate = async (input) => {
    const msg = {
      role: "user",
      content: input,
    };

    // Add user message to state
    setMessages((prevMessages) => [...prevMessages, msg]);

    // Optionally call an API to create a workspace here (e.g., CreateWorkspace mutation)
  };

  // Fetch workspace data when id changes
  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);

  useEffect(() => {
    // Check if the last message was from the user, and generate AI response
    if (Messages?.length > 0 && Messages[Messages.length - 1].role === "user") {
      GenerateAIresponse();
    }
  }, [Messages]);

  const GenerateAIresponse = async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(Messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      const airesp = { role: "ai", content: result.data.result };

      // Add AI response to the state
      setMessages((prev) => [...prev, airesp]);

      // Update the workspace messages with the AI response
      await updateMessage({
        workspaceId: id, // Correct parameter name
        messages: [...Messages, airesp], // Correct structure
      });
    } catch (err) {
      setError("Failed to generate AI response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetWorkspaceData = async () => {
    try {
      setLoading(true);
      if (!id) {
        setError("Workspace ID is missing.");
        return;
      }

      const result = await convex.query(api.workspace.Getworkspaces, {
        workspaceId: id,
      });
      setMessages(result?.messages || []); // Set messages from workspace data
    } catch (err) {
      setError("Failed to load workspace data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="w-3/4 h-[80vh] p-6 rounded-md flex flex-col"
      style={{ backgroundColor: Colors.BACKGROUND }}
    >
      {loading && (
        <div className="flex justify-center items-center flex-grow">
          <LoaderIcon className="animate-spin h-8 w-8 text-white" />
          <p className="text-lg text-white">Loading messages...</p>
        </div>
      )}

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      <div className="flex-1 scrollbar-hide overflow-y-auto pr-2 mb-4 space-y-4">
        {Messages?.length > 0 ? (
          Messages.map((msg, index) => (
            <div
              key={index}
              className="flex items-start p-4 rounded-lg shadow-md space-x-4"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              {msg.role === "user" && (
                <Image
                  src={User?.picture || "/default-user.png"}
                  alt="UserImage"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <ReactMarkdown className="flex flex-col">
                  {msg.content}
                </ReactMarkdown>
                <p className="text-sm text-gray-500">{msg.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages to display</p>
        )}
      </div>

      <div className="relative mt-4">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 bg-slate-700 text-white"
          rows={4}
        />

        <Link
          href="#"
          className="absolute bottom-3 left-3 text-blue-400 hover:text-blue-500 transition duration-200"
        >
          <LinkIcon className="h-5 w-5" />
        </Link>

        <button
          onClick={() => onGenerate(userInput)}
          className="absolute bottom-3 right-3 p-3 rounded-full flex items-center justify-center bg-blue-700 hover:bg-blue-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Submit"
          disabled={!userInput.trim()} // Prevent empty submission
        >
          <ArrowRight className="text-white h-5 w-5" />
        </button>
      </div>

      {openDialog && (
        <div className="dialog-container">
          <p>Please complete your profile to continue.</p>
        </div>
      )}
    </main>
  );
}

export default Chatview;
