"use client"
import Lookup from "@/data/Lookup";
import { ArrowRight, LinkIcon } from "lucide-react";
import Link from "next/link";
import React, { useContext } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import { useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
    const [userInput, setuserInput] = useState();
    const { Messages, setMessages } = useContext(MessagesContext);
    const {User,setUser} = useContext(UserDetailContext);
    const [openDialog, setopenDialog] = useState(false)
    const CreateWorkspace = useMutation(api.workspace.CreateWorkSpace)
    const router = useRouter()

  const onGenerate = async (input) => {
    if (!User?.name) {
      setopenDialog(true);
      return;
    }

    const msg = {
      role: "user",
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, msg]);

    console.log(input);

    // Wrap the msg in an array when passing to the mutation
    const WorkspaceId = await CreateWorkspace({
      user: User._id,
      messages: [msg], // Send messages as an array of objects
    });

    router.push("/workspace/" + WorkspaceId);
  };


  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-4 px-4">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium text-center">
        {Lookup.HERO_DESC}
      </p>

      {/* Input Area */}
      <div className="relative mt-4 w-full max-w-2xl">
        {/* Textarea */}
        <textarea
            onChange={(e)=>setuserInput(e.target.value)}
          placeholder={Lookup.INPUT_PLACEHOLDER}
          className="max-w-2xl w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={7}
        />

        {/* Arrow Button */}
        {userInput && <button
          className="absolute top-2 right-2 bg-blue-700 p-2 flex items-center justify-center rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Submit"
        >
          <ArrowRight className="text-white" onClick={()=>onGenerate(userInput)} />
        </button>}

        {/* Link Icon */}
        <div className="absolute bottom-2 left-2 flex items-center">
          <Link
            href="#"
            className="flex items-center"
          >
            <LinkIcon className="h-5 w-5 mr-1" />
            
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup?.SUGGSTIONS.map((suggestion,index)=>(
           <h2 
           key={index}
           onClick={()=>onGenerate(suggestion)}
           className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
           >{suggestion}</h2>
        ))}
      </div>
      <SignInDialog openDialog={openDialog} closeDialog={(v)=>setopenDialog(false)}/>
    </div>
  );
}

export default Hero;
