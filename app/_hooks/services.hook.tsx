"use client";

import { createContext, ReactNode, useContext } from "react";
import { AdventureService } from "@lib/adventure/adventure.service";
import { getAdventureService } from "@lib/registry";

type Services = {
  adventureService: AdventureService;
};

const ServicesContext = createContext<Services | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services: Services = {
    adventureService: getAdventureService(),
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices must be used within ServicesProvider");
  }
  return context;
}
