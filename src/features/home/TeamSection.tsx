import type { TeamMember } from "@/types";

type TeamSectionProps = {
  members: TeamMember[];
};

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        اعضای تیم ما
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="overflow-hidden rounded-xl bg-white text-center shadow-md transition-shadow hover:shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.image}
              alt={member.name}
              className="h-64 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="mt-1 text-accent">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
