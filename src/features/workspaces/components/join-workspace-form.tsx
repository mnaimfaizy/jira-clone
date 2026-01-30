"use client";

import { DottedSeparator } from "@/components/dotted-separater";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-ids";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const getWorkspaceIdFromResponse = (value: unknown) => {
    if (typeof value !== "object" || value === null) return undefined;
    if (!("data" in value)) return undefined;

    const data = (value as { data?: unknown }).data;
    if (typeof data !== "object" || data === null) return undefined;
    const id = (data as { $id?: unknown }).$id;
    return typeof id === "string" ? id : undefined;
  };

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId: workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: (result) => {
          const joinedWorkspaceId = getWorkspaceIdFromResponse(result);
          if (!joinedWorkspaceId) return;

          router.push(`/workspaces/${joinedWorkspaceId}`);
        },
      },
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join{" "}
          <strong>{initialValues.name} </strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            className="w-full lg:w-fit"
            variant="secondary"
            asChild
            size={"lg"}
            type="button"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size={"lg"}
            type="button"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
