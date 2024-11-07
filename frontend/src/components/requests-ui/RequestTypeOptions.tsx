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
const RequestTypeOptions = ({ value, onChange }: RequestTypeOptionsProps) => {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="flex flex-row gap-4">
        <RadioContainer
          id="reportIssue"
          value="Report an Issue"
          selectedValue={value}
        >
          <RequestTypeTitle>Report an Issue</RequestTypeTitle>
          <RequestTypeDetails>
            For issues with hardware, software, and your network
          </RequestTypeDetails>
        </RadioContainer>
        <RadioContainer
          id="requestAsset"
          value="Request a New Asset"
          selectedValue={value}
        >
          <RequestTypeTitle>Request a New Asset</RequestTypeTitle>
          <RequestTypeDetails>
            For requesting new hardware or software assets
          </RequestTypeDetails>
        </RadioContainer>
      </div>
    </RadioGroup>
  );
};

export default RequestTypeOptions;
