import { FormLabel } from "../ui/form";

interface CustomFormLabelProps {
  required?: boolean;
  children: React.ReactNode;
}
const CustomFormLabel = ({
  required = false,
  children,
}: CustomFormLabelProps) => {
  return (
    <>
      <FormLabel className="text-base font-semibold text-secondary-foreground">
        {children}{" "}
        {required ? (
          <span>*</span>
        ) : (
          <span className="text-base font-normal">(optional)</span>
        )}
      </FormLabel>
    </>
  );
};

export default CustomFormLabel;
