"use client";

import { Children, useEffect, useState } from "react";
import { RtcProvider } from "@/context/rtcContext";

const AppWrap = ({ children }) => {
  return (
    <>
      <RtcProvider>{children}</RtcProvider>
    </>
  );
};

export default AppWrap;
