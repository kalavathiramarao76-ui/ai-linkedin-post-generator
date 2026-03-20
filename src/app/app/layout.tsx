import Sidebar from "@/components/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import InstallPrompt from "@/components/InstallPrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="ml-64 min-h-screen" role="main" aria-label="Main content">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <ErrorBoundary fallbackTitle="This tool encountered an error">
            {children}
          </ErrorBoundary>
        </div>
      </main>
      <InstallPrompt />
    </div>
  );
}
