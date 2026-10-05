
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface FloatingSidebarToggleProps {
  className?: string;
}

const FloatingSidebarToggle = ({ className }: FloatingSidebarToggleProps) => {
  const { open, toggleSidebar } = useSidebar();

  // Increased z-index to 50
  return (
    <Button
      onClick={toggleSidebar}
      variant="outline"
      size="icon"
      className={`fixed bottom-4 right-4 z-50 rounded-full shadow-md ${className}`}
      aria-label={open ? "Masquer le menu latéral" : "Afficher le menu latéral"}
    >
      {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
    </Button>
  );
};

export default FloatingSidebarToggle;
