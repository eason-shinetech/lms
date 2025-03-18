"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";
import { z } from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated successfully!");
      handleEditClick();
      router.refresh();
    } catch {
      toast.error("Someting went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeleteId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment delete successfully!");
      router.refresh();
    } catch {
      toast.error("Someting went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachment
        <Button onClick={handleEditClick} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Add an attachment
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (initialData.attachments?.length === 0 ? (
          <p className="text-sm mt-2 text-slate-500 italic">
            No attachment yet. Upload one now.
          </p>
        ) : (
          <div className="space-y-2">
            {initialData.attachments?.map((attachment) => (
              <div
                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                key={attachment.id}
              >
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">{attachment.name}</p>
                {deleteId === attachment.id ? (
                  <div className="ml-auto">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button
                    className="ml-auto hover:opacity-75 transition"
                    onClick={() => onDelete(attachment.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({
                  url: url,
                });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add your course attachment here.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
