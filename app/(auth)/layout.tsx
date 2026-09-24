/** Narrow, centered column for the login and registration pages. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto w-full max-w-md px-4 py-8 md:py-16">{children}</div>;
}
