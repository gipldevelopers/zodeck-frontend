// src\app\(dashboard)\hr\employees\add\components\ProgressIndicator.js
"use client";
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProgressIndicator({ steps, currentStep }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="w-full">
        {/* Mobile View - Simplified */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="relative">
              {/* Progress Line */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ 
                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
                  }}
                />
              </div>
              
              {/* Step Dots */}
              <div className="absolute inset-0 flex justify-between items-center">
                {steps.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  
                  return (
                    <div
                      key={step.id}
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                        ${isCompleted 
                          ? 'bg-blue-600 text-white' 
                          : isCurrent 
                          ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:ring-blue-900' 
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        step.id
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Step Info */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Step {currentStep}: {steps.find(s => s.id === currentStep)?.title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {currentStep} of {steps.length}
          </p>
        </div>
      </div>
    );
  }

  // Desktop View (Original with improvements)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isCurrent 
                      ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:ring-blue-900' 
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
              </div>

              {/* Step Title (Hidden on smallest screens) */}
              <div className="ml-3 flex-1 hidden sm:block">
                <p
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : isCompleted 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {step.title}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-0.5 flex-1 mx-4 transition-colors duration-300 hidden md:block
                    ${step.id < currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Current Step Description */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
        </p>
      </div>
    </div>
  );
}