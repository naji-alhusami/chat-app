import FriendRequests from "@/app/components/FriendRequests";
import { fetchRadis } from "@/app/herlpers/redis";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const incomingServerIds = (await fetchRadis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingServerIds.map(async (senderId) => {
      const sender = (await fetchRadis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;
