"use client"
import Lookup from "@/data/Lookup";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import React from 'react'
import { useState } from "react";


function Codeview() {
  const [activeState, setactiveState] = useState('code')
  const [files, setfiles] = useState(Lookup?.DEFAULT_FILE)
  return (
    <div>
      <div className="bg-[#181818] w-full p-2">
        <div className="flex flex-wrap shrink-0 w-[140px] items-center bg-black gap-3 px-2 py-1 justify-center rounded-full">
          <h2
            onClick={() => {
              setactiveState("code");
            }}
            className={`text-sm cursor-pointer ${activeState == "code" && "text-blue-50 bg-opacity-25 px-2 py-1 bg-blue-700 rounded-full font-bold"}`}
          >
            Code
          </h2>
          <h2
            onClick={() => {
              setactiveState("preview");
            }}
            className={`text-sm cursor-pointer ${activeState == "preview" && "text-blue-50 bg-opacity-25 px-2 py-1 bg-blue-700 rounded-full font-bold"}`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}>
        <SandpackLayout>
          {activeState == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview
                showNavigator={"true"}
                style={{ height: "80vh" }}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default Codeview
