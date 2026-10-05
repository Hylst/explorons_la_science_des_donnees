import { createContext, useContext } from "react";

export interface MachineLearningContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const MachineLearningContext = createContext<MachineLearningContextType | undefined>(undefined);

/** Section active de la page Machine Learning (à utiliser sous MachineLearningContextProvider) */
export const useMachineLearning = () => {
  const context = useContext(MachineLearningContext);
  if (context === undefined) {
    throw new Error("useMachineLearning must be used within a MachineLearningContextProvider");
  }
  return context;
};
