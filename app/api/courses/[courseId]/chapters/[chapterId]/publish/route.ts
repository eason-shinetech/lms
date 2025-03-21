import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = await params;
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
    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        isPublished,
      },
    });

    if (!isPublished) {
      //If course has no published chapters then set course isPublished to false
      const publishedChaptersInCourse = await db.chapter.findMany({
        where: {
          courseId: courseId,
          isPublished: true,
        },
      });
      if (publishedChaptersInCourse.length === 0) {
        await db.course.update({
          where: {
            id: courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_PUBLISH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
