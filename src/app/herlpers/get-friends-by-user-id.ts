import { fetchRadis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  // retrieve friends for current user
  const friendIds = (await fetchRadis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];

  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRadis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    })
  );

  return friends;
};
