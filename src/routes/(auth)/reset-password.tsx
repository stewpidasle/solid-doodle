import { createFileRoute, Link } from "@tanstack/react-router";
import ResetPasswordForm from "@/features/auth/reset-password";
import { useTranslation } from "@/lib/intl/react";

export const Route = createFileRoute("/(auth)/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center p-2 md:p-6">
      <ResetPasswordForm />

      <div className="mt-4 text-center">
        {t("DONT_HAVE_ACCOUNT")}{" "}
        <Link to="/login" className="underline">
          {t("LOGIN")}
        </Link>
        !
      </div>
    </div>
  );
}
