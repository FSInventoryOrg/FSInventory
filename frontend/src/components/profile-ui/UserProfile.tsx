import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import { useAppContext } from "@/hooks/useAppContext";
import { Spinner } from "../Spinner";

import { InfoIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FullScaleIcon } from "../icons/FullScaleIcon";
import { UploadImage, UserType } from "@/types/user";
import { UserSchema } from "@/schemas/UserSchema";
import AccountManagement from "./AccountManagement";
import ProfileCard from "./ProfileCard";

interface UserProfileProps {
  userData: UserType;
}

const UserProfile = ({ userData }: UserProfileProps) => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [avatar, setAvatar] = useState(userData.avatar);

  const getUserData = () => ({
    ...userData,
    joinDate: userData.joinDate ? new Date(userData.joinDate) : undefined,
  });

  const form = useForm<z.infer<typeof UserSchema>>({
    mode: "onChange",
    resolver: zodResolver(UserSchema),
    defaultValues: getUserData(),
  });

  const {
    formState: { errors, isDirty },
    reset,
  } = form;

  const isValid = !Object.keys(errors).length;

  const { mutate, isPending: isUpdatePending } = useMutation({
    mutationFn: imsService.updateUserData,
    onSuccess: async () => {
      showToast({
        message: "Profile updated successfully!",
        type: "SUCCESS",
      });

      queryClient.invalidateQueries({ queryKey: ["fetchUserData"] });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const { mutate: updatePicture } = useMutation({
    mutationFn: imsService.uploadUserPicture,
    onSuccess: async (attachment) => {
      await imsService.updateUserData({
        ...userData,
        avatar: attachment.downloadLink,
      });
      queryClient.invalidateQueries({ queryKey: ["fetchUserData"] });
      setAvatar(attachment.downloadLink);
      showToast({
        message: "Profile picture updated succesfully!",
        type: "SUCCESS",
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = (data: z.infer<typeof UserSchema>) => {
    mutate(data);
  };

  useEffect(() => {
    reset(getUserData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const [isMD, setIsMD] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMD(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const [isSM, setIsSM] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSM(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleUploadPicture = (data: UploadImage) => {
    updatePicture(data);
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <ProfileCard
        isSM={isSM}
        isMD={isMD}
        user={userData}
        avatar={avatar}
        onSave={handleUploadPicture}
      />
      <div className="flex flex-col w-full p-4">
        <Form {...form}>
          <form
            className="flex flex-col md:flex-row w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div
              id="main"
              className="w-full flex flex-col justify-between items-center gap-4"
            >
              {isMD && (
                <FullScaleIcon
                  size={80}
                  className="fill-current text-primary"
                />
              )}
              <div className="flex w-full flex-col gap-1 border-t mt-4">
                <h1 className="text-xl font-semibold static -translate-y-3 bg-card px-1 text-secondary-foreground flex items-center gap-1.5 w-fit">
                  <InfoIcon size={16} className="text-primary" />
                  Basic Information
                </h1>
              </div>

              <div className="flex w-full flex-col gap-2 items-start">
                <div className="flex w-full gap-2 justify-center items-center">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm"
                            placeholder="First name"
                            autoComplete="off"
                            type="input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm"
                            placeholder="Last name"
                            autoComplete="off"
                            type="input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="self-end flex flex-row justify-center items-center gap-2">
                <Button
                  type="submit"
                  disabled={!isDirty || !isValid} // here
                  className="gap-2"
                >
                  {isUpdatePending ? <Spinner size={18} /> : null}
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <AccountManagement />
      </div>
    </div>
  );
};

export default UserProfile;
