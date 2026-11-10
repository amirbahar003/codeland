"use client";

import { createContext, useContext, useState } from "react";

const MegaMenuContext = createContext();

export function MegaMenuProvider({ children }) {
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

    return (
        <MegaMenuContext.Provider
            value={{isMegaMenuOpen,setIsMegaMenuOpen,}}>
            {children}
        </MegaMenuContext.Provider>
    );
}

export function useMegaMenu() {
    return useContext(MegaMenuContext);
}
