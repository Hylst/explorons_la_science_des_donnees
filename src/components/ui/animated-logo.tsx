import React from 'react';
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { SITE_NAME } from "@/config/site";

interface AnimatedLogoProps {
  className?: string;
  showText?: boolean;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  className = "", 
  showText = true 
}) => {
  return (
    <Link 
      to="/" 
      aria-label={showText ? undefined : `${SITE_NAME} : accueil`}
      className={`flex items-center gap-3 group transition-all duration-300 hover:scale-105 ${className}`}
    >
      {/* Logo Icon with Animation */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      
      {/* Animated Text : « Explorons » puis « la Data Science » (SITE_NAME) */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            Explorons
          </span>
          <span className="text-sm font-medium text-muted-foreground -mt-1 group-hover:text-primary transition-colors duration-300">
            la Data Science
          </span>
        </div>
      )}
    </Link>
  );
};

export default AnimatedLogo;
