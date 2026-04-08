import { notFound } from "next/navigation";
import { MoimEditForm } from "@/features/moim-edit/ui/moim-edit-form";
import { getMoimEdit } from "@/features/moim-edit/use-cases/get-moim-edit";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

const parseMeetingId = (meetingId: string) => {
  const numericMeetingId = Number(meetingId);

  if (!Number.isInteger(numericMeetingId) || numericMeetingId <= 0) {
    notFound();
  }

  return numericMeetingId;
};

export default async function MoimEditPage({ params }: PageProps) {
  const { meetingId } = await params;
  const numericMeetingId = parseMeetingId(meetingId);

  const { initialValues } = await getMoimEdit({
    meetingId: numericMeetingId,
  });

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-6 md:px-6 md:py-10 xl:px-10">
      <MoimEditForm meetingId={numericMeetingId} initialValues={initialValues} />
    </div>
  );
}
