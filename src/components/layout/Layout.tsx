import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pattern-dots">
      <Sidebar />
      <div className="lg:pl-[17.5rem]">
        <main className="min-h-screen">
          <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
