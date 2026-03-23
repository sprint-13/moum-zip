import Empty from "../assets/img_empty.svg";

export const NoSpaceCard = ({ message }: { message: string }) => {
  return (
    <div className="col-span-full mt-20 flex flex-col items-center gap-2 [column-span:all]">
      <Empty />
      <span className="font-medium text-md text-muted-foreground">{message}</span>
    </div>
  );
};
