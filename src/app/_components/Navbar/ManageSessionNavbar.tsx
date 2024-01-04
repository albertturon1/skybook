"use client";

import { signIn, signOut } from "next-auth/react";
import { MangeSessionButton } from "./MangeSessionButton";
import { type Session } from "next-auth";

type ManageSessionNavbarProps = {
  session: Session | null;
};

const handleSingIn = () => {
  void signIn("google");
};

export function ManageSessionNavbar({ session }: ManageSessionNavbarProps) {
  if (!session) {
    return <MangeSessionButton onPress={handleSingIn} title="Sign in" />;
  }

  return <MangeSessionButton onPress={signOut} title="Sign out" />;
}
