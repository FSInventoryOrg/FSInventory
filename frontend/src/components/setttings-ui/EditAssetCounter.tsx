import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AssetCounterFormData,
  AssetCounterSchema,
} from "@/schemas/AssetCounterSchema";
import { AssetCounterType } from "@/types/asset";
import { useAppContext } from "@/hooks/useAppContext";
import * as imsService from "@/ims-service";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../Spinner";

interface EditAssetCounterProps {
  assetCounter: Partial<AssetCounterType>;
  onClose: (close: boolean) => void;
  onError: (message: string) => void;
}

const EditAssetCounter = ({
  assetCounter,
  onClose,
  onError,
}: EditAssetCounterProps) => {
  const form = useForm<z.infer<typeof AssetCounterSchema>>({
    resolver: zodResolver(AssetCounterSchema),
    defaultValues: {
    ...assetCounter,
    threshold: assetCounter.threshold ?? 1,
    counter: assetCounter.counter ?? 0,
  },
    mode: "onChange",
  });
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const {
    formState: { errors },
  } = form;

  const isValid = !Object.keys(errors).length;

  const { mutate, isPending } = useMutation({
    mutationFn: imsService.updateAssetCounter,
    onSuccess: async () => {
      showToast({
        message: 'Asset counter updated successfully!',
        type: 'SUCCESS',
      });
      queryClient.invalidateQueries({ queryKey: ['fetchAssetCounters'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setTimeout(() => {
        onClose(true);
      }, 100);
    },
    onError: (error: Error) => {
      onError(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof AssetCounterSchema>) => {
    const updatedAssetCounter: AssetCounterFormData & {
      _id: string | undefined;
    } = {
      ...data,
      prefixCode: data.prefixCode?.toUpperCase(),
      _id: assetCounter._id,
    };

    mutate({
      prefixCode: assetCounter.prefixCode as string,
      updatedAssetCounter,
    });
  };

  return (
    <>
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
                    className="cursor-default"
                    readOnly
                    disabled
                    autoComplete="off"
                    type="input"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This field cannot be edited</FormDescription>
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
                    className="uppercase"
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
                    type="input"
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                    {...field}
                    onChange={(event)=> {
                      const value = (event.target.value ?? '0').replace('-','')
                      field.onChange(value)}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="counter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Index Count</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="input"
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                    {...field}
                    onChange={(event)=> {
                      const value = (event.target.value ?? '0').replace('-','')
                      field.onChange(value)}}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid} className="gap-2 self-end">
            {isPending ? <Spinner size={18} /> : null}
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditAssetCounter;
