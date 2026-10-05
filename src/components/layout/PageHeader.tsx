
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-ds-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl">
        {description}
      </p>
      {children}
    </div>
  );
};

export default PageHeader;
