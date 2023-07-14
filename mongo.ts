import {
  MongoClient,
  ObjectId,
} from 'https://deno.land/x/mongo@v0.31.2/mod.ts';

const client = new MongoClient();

await client.connect(
  'mongodb+srv://test:test@freecluster.hbw3o.mongodb.net/denoland?authMechanism=SCRAM-SHA-1'
);

interface UserSchema {
  _id: ObjectId;
  username: string;
  password: string;
}

interface Conversation {
  _id: ObjectId;
  members: ObjectId[];
  removedFor?: ObjectId[];
}

interface Message {
  _id: ObjectId;
  conversationId: ObjectId;
  senderId: ObjectId;
  msg: string;
  removedFor?: ObjectId[];
  createdAt: Date;
}

const db = client.database('denoland');
const users = db.collection<UserSchema>('users');
const conversations = db.collection<Conversation>('conversation');
const messages = db.collection<Message>('message');

export const CreateUser = async (user: UserSchema): Promise<ObjectId> => {
  const insertId = await users.insertOne(user);
  return insertId;
};

export const FindUser = async ({
  username,
  password,
}: UserSchema): Promise<ObjectId> => {
  const user = await users.findOne({ username });
  if (!user) {
    throw Error('User not found.');
  }
  if (user?.password != password) {
    throw Error('Incorrect password.');
  }
  return user._id;
};

export const GetAllUsers = () => {
  return users.find();
};

export const GetAllConversation = async () => {
  const convs = await conversations.findOne();

  const members = await users
    .find({
      _id: { $in: convs!.members.map((item) => new ObjectId(item)) },
    })
    .toArray();
  return { ...convs, members };
};

export const FindOrCreateConversation = async ({
  senderId,
  receiverId,
}: {
  senderId: ObjectId;
  receiverId: ObjectId;
}): Promise<Conversation> => {
  const members = [senderId, receiverId];

  const convo = await conversations.findOne({
    members,
  });

  if (!convo) {
    const _id = await conversations.insertOne({
      members,
      removedFor: [receiverId],
    });
    return { _id, members };
  }

  return convo;
};

export const CreateMessage = async () => {
  const messageId = await messages.insertOne({
    conversationId: new ObjectId(''),
    msg: 'adsfasdfasdf',
    removedFor: [],
    senderId: new ObjectId(''),
    createdAt: new Date(),
  });

  return messageId;
};
