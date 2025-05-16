import { ShieldIcon } from "lucide-react";

export function LogoHeader() {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-primary rounded-full p-3">
        <ShieldIcon className="h-8 w-8 text-primary-foreground" />
      </div>
    </div>
  );
}