import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { url } = await request.json();

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
