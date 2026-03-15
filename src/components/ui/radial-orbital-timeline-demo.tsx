"use client";

import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Planning",
    date: "Jan 2026",
    content: "Project planning and requirements gathering phase.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Design architecture",
    date: "Feb 2026",
    content: "UI/UX design and core logic architecture.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Model training",
    date: "Mar 2026",
    content: "Training proprietary LLMs on our infrastructure.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Red team testing",
    date: "Apr 2026",
    content: "Adversarial testing and vulnerability patches.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "V4 Enterprise Launch",
    date: "May 2026",
    content: "Final deployment of the v4 core architecture.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="relative w-full min-h-[100dvh] md:h-screen bg-black border-y border-white/10 z-20 flex flex-col items-center overflow-hidden pt-24 md:pt-32">
      <div className="absolute top-8 md:top-12 left-0 right-0 z-0 text-center pointer-events-none">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white">
          Operation <span className="text-brand-blue">Timeline</span>
        </h2>
      </div>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}
