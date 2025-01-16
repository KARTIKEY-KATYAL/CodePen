"use client";
import Chatview from "@/components/custom/Chatview";
import Codeview from "@/components/custom/Codeview";
import React from "react";


function workspace() {

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-6">
        <div className="col-span-2">
          <Chatview />
        </div>
        <div className="col-span-4">
          <Codeview />
        </div>
      </div>
    </div>
  );
}

export default workspace;
