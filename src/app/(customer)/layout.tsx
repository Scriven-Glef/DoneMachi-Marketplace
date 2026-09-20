import { CustomerNavbar } from "@/components/CustomerNavbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
