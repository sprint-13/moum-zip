export const parseDateString = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseTimeString = (value: string | undefined): { hour: string; minute: string } => {
  if (!value) return { hour: "00", minute: "00" };
  const [hour = "00", minute = "00"] = value.split(":");
  return { hour, minute };
};

export const formatTime = (hour: string, minute: string): string => {
  return `${hour}:${minute}`;
};
