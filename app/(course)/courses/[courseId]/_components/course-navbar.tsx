import NavbarRoutes from "@/components/navbar-routes";
import { auth } from "@clerk/nextjs/server";
import { Course, Chapter, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseMobileSidebar from "./cource-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[];
  };
  progress: number;
}

const CourseNavbar = async ({ course, progress }: CourseNavbarProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progress={progress} />
      <NavbarRoutes />
    </div>
  );
};

export default CourseNavbar;
