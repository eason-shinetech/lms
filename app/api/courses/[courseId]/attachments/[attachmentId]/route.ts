import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; attachmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { courseId, attachmentId } =  await params;
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
