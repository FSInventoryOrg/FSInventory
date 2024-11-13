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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import CustomFormLabel from "./CustomFormLabel";

const RequestAssetForm = () => {
  const [openRequestedDate, setOpenRequestedDate] = useState(false);

  const requestAssetForm = useFormContext();
  const assetTypes = [
    {
      value: "hardware",
      label: "Hardware Asset",
      caption: "Test device, mouse, laptop, monitor, etc.",
    },
    {
      value: "software",
      label: "Software Asset",
      caption: "Office 365, Adobe Suite, VPN software",
    },
    {
      value: "network",
      label: "Network Equipment",
      caption: "Router, switch, etc.",
    },
  ];

  const findOptionByValue = (
    options: Record<string, string>[],
    value: string
  ) => options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={requestAssetForm.control}
        name="assetType"
        render={({ field }) => (
          <FormItem className="sm:w-1/2 pr-2">
            <CustomFormLabel required>Asset Type</CustomFormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      <span className="text-muted-foreground">
                        Select asset type
                      </span>
                    }
                  >
                    {field.value
                      ? findOptionByValue(assetTypes, field.value)?.label
                      : "Select a category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {assetTypes.map((assetType) => (
                      <SelectItem key={assetType.value} value={assetType.value}>
                        <div className="flex flex-col">
                          <span>{assetType.label}</span>
                          <span className="text-sm text-gray-500">
                            {assetType.caption}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
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
          <FormItem className="sm:w-1/2 pr-2">
            <CustomFormLabel required>Asset Specs or Model</CustomFormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Specify the model or type of asset you're requesting"
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
            <FormDescription>
              Provide a justification for why you need this asset (e.g., new
              project requirement, additional equipment)
            </FormDescription>
            <FormControl>
              <Textarea {...field} placeholder="Enter justification" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={requestAssetForm.control}
        name="requestDate"
        render={({ field }) => (
          <FormItem className="w-full">
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
                      "flex w-full sm:w-1/2 pr-2 pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Select date</span>
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
