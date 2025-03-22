import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const values = await req.json();
    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    await db.chapter.deleteMany({
      where: {
        courseId,
      },
    });
    const course = await db.course.delete({
      where: {
        id: courseId,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
