import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 bg-white shadow-sm sticky top-0 z-50">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-white border text-sm rounded-full px-4 py-2 hover:bg-gray-50 transition">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-4 hover:bg-[#5938d7] transition">
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
