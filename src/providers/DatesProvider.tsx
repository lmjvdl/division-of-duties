"use client";

import React, { createContext, useContext, useState } from "react";

interface DatesContextType {
  dates: Date[];
  setDates: (dates: Date[]) => void;
}

const DatesContext = createContext<DatesContextType | undefined>(undefined);

export const DatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dates, setDates] = useState<Date[]>([]);
  return (
    <DatesContext.Provider value={{ dates, setDates }}>
      {children}
    </DatesContext.Provider>
  );
};

export function useDates() {
  const context = useContext(DatesContext);
  if (!context) {
    throw new Error("useDates must be used within a DatesProvider");
  }
  return context;
}
