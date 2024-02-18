"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyAppWrap from "./AppWrap";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, []);
  return (
    <MyAppWrap>
      <></>
    </MyAppWrap>
  );
}
