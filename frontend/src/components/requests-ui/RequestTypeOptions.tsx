import { RadioGroup } from "../ui/radio-group";
import RadioContainer from "./RadioContainer";

interface TextProps {
  children: React.ReactNode;
}
const RequestTypeTitle = ({ children }: TextProps) => {
  return <h1 className="text-base font-semibold">{children}</h1>;
};
const RequestTypeDetails = ({ children }: TextProps) => {
  return <p className="text-sm font-normal">{children}</p>;
};

interface RequestTypeOptionsProps {
  value: string;
  onChange: (value: string) => void;
}

const REQUEST_TYPES = [
  {
    id: "Issue Report",
    title: "Report an Issue",
    details: "For issues with hardware, software, and your network",
  },
  {
    id: "Asset Request",
    title: "Request a New Asset",
    details: "For requesting new hardware or software assets",
  },
];

const RequestTypeOptions = ({ value, onChange }: RequestTypeOptionsProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="flex flex-col sm:flex-row gap-4">
        {REQUEST_TYPES.map((requestType) => (
          <RadioContainer
            id={requestType.id}
            key={requestType.id}
            value={requestType.id}
            selectedValue={value}
          >
            <RequestTypeTitle>{requestType.title}</RequestTypeTitle>
            <RequestTypeDetails>{requestType.details}</RequestTypeDetails>
          </RadioContainer>
        ))}
      </div>
    </RadioGroup>
  );
};

export default RequestTypeOptions;
