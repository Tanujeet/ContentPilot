"use client";

import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-6 gap-4 h-16 bg-[#1A1325] border-b border-bg-[#1A1325] sticky top-0 z-50">
      <div>
        <h1
          className="text-xl font-semibold  px-2 text-white cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          ContentPilot
        </h1>
      </div>
      <SignedOut>
        <SignUpButton mode="modal">
          <button className="bg-black text-white rounded-full font-medium text-sm h-10 px-4 hover:bg-gray-800 transition border border-white">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
};

export default Navbar;
