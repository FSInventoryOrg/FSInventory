import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as imsService from "@/ims-service";
import { useAppContext } from "@/hooks/useAppContext";
import { FormControl } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import {
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "../Spinner";
import TrashCan from "../graphics/TrashCan";
import ColorSelect from "./ColorSelect";
import { ColorOption, OptionType, TagOption } from "@/types/options";
import { AssetCounterType } from "@/types/asset";
import useAssetCounter from "./useAssetCounter";

interface OptionsProps {
  property: string;
  colorSelect?: boolean;
  tagSelect?: boolean;
  className?: string;
  type?: "Hardware" | "Software";
}

function isTypedOption(
  object: ColorOption | TagOption | string
): object is TagOption {
  if (typeof object === "string") return false;
  return "type" in object;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function format(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

const EditOptions = ({
  property,
  colorSelect = false,
  type,
  className,
}: OptionsProps) => {
  const [open, setOpen] = React.useState(false);
  const { showToast } = useAppContext();
  const [newOption, setNewOption] = React.useState<OptionType>({
    property: property,
    value: "",
  });
  const [optionToEdit, setOptionToEdit] = React.useState<string>("");
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [prefixCode, setPrefixCode] = React.useState<string>("");
  const [assetCounter, setAssetCounter] = React.useState<
    AssetCounterType | undefined
  >(undefined);
  const [newPrefixCode, setNewPrefixCode] = React.useState<string | null>(null);
  const [prefixCodeError, setPrefixCodeError] = React.useState<string>("");
  const [optionError, setOptionError] = React.useState<string>("");
  const propertyIsCategory: boolean = property === "category";

  const { data: optionValues, refetch: refetchOptions } = useQuery<
    string[] | ColorOption[] | TagOption[]
  >({
    queryKey: ["fetchOptionValues", property],
    queryFn: () => imsService.fetchOptionValues(property),
    enabled: open,
  });

  const {
    getAssetCounterFromCategory,
    updateAssetCounterInCache,
    refetch: refetchAssetCounters,
    assetCounters,
  } = useAssetCounter(propertyIsCategory, { property, value: optionToEdit });

  const [filterValue, setFilterValue] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<ColorOption[]>([]);

  const getOptionValue = (option: ColorOption | TagOption | string) => {
    if (typeof option === "string") {
      return option;
    } else if (typeof option === "object" && option.value) {
      return option.value;
    }
    return "";
  };

  const handleColorSelect = (color: string) => {
    if (newOption) {
      if (typeof newOption.value === "string") {
        const newColorOption: ColorOption = {
          value: newOption.value,
          color: color,
        };
        setNewOption({ ...newOption, value: newColorOption });
      } else {
        if (color === "") {
          const { value } = newOption.value;
          setNewOption({ ...newOption, value: value });
        } else {
          const updatedColorOption: ColorOption = {
            ...newOption.value,
            color: color,
          };
          setNewOption({ ...newOption, value: updatedColorOption });
        }
      }
    }
  };

  const handleUpdate = () => {
    if (newOption && optionValues && optionToEdit) {
      const indexOfValueToEdit = optionValues.findIndex((option) => {
        if (typeof option === "string") {
          return option === optionToEdit;
        } else if (typeof option === "object" && option.value) {
          return option.value === optionToEdit;
        }
        return false; // Filter out undefined or other non-matching types
      });
      updateOptionValue({
        property: newOption.property,
        value: newOption.value,
        index: indexOfValueToEdit,
      });
      updateAssetsByProperty({
        property: newOption.property,
        value: optionToEdit,
        newValue:
          typeof newOption.value === "object"
            ? newOption.value.value
            : newOption.value,
      });
      if (assetCounter && typeof newOption.value !== "string") {
        // CHECK IF BOTH CATEGORY NAME AND PREFIX CODE ARE CHANGED
        /**
         * These checks need to be done separately.
         * Ideally, the top-level if-statement should be removed and only the two
         * else-if statements should be their own independent if-statements.
         * When done that way, the updateAssetCounter function does not save the changes
         * properly in the case of both the category name and the prefix code being updated.
         */
        if (
          newOption.value.value !== assetCounter.category &&
          newPrefixCode &&
          assetCounter.prefixCode !== newPrefixCode
        ) {
          updateAssetCounter({
            prefixCode,
            updatedAssetCounter: {
              ...assetCounter,
              prefixCode: newPrefixCode,
              category: newOption.value.value,
            },
          });
          updateAssetPrefixCodes({
            property: "code",
            value: prefixCode,
            newValue: newPrefixCode,
          });
        }
        // CHECK IF ONLY THE CATEGORY NAME IS CHANGED
        else if (newOption.value.value !== assetCounter.category) {
          updateAssetCounter({
            prefixCode,
            updatedAssetCounter: {
              ...assetCounter,
              category: newOption.value.value,
            },
          });
        }
        // CHECK IF ONLY THE PREFIX CODE IS CHANGED
        else if (newPrefixCode && assetCounter.prefixCode !== newPrefixCode) {
          updateAssetCounter({
            prefixCode,
            updatedAssetCounter: {
              ...assetCounter,
              prefixCode: newPrefixCode,
            },
          });
          updateAssetPrefixCodes({
            property: "code",
            value: prefixCode,
            newValue: newPrefixCode,
          });
        }
        updateAssetCounterInCache(assetCounter._id!, {
          prefixCode: newPrefixCode!,
          category: newOption.value.value,
        });
      }
    }
  };

  const { mutate: addOptionValue, isPending: isAddPending } = useMutation({
    mutationFn: imsService.addOptionValue,
    onSuccess: async () => {
      showToast({
        message: `New ${property} added successfully!`,
        type: "SUCCESS",
      });
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
      }, 100);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const {
    mutate: updateOptionValue,
    isPending: isOptionEditPending,
    isSuccess: isOptionEditSuccess,
    reset: resetUpdateOptionValue,
  } = useMutation({
    mutationFn: imsService.updateOptionValue,
    onSuccess: async () => {
      showToast({
        message: `${capitalize(format(property))} updated successfully!`,
        type: "SUCCESS",
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const {
    mutate: updateAssetsByProperty,
    isPending: isAssetEditPending,
    isSuccess: isAssetEditSuccess,
    reset: resetUpdateAssetsByProperty,
  } = useMutation({
    mutationFn: imsService.updateAssetsByProperty,
  });

  const {
    mutate: updateAssetCounter,
    isPending: isUpdateAssetCounterPending,
    isSuccess: isUpdateAssetCounterSuccess,
    reset: resetUpdateAssetCounter,
  } = useMutation({
    mutationFn: imsService.updateAssetCounter,
  });
  const {
    mutate: updateAssetPrefixCodes,
    isPending: isAssetPrefixEditPending,
    isSuccess: isAssetPrefixEditSuccess,
    reset: resetUpdateAssetPrefixCodes,
  } = useMutation({
    mutationFn: imsService.updateAssetsByProperty,
    onSuccess: () => {
      showToast({
        message: "Affected assets successfully updated!",
        type: "SUCCESS",
      });
    },
  });

  const DeleteOption = () => {
    const { data: assetCount } = useQuery<number>({
      queryKey: ["fetchAssetCount", property, optionToEdit],
      queryFn: () => imsService.fetchAssetCount(property, optionToEdit),
    });

    const { mutate: deleteOption, isPending: isOptionDeletePending } =
      useMutation({
        mutationFn: () => imsService.deleteOption(property, optionToEdit),
      });

    const handleDelete = async () => {
      await deleteOption();
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
      }, 100);
      showToast({ message: "Option deleted successfully!", type: "SUCCESS" });
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2">
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent className="border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">
              {assetCount
                ? `Unable to delete ${format(property)}`
                : "Are you absolutely sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {assetCount ? (
                <>
                  There are {assetCount} assets with {format(property)} of{" "}
                  {optionToEdit}. Deleting this {format(property)} is not
                  allowed.
                </>
              ) : (
                <>
                  There are no assets with {format(property)} {optionToEdit}. It
                  is safe to delete this {format(property)}.
                </>
              )}
            </AlertDialogDescription>
            <TrashCan />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!assetCount && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isOptionDeletePending}
              >
                Delete {optionToEdit}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const resetUpdateMutations = () => {
    resetUpdateOptionValue();
    resetUpdateAssetsByProperty();
    resetUpdateAssetCounter();
    resetUpdateAssetPrefixCodes();
  };

  React.useEffect(() => {
    if (open) {
      setFilteredData(
        (optionValues ? optionValues : []).filter((option) => {
          const optionVal = getOptionValue(option).toLowerCase();
          const optionMatchesType =
            isTypedOption(option) && option.type === type;

          return (
            optionVal.includes(filterValue.toLowerCase()) &&
            (type ? optionMatchesType : true)
          );
        }) as ColorOption[] // Cast the filtered data to ColorOption[]
      );
      setIsCreating(false);
      setIsEditing(false);
    } else {
      setFilterValue("");
      setFilteredData([]);
      setNewOption({ property: property, value: "" });
      setPrefixCode("");
    }
  }, [open, filterValue, optionValues, property, type]);

  React.useEffect(() => {
    if (isEditing && propertyIsCategory && newOption) {
      const _assetCounter = getAssetCounterFromCategory() ?? undefined;
      if (_assetCounter) {
        setAssetCounter(_assetCounter);
      }
      const { prefixCode: oldPrefixCode } = assetCounter ?? { prefixCode: "" };
      setPrefixCode(oldPrefixCode);
      if (oldPrefixCode && newPrefixCode === null) {
        setNewPrefixCode(oldPrefixCode);
      }
    }
    if (!isEditing && propertyIsCategory && newOption) {
      setNewPrefixCode(null);
      setAssetCounter(undefined);
    }
  }, [
    newOption,
    isEditing,
    propertyIsCategory,
    getAssetCounterFromCategory,
    newPrefixCode,
    assetCounter,
  ]);

  React.useEffect(() => {
    if (newPrefixCode === "" || newPrefixCode === undefined) {
      setPrefixCodeError("Prefix code can not be empty");
    } else if (assetCounters && assetCounter) {
      const existing = assetCounters.find(
        (assetCounter) => assetCounter.prefixCode === newPrefixCode
      );
      if (!!existing && existing._id !== assetCounter._id) {
        setPrefixCodeError(`Prefix code ${newPrefixCode} is already assigned`);
      } else {
        setPrefixCodeError("");
      }
    }
    if (typeof newOption.value !== "string" && newOption.value.value === "") {
      setOptionError(`${capitalize(property)} name can not be empty`);
    } else {
      setOptionError("");
    }
  }, [
    setPrefixCodeError,
    setOptionError,
    newPrefixCode,
    newOption.value,
    property,
    assetCounters,
    assetCounter,
  ]);

  React.useEffect(() => {
    if (!propertyIsCategory && typeof newOption.value === "string") {
      if (!isOptionEditPending && isOptionEditSuccess) {
        resetUpdateMutations();
        refetchOptions();
        setIsEditing(false);
      }
    } else if (
      propertyIsCategory &&
      typeof newOption.value !== "string" &&
      assetCounter
    ) {
      const { prefixCode: scopedPrefixCode, category } = assetCounter;
      const { value: oldCategory } = newOption.value;
      if (!isOptionEditPending && isOptionEditSuccess) {
        if (
          (scopedPrefixCode === newPrefixCode && oldCategory === category) ||
          scopedPrefixCode === newPrefixCode
        ) {
          if (
            !isUpdateAssetCounterPending &&
            isUpdateAssetCounterSuccess &&
            !isAssetPrefixEditPending &&
            isAssetPrefixEditSuccess &&
            !isAssetEditPending &&
            isAssetEditSuccess
          ) {
            resetUpdateMutations();
            refetchOptions();
            refetchAssetCounters();
            setIsEditing(false);
          }
        } else if (oldCategory !== category) {
          if (!isUpdateAssetCounterPending && isUpdateAssetCounterSuccess) {
            resetUpdateMutations();
            refetchOptions();
            refetchAssetCounters();
            setIsEditing(false);
          }
        }
      }
    }
  }, [
    isOptionEditPending,
    isOptionEditSuccess,
    isAssetEditPending,
    isAssetEditSuccess,
    isUpdateAssetCounterPending,
    isUpdateAssetCounterSuccess,
    isAssetPrefixEditPending,
    isAssetPrefixEditSuccess,
    assetCounter,
    newPrefixCode,
    newOption.value,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger className={cn(className)} asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn("justify-between text-muted-foreground")}
          >
            Edit {`${format(type ?? "")} ${format(property)}`} options
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent side="top">
        <div
          className="cursor-pointer absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => {
            if (isCreating) setIsCreating(false);
            else if (isEditing) setIsEditing(false);
            else setOpen(false);
            setNewOption({ property: property, value: "" });
            setPrefixCode("");
          }}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </div>
        {!isCreating && !isEditing && (
          <div id={`main-${property}-panel`} className={"flex flex-col gap-2"}>
            <h1 className="w-full text-center font-semibold text-sm">
              {capitalize(format(property))}
            </h1>
            <div className="flex items-center">
              <Input
                defaultValue=""
                type="input"
                className="focus-visible:ring-0 focus-visible:ring-popover"
                onChange={(e) => {
                  setFilterValue(e.target.value);
                }}
                placeholder="Search..."
              />
            </div>
            <ScrollArea className="h-[225px] justify-center flex align-middle">
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((value, index) => (
                  <div key={index} className="flex items-center gap-1 my-1.5">
                    <div
                      className={
                        "w-full text-sm justify-start focus-visible:ring-0 focus-visible:ring-popover focus-visible:bg-accent h-8 rounded-sm ml-1"
                      }
                    >
                      <span className="max-w-28 overflow-hidden text-ellipsis">
                        {typeof value === "object" ? value.value : value}
                      </span>
                    </div>
                    {colorSelect && (
                      <div
                        className="h-3 w-3 min-w-3 rounded-full"
                        style={{
                          backgroundColor: value.color
                            ? value.color
                            : "#8d8d8d",
                        }}
                      />
                    )}
                    <Button
                      className="mr-3 w-10 h-8"
                      variant="ghost"
                      type="button"
                      size="icon"
                      onClick={() => {
                        setNewOption({ property: property, value: value });
                        setOptionToEdit(
                          typeof value === "object" ? value.value : value
                        );
                        setIsEditing(!isEditing);
                      }}
                    >
                      <PencilIcon size={16} />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex text-sm text-muted-foreground items-center justify-center gap-1 my-1.5">
                  No results.
                </div>
              )}
            </ScrollArea>
            <Button
              className="h-8"
              variant="secondary"
              type="button"
              onClick={() => {
                setIsCreating(!isCreating);
                setNewOption({ property: property, value: "" });
              }}
            >
              Create a new {format(property)}
            </Button>
          </div>
        )}
        {isCreating && (
          <div id={`create-${property}-panel`} className="flex flex-col gap-3">
            <div className="items-center flex flex-row">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute h-10 w-10"
                onClick={() => {
                  setIsCreating(!isCreating);
                  setNewOption({ property: property, value: "" });
                  setPrefixCode("");
                }}
              >
                <ChevronLeftIcon />
              </Button>
              <h1 className="w-full flex justify-center items-center font-semibold text-sm h-10">
                Create {format(property)}
              </h1>
            </div>
            <Label>{capitalize(property)}</Label>
            <Input
              value={
                typeof newOption.value === "object"
                  ? newOption.value.value
                  : newOption.value
              }
              type="input"
              className="focus-visible:ring-0 focus-visible:ring-popover"
              onChange={(e) => {
                const newValue = e.target.value;
                if (typeof newOption === "object") {
                  setNewOption((prevOption) => {
                    const updatedValue =
                      typeof prevOption.value === "object"
                        ? { ...prevOption.value, value: newValue }
                        : newValue;
                    return { ...prevOption, value: updatedValue };
                  });
                } else {
                  setNewOption({ property: property, value: newValue });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setOpen(!open);
                }
              }}
            />
            {property === "category" && (
              <>
                <Label>Prefix Code</Label>
                <Input
                  value={prefixCode}
                  type="input"
                  className="focus-visible:ring-0 focus-visible:ring-popover"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setPrefixCode(newValue.toUpperCase().trim());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setOpen(!open);
                    }
                  }}
                />
              </>
            )}
            {colorSelect && (
              <ColorSelect
                onColorSelect={handleColorSelect}
                reset={isEditing || isCreating}
              />
            )}
            <Separator className="my-1" />
            <Button
              className="gap-2"
              disabled={isAddPending}
              type="button"
              onClick={() => {
                if (newOption) {
                  if (property === "category") {
                    addOptionValue({ ...newOption, prefixCode, type });
                  } else {
                    addOptionValue(newOption);
                  }
                }
              }}
            >
              {isAddPending ? <Spinner size={18} /> : null}
              Create
            </Button>
          </div>
        )}
        {isEditing && (
          <div id={`edit-${property}-panel`} className="flex flex-col gap-3">
            <div className="items-center flex flex-row">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute h-10 w-10"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setNewOption({ property: property, value: "" });
                  setPrefixCode("");
                }}
              >
                <ChevronLeftIcon />
              </Button>
              <h1 className="w-full flex justify-center items-center font-semibold text-sm h-10">
                Edit {format(property)}
              </h1>
            </div>
            <Label>{capitalize(property)}</Label>
            <Input
              value={
                typeof newOption.value === "object"
                  ? newOption.value.value
                  : newOption.value
              }
              type="input"
              className="focus-visible:ring-0 focus-visible:ring-popover"
              onChange={(e) => {
                const newValue = e.target.value;
                if (typeof newOption === "object") {
                  setNewOption((prevOption) => {
                    const updatedValue =
                      typeof prevOption.value === "object"
                        ? { ...prevOption.value, value: newValue }
                        : newValue;
                    return { ...prevOption, value: updatedValue };
                  });
                } else {
                  setNewOption({ property: property, value: newValue });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setOpen(!open);
                }
              }}
            />
            <>
              {optionError && (
                <div className="text-xs text-destructive font-semibold">
                  {optionError}
                </div>
              )}
            </>
            {propertyIsCategory && newPrefixCode !== null && (
              <>
                <Label>Prefix Code</Label>
                <Input
                  value={newPrefixCode}
                  type="input"
                  className="focus-visible:ring-0 focus-visible:ring-popover"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setNewPrefixCode(newValue.toUpperCase().trim());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
                {prefixCodeError && (
                  <div className="text-xs text-destructive font-semibold">
                    {prefixCodeError}
                  </div>
                )}
              </>
            )}
            {colorSelect && (
              <ColorSelect
                onColorSelect={handleColorSelect}
                property={property}
                option={optionToEdit}
              />
            )}
            <Separator className="my-1" />
            <div className="flex justify-between">
              <Button
                className="gap-2"
                disabled={
                  isOptionEditPending ||
                  isAssetEditPending ||
                  (newPrefixCode === prefixCode &&
                    typeof newOption.value !== "string" &&
                    newOption.value.value === optionToEdit) ||
                  !!optionError ||
                  !!prefixCodeError ||
                  isUpdateAssetCounterPending ||
                  isAssetPrefixEditPending
                }
                type="button"
                onClick={handleUpdate}
              >
                {(isOptionEditPending ||
                  isAssetEditPending ||
                  isUpdateAssetCounterPending ||
                  isAssetPrefixEditPending) && <Spinner size={18} />}
                {
                  <>
                    {isAssetEditPending && !isOptionEditPending
                      ? " Updating assets"
                      : "Save"}
                  </>
                }
              </Button>
              <DeleteOption />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default EditOptions;
