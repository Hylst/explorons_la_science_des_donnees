
import { useState, useEffect } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

export const usePersistedTab = (key: string, defaultValue: string) => {
  const [activeTab, setActiveTab] = useState(() => readStorage(key) || defaultValue);

  useEffect(() => {
    writeStorage(key, activeTab);
  }, [key, activeTab]);

  return [activeTab, setActiveTab] as const;
};
