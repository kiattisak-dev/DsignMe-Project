import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, footer, children }: AuthCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="text-sm text-center text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}