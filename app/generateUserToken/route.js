import { NextRequest, NextResponse } from "next/server";
import { StreamClient, UserRequest } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream API Key or API Secret");
}
const client = new StreamClient(apiKey, apiSecret);
export async function POST(req) {
  const { userId, userName, userImage, userEmail } = await req.json();

  const newUser = {
    id: userId,
    name: userName,
    image: userImage,
    custom: {
      userEmail,
    },
  };
  await client.upsertUsers([newUser]);

  const validity = 60 * 60;
  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });
  console.log(
    `User ${userId} created  with token ${token} and validity ${validity} seconds`
  );
  return NextResponse.json({ token });
}
