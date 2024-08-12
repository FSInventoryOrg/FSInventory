import { useAppContext } from "@/hooks/useAppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { AssetCounterSchema } from "@/schemas/AssetCounterSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const AddAssetCounter = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { showToast } = useAppContext();

  const form = useForm<z.infer<typeof AssetCounterSchema>>({
    resolver: zodResolver(AssetCounterSchema),
    defaultValues: {
      category: "",
      prefixCode: "",
      threshold: 100,
      type: "Hardware",
      counter: undefined,
    },
  });

  const { mutate } = useMutation({
    mutationFn: imsService.postAssetCounter,
    onSuccess: async () => {
      showToast({
        message: "New asset counter added successfully!",
        type: "SUCCESS",
      });
      queryClient.invalidateQueries({ queryKey: ["fetchAssetCounters"] });
      setTimeout(() => {
        setOpen(false);
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = (data: z.infer<typeof AssetCounterSchema>) => {
    mutate(data);
  };

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2 h-8 gap-1 font-semibold">
          <span className="hidden md:inline-block text-sm">Add Asset Counter</span>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Asset Counter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col w-full gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      // className="cursor-default"
                      // readOnly
                      // disabled
                      autoComplete="off"
                      type="input"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prefixCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="FS-XYZ"
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
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      type="number"
                      className="[&::-webkit-inner-spin-button]:appearance-none"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)} // convert to int
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={false} className="gap-2 self-end">
              {/* {isPending ? <Spinner size={18}/> : null } */}
              Add asset counter
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetCounter;
