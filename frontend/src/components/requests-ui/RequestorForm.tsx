import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const RequestorForm = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-2">
      {/* Autopopulate if logged in */}
      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-secondary-foreground font-normal text-base">
              Full Name
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-secondary-foreground font-normal text-base">
              Manager
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contactInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-secondary-foreground font-normal text-base">
              Contact Information
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="johndoe@fullscale.ph or +63 912 345 6789"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RequestorForm;
