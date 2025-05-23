import React from "react";
import UserProfile from "@/app/ui/users/UserProfile";
import { makeRequest } from "@/app/lib/helperFunctions";
import Loader from "@/app/components/Loader";

const page = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/check?userId=${userId}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) throw new Error("Request faild: ", await response.json());

    const user = await response.json();
    if (!user) {
      return (
        <main>
          <p>User not found.</p>
        </main>
      );
    }
    return (
      <main className="flex flex-col min-h-screen w-full items-center">
        {Object.keys(user).length > 0 ? (
          <UserProfile user={user} />
        ) : (
          <Loader />
        )}
      </main>
    );
  } catch (error: any) {
    console.error("Error fetching client data:", error);
    return (
      <main>
        <p>Failed to load client information. Please try again later.</p>
      </main>
    );
  }
};

export default page;
