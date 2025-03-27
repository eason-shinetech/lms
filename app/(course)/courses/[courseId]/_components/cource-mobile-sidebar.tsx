import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Course, Chapter, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progress: number;
}

const CourseMobileSidebar = ({
  course,
  progress,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progress={progress} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
