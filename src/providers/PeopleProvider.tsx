"use client";

import React, { createContext, useContext, useState } from "react";

interface PeopleContextType {
  people: string[];
  setPeople: (people: string[]) => void;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const PeopleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<string[]>([]);
  return (
    <PeopleContext.Provider value={{ people, setPeople }}>
      {children}
    </PeopleContext.Provider>
  );
};

export function usePeople() {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeople must be used within a PeopleProvider");
  }
  return context;
}
