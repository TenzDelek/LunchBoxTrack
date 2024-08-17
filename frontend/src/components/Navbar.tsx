import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className=" py-5 px-10  bg-[#EBEBEB] mt-5 mx-10 text-black flex items-center justify-between  rounded-full">
     <Link href="/"> <div className=" font-bold">LunchBox</div></Link>
      <div>
        <SignedOut>
          <div className=" group space-x-3 flex items-center bg-[#FEED01] border border-black text-black font-bold py-2 px-4 rounded-full text-sm">
            <SignInButton />
            <span className=" relative overflow-hidden h-fit w-fit">
              <GoArrowUpRight className="group-hover:-translate-y-5 group-hover:translate-x-5 duration-500 transition-transform ease-in-out-circ fill-light-gray stroke-[0.2]" />
              <GoArrowUpRight className="absolute top-0 group-hover:translate-x-0 duration-500 group-hover:translate-y-0 transition-all ease-in-out-circ translate-y-5 -translate-x-5 fill-light-gray stroke-[0.2]" />
            </span>
          </div>
        </SignedOut>
        <SignedIn>
          <div className=" flex items-center gap-3 text-xs">
            <div>{user?.firstName}</div>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
