import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts';

// interface UserSchema {
//   username: string;
//   password: string;
// }

// interface Conversation {
//   members: string;
//   removedFor?: string;
// }

// interface Message {
//   _id: ObjectId;
//   conversationId: ObjectId;
//   senderId: ObjectId;
//   msg: string;
//   removedFor?: ObjectId[];
//   createdAt: Date;
// }

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  fullname: z.string({
    required_error: 'Fullname is required.',
  }),
  username: z.string({
    required_error: 'Enail is required.',
  }),
  password: z.string(),
});

export const ConversationStarterSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
});

export const MessageSchema = z.object({
  msg: z.string(),
});
