import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWithProgressWitCategory = Course & {
  category: Category | null;
  chapters: {
    id: string;
  }[];
  progress: number | null;
};

type GetCoursesProps = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCoursesProps): Promise<CourseWithProgressWitCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const coursesWithProgress: CourseWithProgressWitCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            };
          }
          const progress = await getProgress(userId, course.id);
          return {
            ...course,
            progress,
          };
        })
      );
    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
