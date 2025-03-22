import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { isPublished } = await req.json();
    if (isPublished) {
      const publishedChaptersInCourse = await db.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
      });
      if (publishedChaptersInCourse.length === 0) {
        return new NextResponse(
          "The course should has one more chapter published",
          { status: 401 }
        );
      }
    }
    const publishedChapter = await db.chapter.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
