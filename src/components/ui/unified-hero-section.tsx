
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LucideIcon, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedEntrance } from "./animated-entrance";

type HeroVariant = "home" | "page" | "course";

interface ActionButton {
  label: string;
  to: string;
  variant?: "default" | "outline" | "secondary";
  icon?: LucideIcon;
}

interface CourseInfo {
  level?: string;
  duration?: string;
  modules?: number;
  totalHours?: string;
}

interface UnifiedHeroSectionProps {
  variant: HeroVariant;
  title: string;
  /** Niveau du titre : h2 quand la mise en page de la page porte déjà le h1 (cours dans CourseLayout) */
  titleAs?: "h1" | "h2";
  subtitle?: string;
  description: string;
  
  // Optional elements
  alert?: {
    message: string;
    details?: string;
    variant?: "info" | "warning" | "success";
  };
  
  // Actions
  actions?: ActionButton[];
  
  // Course-specific
  courseInfo?: CourseInfo;
  icon?: LucideIcon;
  
  // Custom content
  children?: ReactNode;
  sideContent?: ReactNode;
  
  // Layout options
  layout?: "centered" | "split";
  
  // Styling options
  decorative?: boolean;
  className?: string;
}

const UnifiedHeroSection = ({
  variant,
  title,
  titleAs: TitleTag = "h1",
  subtitle,
  description,
  alert,
  actions,
  courseInfo,
  icon: Icon,
  children,
  sideContent,
  layout = variant === "home" ? "split" : "centered",
  decorative = variant === "home",
  className = "",
}: UnifiedHeroSectionProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "home":
        return "py-24 lg:py-32 bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden";
      case "course":
        return "py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden";
      default:
        return "py-16 lg:py-24 bg-gradient-to-br from-background via-muted/10 to-accent/5 relative overflow-hidden";
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case "home":
        return "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-none";
      case "course":
        return "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight";
      default:
        return "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight";
    }
  };

  const getAlertVariant = () => {
    switch (alert?.variant) {
      case "warning":
        return "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300 backdrop-blur-sm";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300 backdrop-blur-sm";
      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300 backdrop-blur-sm";
    }
  };

  const renderContent = () => (
    <div className="relative z-20">
      <AnimatedEntrance animation="fade-in-up" delay={200}>
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Floating decorative elements */}
          {decorative && (
            <div className="absolute -top-20 -left-20 opacity-20">
              <Sparkles className="h-16 w-16 text-primary animate-pulse-glow" />
            </div>
          )}
          
          {/* Icon and Subtitle for course variant */}
          {variant === "course" && Icon && (
            <AnimatedEntrance animation="fade-in-left" delay={400}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
                  <div className="relative bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl shadow-xl">
                    <Icon className="h-10 w-10 text-white animate-scale-in" />
                  </div>
                </div>
                {subtitle && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Cours
                    </span>
                    <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {subtitle}
                    </span>
                  </div>
                )}
              </div>
            </AnimatedEntrance>
          )}
          
          {/* Enhanced Title with multiple gradient effects */}
          <AnimatedEntrance animation="fade-in-up" delay={600}>
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-3xl opacity-30 animate-pulse-glow"></div>
              
              <TitleTag className={`${getTitleClasses()} relative`}>
                {variant === "home" ? (
                  <>
                    <span className="block mb-2">
                      Explorez le monde de la
                    </span>
                    <span className="block relative">
                      {/* Strong background for better contrast */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 blur-2xl opacity-50"></div>
                      {/* Main text with high contrast and solid fallback */}
                      <span className="relative z-10 font-black tracking-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter contrast-125">
                          DATA SCIENCE
                        </span>
                        {/* Solid fallback text for better readability */}
                        <span className="absolute inset-0 text-slate-800 dark:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          DATA SCIENCE
                        </span>
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
                    {title}
                  </span>
                )}
              </TitleTag>
              
              {/* Decorative elements around title */}
              {decorative && (
                <>
                  <div className="absolute -top-4 -right-4 opacity-60">
                    <Zap className="h-8 w-8 text-accent animate-bounce" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 opacity-40">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                  </div>
                </>
              )}
            </div>
          </AnimatedEntrance>

          {/* Enhanced Subtitle for non-course variants */}
          {variant !== "course" && subtitle && (
            <AnimatedEntrance animation="fade-in-up" delay={800}>
              <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-relaxed">
                {subtitle}
              </h2>
            </AnimatedEntrance>
          )}

          {/* Enhanced Description */}
          <AnimatedEntrance animation="fade-in-up" delay={1000}>
            <div className="relative">
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl leading-relaxed font-light">
                {description}
              </p>
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-30"></div>
            </div>
          </AnimatedEntrance>

          {/* Enhanced Course Info Badges */}
          {courseInfo && (
            <AnimatedEntrance animation="fade-in-up" delay={1200}>
              <div className="flex flex-wrap gap-3 my-6">
                {courseInfo.level && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {courseInfo.level}
                  </Badge>
                )}
                {courseInfo.duration && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-4 py-2 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105"
                  >
                    {courseInfo.duration} (indicatif)
                  </Badge>
                )}
                {courseInfo.modules && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-4 py-2 bg-gradient-to-r from-secondary/10 to-accent/10 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105"
                  >
                    {courseInfo.modules} modules
                  </Badge>
                )}
                {courseInfo.totalHours && (
                  <Badge 
                    variant="outline" 
                    className="text-sm px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
                  >
                    {courseInfo.totalHours} de contenu
                  </Badge>
                )}
              </div>
            </AnimatedEntrance>
          )}

          {/* Enhanced Alert */}
          {alert && (
            <AnimatedEntrance animation="fade-in-up" delay={1400}>
              <Alert className={`${getAlertVariant()} border-2 shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                <AlertDescription className="flex flex-col gap-3 relative z-10">
                  <span className="font-semibold text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {alert.message}
                  </span>
                  {alert.details && (
                    <span className="text-sm leading-relaxed opacity-90">
                      {alert.details}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            </AnimatedEntrance>
          )}

          {/* Enhanced Action Buttons */}
          {actions && actions.length > 0 && (
            <AnimatedEntrance animation="fade-in-up" delay={1600}>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {actions.map((action, index) => {
                  const ButtonIcon = action.icon;
                  const isPrimary = action.variant === "default" || !action.variant;
                  
                  return (
                    <Button 
                      key={index}
                      asChild 
                      size="lg" 
                      variant={action.variant || "default"}
                      className={`
                        group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl
                        ${isPrimary 
                          ? "bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white border-0 shadow-lg px-8 py-4 text-lg font-semibold" 
                          : action.variant === "outline"
                          ? "border-2 border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 hover:border-primary/50 px-6 py-3"
                          : "px-6 py-3"
                        }
                      `}
                    >
                      <Link to={action.to} className="flex items-center gap-3">
                        <span className="relative z-10">{action.label}</span>
                        {ButtonIcon && (
                          <ButtonIcon className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${isPrimary ? 'drop-shadow-sm' : ''}`} />
                        )}
                        {isPrimary && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </AnimatedEntrance>
          )}

          {/* Custom Children */}
          {children && (
            <AnimatedEntrance animation="fade-in-up" delay={1800}>
              <div className="mt-8">
                {children}
              </div>
            </AnimatedEntrance>
          )}
        </div>
      </AnimatedEntrance>
    </div>
  );

  return (
    <div className={`relative ${getVariantClasses()} ${className}`}>
      {/* Enhanced decorative background elements */}
      {decorative && (
        <>
          {/* Animated gradient orbs */}
          <div className="absolute -top-60 -right-60 h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-float opacity-60" />
          <div className="absolute -bottom-60 -left-60 h-96 w-96 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl animate-float-delayed opacity-60" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-2xl animate-pulse-glow" />
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rounded-full animate-bounce opacity-70" />
          <div className="absolute bottom-32 left-16 w-6 h-6 border-2 border-accent/40 rotate-45 animate-spin-slow opacity-50" />
          <div className="absolute top-1/3 left-10 w-3 h-3 bg-secondary/40 transform rotate-45 animate-pulse opacity-60" />
          
          {/* Subtle grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />
        </>
      )}
      
      <div className="container relative z-10">
        {layout === "split" && sideContent ? (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center min-h-[70vh]">
            {renderContent()}
            <AnimatedEntrance animation="fade-in-right" delay={1000}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-2xl"></div>
                <div className="relative">
                  {sideContent}
                </div>
              </div>
            </AnimatedEntrance>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto text-center py-12">
            {renderContent()}
            {sideContent && (
              <AnimatedEntrance animation="scale-in" delay={1200}>
                <div className="mt-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-xl"></div>
                  <div className="relative">
                    {sideContent}
                  </div>
                </div>
              </AnimatedEntrance>
            )}
          </div>
        )}
      </div>
      
      {/* Scroll indicator for home variant */}
      {variant === "home" && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedHeroSection;
