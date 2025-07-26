import { isAuthServer } from "@/auth/isAuthServer";
import { Building2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
  const authResult = await isAuthServer();

  if (authResult && !authResult.authenticated) {
    redirect("/signin");
  }
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center max-w-2xl px-6">
        <div className="flex justify-center mb-6">
          <Building2 className="h-20 w-20 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome to SBUILDING
        </h1>
      </div>
    </div>
  );
}
