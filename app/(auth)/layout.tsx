export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-display">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
}
