import { type PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export async function PageLayout({ children, className }: PageLayoutProps) {
  return <div className={`container flex flex-1 flex-col pt-10 ${className ?? ""}`}>{children}</div>;
}
