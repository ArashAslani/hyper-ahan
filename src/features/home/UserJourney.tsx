import type { JourneyStep } from "@/types";

type UserJourneyProps = {
  steps: JourneyStep[];
};

export function UserJourney({ steps }: UserJourneyProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        چگونه از ما خرید کنید؟
      </h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-4 md:grid md:min-w-0 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="w-64 flex-shrink-0 rounded-xl bg-white p-5 text-center shadow-md transition-shadow hover:shadow-lg md:w-auto"
            >
              <div className="mb-3 text-5xl">{step.icon}</div>
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                {step.id}
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
