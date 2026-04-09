export interface MeetingDetailForEdit {
  type: string | null;
  name: string | null;
  capacity: number | null;
  description: string | null;
  image: string | null;
  region: string | null;
  dateTime: string | null;
  registrationEnd: string | null;
  themeColor?: string | null;
  hostId?: number | null;
}
