"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separater";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface UpdateWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
}

export const UpdateWorkspaceForm = ({ onCancel, initialValues }: UpdateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const {mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
    const {mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone. Are you sure you want to delete this workspace?",
        "destructive"
    );

    const [ResetDialog, confirmReset] = useConfirm(
        "Reset invite link",
        "This will invalidate the current invite link. Are you sure?",
        "destructive"
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ""
        }
    });

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ""
        }

        mutate({ form: finalValues, param: { workspaceId: initialValues.$id } }, {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${data.$id}`);
            }
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file) {
            form.setValue("image", file);
        }
    }

    const handleDelete = async () => {
        const ok = await confirmDelete();

        if(!ok) return;

        deleteWorkspace({ 
            param: { workspaceId: initialValues.$id } 
        }, {
            onSuccess: () => {
                window.location.href = "/";
            }
        });
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();

        if(!ok) return;

        resetInviteCode({ 
            param: { workspaceId: initialValues.$id } 
        }, {
            onSuccess: () => {
                router.refresh();
            }
        });
    }

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    }

    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <ResetDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 py-7 space-y-0">
                    <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator />
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-4">
                                <FormField control={form.control} name="name" render={({ field}) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder="Enter workspace name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem> 
                                )} />

                                <FormField 
                                    control={form.control} 
                                    name="image" 
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-y-2">
                                            <div className="flex items-center gap-x-5">
                                                {field.value ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <Image 
                                                            src={
                                                                field.value instanceof File 
                                                                ? URL.createObjectURL(field.value) 
                                                                : field.value
                                                            }
                                                            alt="Logo"
                                                            fill 
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[36px] text-neutral-400" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className="flex flex-col">
                                                    <p className="text-sm">Workspace Icon</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        JPG, PNG, SVG or JPEG, max 1mb
                                                    </p>
                                                    <input 
                                                        className="hidden"
                                                        type="file"
                                                        accept=".jpg, .png, .jpeg, .svg"
                                                        ref={inputRef}
                                                        onChange={handleImageChange}
                                                        disabled={isPending}
                                                    />
                                                    {field.value ? (
                                                        <Button
                                                            type="button"
                                                            size="xs"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                field.onChange(null);
                                                                if(inputRef.current) {
                                                                    inputRef.current.value = "";
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                            className="w-fit mt-2"
                                                        >
                                                            Remove Image
                                                        </Button>
                                                    ) : (
                                                    <Button
                                                        type="button" 
                                                        disabled={isPending}
                                                        variant="tertiary" 
                                                        size="xs" 
                                                        className="w-fit mt-2" 
                                                        onClick={() => inputRef.current?.click()}
                                                    >
                                                        Upload Image
                                                    </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <DottedSeparator className="py-7" />
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    size="lg" 
                                    variant="secondary"
                                    onClick={onCancel}
                                    disabled={isPending}
                                    className={cn(!onCancel && "invisible")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg" 
                                    disabled={isPending}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Invite Members</h3>
                        <p className="text-muted-foreground text-sm">
                            Use the invite link to add members to your workspace.
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                <Input 
                                    value={fullInviteLink}
                                    disabled
                                    className="flex-1"
                                />
                                <Button 
                                    size="sm"
                                    variant="secondary"
                                    className="size-12"
                                    onClick={handleCopyInviteLink}
                                >
                                    <CopyIcon className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <DottedSeparator className="py-7" />
                        <Button
                            size="sm"
                            variant="destructive"
                            className="mt-6 w-fit ml-auto"
                            type="button"
                            disabled={isPending || isResettingInviteCode}
                            onClick={handleResetInviteCode}
                        >
                            Reset Invite Code
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">Danger Zone</h3>
                        <p className="text-muted-foreground text-sm">
                            Deleting a workspace is irreversible and will remove all associated data.
                        </p>
                        <DottedSeparator className="py-7" />
                        <Button
                            size="sm"
                            variant="destructive"
                            className="mt-6 w-fit ml-auto"
                            type="button"
                            disabled={isPending || isDeletingWorkspace}
                            onClick={handleDelete}
                        >
                            Delete Workspace
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}