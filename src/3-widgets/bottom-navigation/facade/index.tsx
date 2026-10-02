"use client";

import { useState } from "react";

import { BottomMenu } from "@/src/4-features/bottom-menu";
import { Mission } from "@/src/4-features/mission";
import { HowItWorks } from "@/src/4-features/how-it-works";

type SheetId = "mission" | "howItWorks" | null;

export function BottomNavigation() {
  const [openSheet, setOpenSheet] = useState<SheetId>(null);

  const close = () => setOpenSheet(null);

  return (
    <>
      <BottomMenu openSheet={openSheet} onOpen={setOpenSheet} />
      <Mission open={openSheet === "mission"} onClose={close} />
      <HowItWorks open={openSheet === "howItWorks"} onClose={close} />
    </>
  );
}