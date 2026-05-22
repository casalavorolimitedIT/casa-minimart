export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto w-full">{children}</main>;
}
