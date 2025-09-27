import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InvitationError } from "@/features/organization/invitation-error";
import { authClient } from "@/lib/auth/auth-client";
import { useTranslation } from "@/lib/intl/react";

export const Route = createFileRoute("/(auth)/accept-invitation/$invitationId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const params = Route.useParams();
  const router = useRouter();
  const [invitationStatus, setInvitationStatus] = useState<"pending" | "accepted" | "rejected">("pending");

  const handleAccept = async () => {
    await authClient.organization
      .acceptInvitation({
        invitationId: params.invitationId,
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitationStatus("accepted");
          router.navigate({ to: "/dashboard" });
        }
      });
  };

  const handleReject = async () => {
    await authClient.organization
      .rejectInvitation({
        invitationId: params.invitationId,
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitationStatus("rejected");
        }
      });
  };

  const [invitation, setInvitation] = useState<{
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
    id: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authClient.organization
      .getInvitation({
        query: {
          id: params.invitationId,
        },
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "An error occurred");
        } else {
          setInvitation(res.data);
        }
      });
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      {invitation ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("ORG_INVITATION")}</CardTitle>
            <CardDescription>{t("ORG_INVITATION_DESC")}</CardDescription>
          </CardHeader>
          <CardContent>
            {invitationStatus === "pending" && (
              <div className="space-y-4">
                <p>
                  <strong>{invitation?.inviterEmail}</strong> {t("INVITED_BY")}{" "}
                  <strong>{invitation?.organizationName}</strong>.
                </p>
                <p>
                  {t("INVITATION_SENT_TO")} <strong>{invitation?.email}</strong>.
                </p>
              </div>
            )}
            {invitationStatus === "accepted" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-center font-bold text-2xl">
                  {t("WELCOME_TO")} {invitation?.organizationName}!
                </h2>
                <p className="text-center">{t("JOIN_SUCCESS")}</p>
              </div>
            )}
            {invitationStatus === "rejected" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XIcon className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-center font-bold text-2xl">{t("INVITATION_DECLINED")}</h2>
                <p className="text-center">
                  {t("DECLINED_MESSAGE")} {invitation?.organizationName}.
                </p>
              </div>
            )}
          </CardContent>
          {invitationStatus === "pending" && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReject}>
                {t("DECLINE")}
              </Button>
              <Button onClick={handleAccept}>{t("ACCEPT_INVITATION")}</Button>
            </CardFooter>
          )}
        </Card>
      ) : error ? (
        <InvitationError />
      ) : (
        <InvitationSkeleton />
      )}
    </div>
  );
}

function InvitationSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
