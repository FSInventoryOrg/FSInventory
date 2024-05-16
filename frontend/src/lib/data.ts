import { Tag as TagType } from "../components/ui/tag-input";

export interface Color {
  id: string;
  color: string;
}

export const COLORS: Color[] = [
  { id: '1', color: '#33CC80' },
  { id: '2', color: '#fac415' },
  { id: '3', color: '#D02F2F' },
  { id: '4', color: '#8d8d8d' },
  { id: '5', color: '#006241' },
  { id: '6', color: '#9E6F21' },
  { id: '7', color: '#FB4F7A' },
  { id: '8', color: '#6A8CFF' },
  { id: '9', color: '#A5CD27' },
  { id: '10', color: '#FF5733' },
  { id: '11', color: '#8326CB' },
  { id: '12', color: '#4FE1FB' },
];

export const PROPERTIES: TagType[] = [
  { id: "code", text: "Code" },
  { id: "category", text: "Category" },
  { id: "status", text: "Status" },
  { id: "brand", text: "Brand" },
  { id: "modelName", text: "Model Name" },
  { id: "modelNo", text: "Model No." },
  { id: "serialNo", text: "Serial No." },
  { id: "processor", text: "Processor" },
  { id: "memory", text: "Memory" },
  { id: "storage", text: "Storage" },
  { id: "assignee", text: "Assignee" },
  { id: "purchaseDate", text: "Purchase Date" },
  { id: "serviceInYears", text: "Service in Years" },
  { id: "supplierVendor", text: "Supplier/Vendor" },
  { id: "pezaForm8105", text: "PEZA Form (8105)" },
  { id: "pezaForm8106", text: "PEZA Form (8106)" },
  { id: "isRGE", text: "Is RGE" },
  { id: "equipmentType", text: "Equipment Type" },
  { id: "deploymentDate", text: "Deployment Date" },
  { id: "recoveredFrom", text: "Recovered From" },
  { id: "recoveryDate", text: "Recovery Date" },
  { id: "client", text: "From Client" },
  { id: "remarks", text: "Remarks"},
  { id: "deploymentActions", text: "Deployment Actions"},
];