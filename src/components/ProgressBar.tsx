
interface Step {
  id: number;
  title: string;
  description: string;
}

interface ProgressBarProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  // Show all steps
  const visibleSteps = steps;

  return (
    <div className="inline-flex items-center justify-center relative">
      {/* Background Line */}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />
      {/* Progress Line */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-brand-600 transition-all duration-700" 
        style={{ width: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 100, 100)}%` }}
      />

      {visibleSteps.map((step) => (
        <div key={step.id} className="relative px-4 sm:px-8 first:pl-0 last:pr-0">
          <div className="flex flex-col items-center w-32 text-center">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 z-10 ${
              step.id === currentStep 
                ? 'bg-mantis-800 border-mantis-800 text-white shadow-lg' 
                : step.id < currentStep 
                  ? 'bg-mantis-600 border-mantis-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {step.id < currentStep ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-lg font-semibold">{step.id}</span>
              )}
            </div>
            <div className="mt-4">
              <div className={`font-semibold transition-colors duration-300 ${
                step.id === currentStep ? 'text-mantis-800' : 
                step.id <= currentStep ? 'text-midnight-900' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
              <div className="text-sm text-gray-500 mt-1 hidden md:block">{step.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 