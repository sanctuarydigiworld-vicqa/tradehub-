// This is the root layout that Next.js uses.
// It allows us to have different root layouts for different parts of the app.
// For example, one for the marketing site and one for the dashboard.

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return children;
}
