"use client";

import dynamic from "next/dynamic";

// The combat is saved in the local storage, which only exists in the browser
const CombatTracker = dynamic(
  () => import("./_components/combat-tracker/CombatTracker"),
  { ssr: false },
);

const CombatTrackerPage = () => <CombatTracker />;

export default CombatTrackerPage;
