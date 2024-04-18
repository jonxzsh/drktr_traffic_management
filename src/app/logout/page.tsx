"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    signOut();
  }, []);

  return <>Signing out...</>;
};

export default LogoutPage;
