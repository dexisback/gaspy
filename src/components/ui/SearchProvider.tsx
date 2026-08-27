"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { CommandSearchModal } from "./CommandSearchModal";

interface SearchContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSearch = () => setOpen((o) => !o);

  return (
    <SearchContext.Provider value={{ open, setOpen, toggleSearch }}>
      {children}
      <CommandSearchModal open={open} setOpen={setOpen} />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
