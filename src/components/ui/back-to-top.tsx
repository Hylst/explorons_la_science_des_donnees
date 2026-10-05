
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-8 right-8 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={scrollToTop}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
};

export default BackToTop;
