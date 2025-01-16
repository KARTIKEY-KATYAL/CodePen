import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkSpace = mutation({
  args: {
    messages: v.array(
      v.object({
        content: v.string(),
        role: v.string(),
      })
    ),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Inserting workspace with data:", args); // Debug log input data

      // Insert the workspace and capture the returned document ID
      const workspaceId = await ctx.db.insert("workspace", {
        messages: args.messages,
        user: args.user,
      });

      console.log("Inserted workspace object:", workspaceId); // Debug log result
      return workspaceId; // Return the document ID directly
    } catch (error) {
      console.error("Error in CreateWorkSpace mutation:", error);
      throw new Error("Workspace creation failed: " + error.message);
    }
  },
});


export const Getworkspaces = query({
  args: {
    workspaceId: v.id("workspace"),
  },

  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceId);
    return result;
  },
});