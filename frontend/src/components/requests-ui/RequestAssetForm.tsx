import { Button } from "../ui/button";
import { startOfDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import CustomFormLabel from "./CustomFormLabel";

const RequestAssetForm = () => {
  const [openRequestedDate, setOpenRequestedDate] = useState(false);

  const requestAssetForm = useFormContext();

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={requestAssetForm.control}
        name="assetType"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel required>Asset Type</CustomFormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Hardware Issue">Hardware</SelectItem>
                    <SelectItem value="Software Issue">Software</SelectItem>
                    <SelectItem value="Network Issue">
                      Network Equipment
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={requestAssetForm.control}
        name="assetSpecification"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel required>Asset Specs or Model</CustomFormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Specify the model or type of asset you're requesting (e.g., Dell Latitude 7420, Adobe Creative Cloud)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={requestAssetForm.control}
        name="requestJustification"
        render={({ field }) => (
          <FormItem>
            <CustomFormLabel required>
              Justification for Request
            </CustomFormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Provide a justification for why you need this asset (e.g., new project requirement, additional equipment)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={requestAssetForm.control}
        name="requestDate"
        render={({ field }) => (
          <FormItem className="w-full sm:w-fit">
            <CustomFormLabel>Requested Date for Asset</CustomFormLabel>
            <FormControl>
              <Popover
                open={openRequestedDate}
                onOpenChange={setOpenRequestedDate}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>
                        Specify a date by which you need the asset, if
                        applicable.
                      </span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    onDayClick={() => setOpenRequestedDate(false)}
                    disabled={(date) => date < startOfDay(new Date())} // Disable past days
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default RequestAssetForm;
