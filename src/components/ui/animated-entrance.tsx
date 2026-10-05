import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedEntranceProps {
  children: ReactNode;
  animation?: "fade-in" | "fade-in-up" | "fade-in-down" | "fade-in-left" | "fade-in-right" | "scale-in";
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export const AnimatedEntrance = ({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
  once = true
}: AnimatedEntranceProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, threshold, once, hasAnimated]);

  return (
    <div
      ref={ref}
      className={`
        transition-all ease-out
        ${isVisible ? `animate-${animation}` : 'opacity-0'}
        ${className}
      `}
      style={{
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

// Staggered children animation
interface StaggeredAnimationProps {
  children: ReactNode[];
  staggerDelay?: number;
  baseAnimation?: string;
  className?: string;
}

export const StaggeredAnimation = ({
  children,
  staggerDelay = 100,
  baseAnimation = "fade-in-up",
  className = ""
}: StaggeredAnimationProps) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(children.length).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * staggerDelay);
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [children, staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`
            transition-all duration-700 ease-out
            ${visibleItems[index] ? `animate-${baseAnimation}` : 'opacity-0 translate-y-4'}
          `}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Parallax scrolling effect
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax = ({ children, speed = 0.5, className = "" }: ParallaxProps) => {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = (scrolled - rect.top) * speed;
        setOffsetY(parallax);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Morphing shapes animation
export const MorphingShape = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse-glow" />
      <div className="absolute inset-2 bg-gradient-to-r from-secondary/30 to-accent/30 rounded-full animate-float" />
      <div className="absolute inset-4 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full animate-float-delayed" />
    </div>
  );
};

// Text reveal animation
interface TextRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export const TextReveal = ({ text, delay = 50, className = "" }: TextRevealProps) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const interval = setInterval(() => {
            setVisibleChars(prev => {
              if (prev >= text.length) {
                clearInterval(interval);
                return prev;
              }
              return prev + 1;
            });
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text.length, delay]);

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`
            transition-opacity duration-300
            ${index < visibleChars ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {char}
        </span>
      ))}
    </span>
  );
};