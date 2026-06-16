import { LessonPlayer } from "@/components/learning/lesson-player";
import { getLessonByDay } from "@/data/lessons";
import { demoUser } from "@/data/user";

export default function LessonPage() {
  const lesson = getLessonByDay(demoUser.day) ?? getLessonByDay(1)!;

  return (
    <div className="min-h-screen bg-bg">
      <LessonPlayer lesson={lesson} />
    </div>
  );
}
