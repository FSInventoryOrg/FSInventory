import { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { capitalize, format } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "../Spinner";
import ColorSelect from "./ColorSelect";
import DeletePropertyDialog from "./DeletePropertyDialog";
import { OptionType } from "@/types/options";
import useOption from "./useOptions";
import useAssetCounter from "./useAssetCounter";
import { AssetCounterType } from "@/types/asset";
import { useAppContext } from "@/hooks/useAppContext";

interface EditOptionProps {
  option: OptionType;
  property: string;
  colorSelect?: boolean;
  tagSelect?: boolean;
  className?: string;
  onCancel: () => void;
  onDelete: (optionToDelete: string) => void;
  onUpdate: (
    updatedOption: OptionType,
    updatedAssetCounter?: AssetCounterType & { oldPrefixCode: string }
  ) => void;
  isUpdatePending: boolean;
  onEnterPressed?: () => void;
}

const EditOption = ({
  option,
  property,
  colorSelect,
  onCancel,
  onDelete,
  onUpdate,
  isUpdatePending,
  onEnterPressed,
}: EditOptionProps) => {
  const [openDeleteOptionDialog, setOpenDeleteOptionDialog] = useState(false);
  const isObject: boolean = typeof option.value === "object";
  const propertyIsCategory: boolean = property === "category";
  const [newPrefixCode, setNewPrefixCode] = useState("");
  const [prefixCodeError, setPrefixCodeError] = useState("");
  const [optionError, setOptionError] = useState("");
  const { showToast } = useAppContext();

  const isCategoryType = useMemo(() => property === "category", [property]);

  const {
    newOption: editedOption,
    setNewOption: setEditedOption,
    handleColorSelect,
    getOptionValue,
  } = useOption(option);

  const { updateAssetCounterInCache, assetCounters, assetCounter } =
    useAssetCounter(propertyIsCategory, option);

  const { prefixCode: oldPrefixCode } = assetCounter ?? { prefixCode: "" };

  const handleCancel = () => {
    onCancel();
    setEditedOption({ property, value: "" });
  };

  const handleCategoryUpdate = () => {
    const category: string =
      typeof editedOption.value === "object" ? editedOption.value.value : "";

    if (assetCounter && category) {
      const isCategoryNameChanged = category !== assetCounter.category;
      const isPrefixCodeChanged: boolean =
        !!newPrefixCode && oldPrefixCode !== newPrefixCode;

      if (isPrefixCodeChanged && isCategoryNameChanged) {
        onUpdate(editedOption, {
          ...assetCounter,
          category,
          prefixCode: newPrefixCode,
          oldPrefixCode,
        });
        // CHECK IF ONLY THE CATEGORY NAME IS CHANGED
      } else if (isCategoryNameChanged) {
        onUpdate(editedOption, {
          ...assetCounter,
          category,
          oldPrefixCode,
        });
        // CHECK IF ONLY THE PREFIX CODE IS CHANGED
      } else if (isPrefixCodeChanged) {
        onUpdate(editedOption, {
          ...assetCounter,
          prefixCode: newPrefixCode,
          oldPrefixCode,
        });
      }
      updateAssetCounterInCache(assetCounter._id!, {
        prefixCode: newPrefixCode,
        category,
      });
    }
  };

  const handleUpdate = () => {
    if (optionError) {
      throw new Error(`${capitalize(property)} name can not be empty`);
    }
    if (isCategoryType) {
      handleCategoryUpdate();
    } else {
      onUpdate(editedOption);
    }
  };

  const optionToEdit = getOptionValue(editedOption.value);

  useEffect(() => {
    if (propertyIsCategory && newPrefixCode === "") {
      setNewPrefixCode(oldPrefixCode);
    }
  }, [propertyIsCategory, assetCounter, oldPrefixCode, newPrefixCode]);

  useEffect(() => {
    if (!isCategoryType) return;
    // if (isAssetCounterLoading) return;

    if (newPrefixCode === "" || newPrefixCode === undefined) {
      setPrefixCodeError("Prefix code can not be empty");
    } else if (assetCounters && assetCounter) {
      const isDuplicatePrefixCode = assetCounters.find(
        (ac: AssetCounterType) =>
          ac.prefixCode === newPrefixCode && ac._id !== assetCounter._id
      );
      if (isDuplicatePrefixCode) {
        setPrefixCodeError(`Prefix code ${newPrefixCode} is already assigned`);
      } else {
        setPrefixCodeError("");
      }
    } else {
      setPrefixCodeError("");
    }
  }, [
    newPrefixCode,
    isCategoryType,
    assetCounters,
    assetCounter,
    // isAssetCounterLoading,
  ]);

  useEffect(() => {
    if (getOptionValue(editedOption.value) === "") {
      setOptionError(`${capitalize(format(property))} name can not be empty`);
    } else {
      setOptionError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedOption.value, property]);

  return (
    <>
      <div className="items-center flex flex-row">
        {/* Back button  */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute h-10 w-10"
          onClick={handleCancel}
        >
          <ChevronLeftIcon />
        </Button>
        <h1 className="w-full flex justify-center items-center font-semibold text-sm h-10">
          Edit {capitalize(format(property))}
        </h1>
      </div>
      <Label>{capitalize(property)}</Label>
      <Input
        value={getOptionValue(editedOption.value) as string}
        type="input"
        className="focus-visible:ring-0 focus-visible:ring-popover"
        onChange={(e) => {
          setEditedOption({
            property: property,
            value: isObject
              ? { ...(option.value as object), value: e.target.value }
              : e.target.value,
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnterPressed?.();
          }
        }}
      />
      {(optionError || newPrefixCode === undefined) && (
        <div className="text-xs text-destructive font-semibold">
          {optionError}
        </div>
      )}
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
                onEnterPressed?.();
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
          option={optionToEdit as string}
        />
      )}
      <Separator className="my-1" />
      <div className="flex justify-between">
        <Button
          className="gap-2"
          disabled={!!prefixCodeError || !!optionError || isUpdatePending}
          type="button"
          onClick={() => {
            try {
              handleUpdate();
            } catch (err: any) {
              showToast({ message: err.message, type: "ERROR" });
            }
          }}
        >
          {isUpdatePending ? <Spinner size={18} /> : null}
          Save
        </Button>
        <Button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md 
    text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
    disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
          onClick={(event) => {
            event.preventDefault();
            setOpenDeleteOptionDialog(true);
          }}
        >
          Delete
        </Button>
        <DeletePropertyDialog
          open={openDeleteOptionDialog}
          setOpen={setOpenDeleteOptionDialog}
          property={property}
          value={optionToEdit as string}
          onDelete={() => onDelete(optionToEdit as string)}
        />
      </div>
    </>
  );
};

export default EditOption;
