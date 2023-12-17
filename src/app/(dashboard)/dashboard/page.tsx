import React, { FC } from "react";
import Button from "../../components/ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return <pre>{JSON.stringify(session)}</pre>;
};

export default page;
