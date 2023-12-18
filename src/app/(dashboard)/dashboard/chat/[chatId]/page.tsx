import { fetchRadis } from "@/app/herlpers/redis";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { messageArrayValidator } from "@/app/lib/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { FC } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRadis(
      "zrange",
      `chat:${chatId}:messeges`,
      0,
      -1 // from 0 to -1 means we are fetching without stopping
    ); // it is of type string not messeges, because it JSON string needs to parse

    const dbMessages = results.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();

    const messages = messageArrayValidator.parse(reversedDbMessages);

    return messages;
  } catch (error) {
    notFound();
  }
}

const page: FC<PageProps> = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--"); // url:chat/chatId1--chatId2  this those two users talking to each others

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1; // if my id is 1 so the partner id is 2, otherwise it is 1
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMesseges = await getChatMessages(chatId);

  return <div>{params.chatId}</div>;
};

export default page;
