import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type CQDDropdownType = {
  id: number;
  name: string;
  value: string | number; // Disallow boolean or undefined
};

const SplurjjDropDownSelector = ({
  list,
  selectedValue,
  onValueChange,
  placeholderText,
}: {
  list: CQDDropdownType[];
  selectedValue: string | number | undefined;
  onValueChange: (value: string | number) => void;
  placeholderText?: string;
}) => {
  return (
    <Select
      // Show placeholder when selectedValue is undefined or empty
      value={
        selectedValue !== "" && selectedValue !== undefined
          ? selectedValue.toString()
          : undefined
      }
      onValueChange={(val) => {
        const numVal = Number(val);
        onValueChange(isNaN(numVal) ? val : numVal);
      }}
    >
      <SelectTrigger className="h-[40px] w-[100px] bg-white border border-[#E6E6E6] rounded-[8px] text-[#0E2A5C] dark:text-black text-base focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
        <SelectValue
          className="placeholder:text-primary dark:text-black"
          placeholder={placeholderText ?? "Select"}
        />
      </SelectTrigger>
      <SelectContent className="w-fit *:p-0 bg-white h-[120px]">
        <SelectGroup>
          {list
            .filter((item) => item.value !== "" && item.value !== undefined)
            .map((item) => (
              <SelectItem
                key={item.id}
                value={item.value.toString()}
                className="text-[#0E2A5C] font-normal text-[16px] leading-normal"
              >
                {item.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SplurjjDropDownSelector;
