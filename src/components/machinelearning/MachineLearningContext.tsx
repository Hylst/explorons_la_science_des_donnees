
import React, { useState, ReactNode } from "react";
import { MachineLearningContext } from "./machine-learning-context";

export const MachineLearningContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <MachineLearningContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </MachineLearningContext.Provider>
  );
};
