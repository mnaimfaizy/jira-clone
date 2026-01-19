"use server";

import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE);

    // If no session cookie exists, return null without throwing an error
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const { account } = await createSessionClient();

    return await account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
};
