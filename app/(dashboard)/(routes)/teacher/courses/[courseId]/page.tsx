import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";

const CourseDetailPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });
  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.price,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
        <TitleForm initialData={course} courseId={course.id} />
        <DescriptionForm
          initialData={{ description: course.description || "" }}
          courseId={course.id}
        />
        <ImageForm
          initialData={{ imageUrl: course.imageUrl || "" }}
          courseId={course.id}
        />
      </div>
    </div>
  );
};

export default CourseDetailPage;
