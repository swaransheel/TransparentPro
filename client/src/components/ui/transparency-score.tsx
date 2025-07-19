import { cn } from "@/lib/utils";

interface TransparencyScoreProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TransparencyScore({ 
  score, 
  label = "Transparency Score", 
  size = "md",
  className 
}: TransparencyScoreProps) {
  const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  const circleColor = score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-yellow-500" : "stroke-red-500";
  
  const sizeClasses = {
    sm: { container: "w-16 h-16", text: "text-lg", label: "text-xs" },
    md: { container: "w-24 h-24", text: "text-xl", label: "text-sm" },
    lg: { container: "w-32 h-32", text: "text-2xl", label: "text-base" }
  };
  
  const { container, text, label: labelSize } = sizeClasses[size];
  const radius = size === "sm" ? 24 : size === "md" ? 40 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", container, className)}>
      <svg className={cn("w-full h-full transform -rotate-90", container)}>
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-muted"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", circleColor)}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn("font-bold", text, scoreColor)}>{Math.round(score)}</div>
          <div className={cn("text-muted-foreground", labelSize)}>{label}</div>
        </div>
      </div>
    </div>
  );
}
