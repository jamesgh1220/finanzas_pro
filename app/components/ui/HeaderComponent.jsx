import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="border-b border-slate-600">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">FinanzasPro</h1>
                <p className="text-xs text-foreground lg:text-sm">Gestión financiera personal</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}