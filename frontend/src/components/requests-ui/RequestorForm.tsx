import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RequestorForm = () => {
  const { control } = useFormContext();
  const managers = ["Rodney Fernandez", "John Doe"]; // NOTE: to be replaced with actual data
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      <p className="font-normal text-muted-foreground">
                        Select manager
                      </p>
                    }
                  >
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager} value={manager}>
                      {manager}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
