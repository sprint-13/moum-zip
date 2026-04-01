// "0000-00-00" 형식의 문자열을 Date 객체로 변환
export const parseDateString = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

// Date 객체를 "0000-00-00" 형식의 문자열로 변환
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// "00:00" 형식의 문자열을 { hour, minute } 객체로 변환
export const parseTimeString = (value: string | undefined): { hour: string; minute: string } => {
  if (!value) return { hour: "", minute: "" };
  const [hour = "", minute = ""] = value.split(":");
  return { hour, minute };
};

// { hour, minute } 객체를 "00:00" 형식의 문자열로 변환
export const formatTime = (hour: string, minute: string): string => {
  return `${hour}:${minute}`;
};
