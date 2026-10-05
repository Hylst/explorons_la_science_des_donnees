
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Lien d'évitement : visible seulement au clavier, il envoie directement au contenu de la page */}
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("contenu-principal")?.focus();
        }}
      >
        Aller au contenu
      </a>
      <Navbar />
      <main id="contenu-principal" tabIndex={-1} className="flex-grow flex flex-col relative w-full focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
