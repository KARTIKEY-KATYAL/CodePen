import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  }),

  workspace: defineTable({
    messages: v.array(
      v.object({
        content: v.string(), // Each message must have a content field of type string
        role: v.string(), // Each message must have a role field of type string
      })
    ),
    fileData: v.optional(v.any()), // Optional field for file data
    user: v.id("users"), // References an ID from the users table
  }),
});
