export type Defaults = {
  status?: string;
  category?: string;
  equipmentType?: string;
  deployableStatus: string[];
  retrievableStatus: string;
  inventoryColumns?: string[];
}

export type ColorOption = {
  value: string;
  color?: string;
};

export type TagOption = {
  value: string;
  properties?: string[];
  type: string;
};

export type OptionType = {
  property: string;
  value: string | ColorOption | TagOption;
};

