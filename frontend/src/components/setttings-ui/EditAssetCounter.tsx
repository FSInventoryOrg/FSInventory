import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AssetCounterFormData,
  AssetCounterSchema,
} from "@/schemas/AssetCounterSchema";
import { AssetCounter } from "@/types/asset";
import { useAppContext } from "@/hooks/useAppContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface EditAssetCounterProps {
  assetCounter: Partial<AssetCounter>;
  onClose: (close: boolean) => void;
}

const defaultValues: Partial<AssetCounter> = {
  prefixCode: "",
  threshold: 0,
};

const EditAssetCounter = ({ assetCounter, onClose }: EditAssetCounterProps) => {
  const form = useForm<z.infer<typeof AssetCounterSchema>>({
    resolver: zodResolver(AssetCounterSchema),
    defaultValues: assetCounter,
    mode: "onBlur",
  });
  const { showToast } = useAppContext();

  const onSubmit = (data: z.infer<typeof AssetCounterSchema>) => {
    console.log(data);
    const updatedAssetCounter: AssetCounterFormData & { _id: string } = {
      ...data,
      _id: assetCounter._id,
    };
    console.log(updatedAssetCounter);
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
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditAssetCounter;
