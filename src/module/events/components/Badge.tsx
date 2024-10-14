export const Badge = ({ text, show }: { text: string; show?: boolean }) => {
  const pillClass =
    "relative -end-2 -top-2 inline-flex h-4 items-center justify-center rounded-full bg-[hsl(280,100%,70%)] p-2 text-xs font-bold text-white dark:border-gray-900";
  return show ? <div className={pillClass}>{text}</div> : null;
};

export const VIPBadge = ({ isVIP }: { isVIP: boolean }) => {
  return <Badge text="VIP" show={isVIP} />;
};
