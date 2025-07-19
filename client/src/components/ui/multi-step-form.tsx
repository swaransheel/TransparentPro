import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  id: string;
  title: string;
  component: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose?: () => void;
  nextButtonText?: string;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  className?: string;
}

export function MultiStepForm({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onClose,
  nextButtonText = "Continue",
  isNextDisabled = false,
  isPreviousDisabled = false,
  className
}: MultiStepFormProps) {
  const currentStepData = steps[currentStep - 1];

  return (
    <div className={cn("min-h-screen bg-muted/50 py-8", className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Header */}
        <div className="bg-background rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground">Product Assessment</h1>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
          
          <ProgressBar 
            value={currentStep} 
            max={steps.length} 
            showPercentage 
            className="mb-4"
          />
          
          {/* Step Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            {steps.map((step, index) => (
              <span 
                key={step.id}
                className={cn(
                  "font-medium",
                  index + 1 === currentStep && "text-primary",
                  index + 1 < currentStep && "text-green-600"
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-background rounded-xl shadow-sm p-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6">
            {currentStepData?.title}
          </h2>
          
          <div className="min-h-[400px]">
            {currentStepData?.component}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isPreviousDisabled || currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Auto-saved 2 minutes ago</span>
            </div>
            
            <Button
              onClick={onNext}
              disabled={isNextDisabled}
              className="flex items-center space-x-2"
            >
              <span>{nextButtonText}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
