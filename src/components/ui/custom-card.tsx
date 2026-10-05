
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  cardTitle?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export const CustomCard = ({
  cardTitle,
  description,
  footer,
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  ...props
}: CustomCardProps) => {
  return (
    <Card className={cn("card-surface", className)} {...props}>
      {(cardTitle || description) && (
        <CardHeader className={headerClassName}>
          {cardTitle && <CardTitle>{cardTitle}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent className={contentClassName}>{children}</CardContent>}
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

// Pour les cas où on veut juste appliquer le style sur des éléments existants
export const useCardSurfaceClass = (additionalClasses?: string) => {
  return cn("card-surface", additionalClasses);
};

export default CustomCard;
