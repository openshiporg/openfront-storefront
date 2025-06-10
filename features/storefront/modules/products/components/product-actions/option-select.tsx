import { cn } from "@/lib/utils" 
import React from "react"
import { onlyUnique } from "../../../../lib/util/only-unique";
// Removed HttpTypes import

// Add this size order mapping at the top of the file
const SIZE_ORDER = {
  "XXS": 1,
  "XS": 2,
  "S": 3,
  "M": 4,
  "L": 5,
  "XL": 6,
  "XXL": 7,
  "XXXL": 8
};

// Define inline types based on GraphQL schema
type ProductOptionValueInfo = {
  id: string;
  value: string;
};

type ProductOptionInfo = {
  id: string;
  name?: string | null; // Correct field name from schema
  productOptionValues: ProductOptionValueInfo[];
};

type OptionSelectProps = {
  option: any; // Relax type to any
  current: string | undefined;
  updateOption: (update: any) => void; // Accept update object
  title: string;
  disabled?: boolean;
  "data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  // Change the filtering and sorting logic
  const filteredOptions = option.productOptionValues
    .map((v) => v.value) // Remove explicit any
    .filter(onlyUnique)
    .sort((a: string, b: string) => {
      // If it's a size option, use the size order mapping
      if (title.toLowerCase() === "size") {
        return (SIZE_ORDER[a as keyof typeof SIZE_ORDER] || 999) - (SIZE_ORDER[b as keyof typeof SIZE_ORDER] || 999);
      }
      // For other options, use alphabetical sorting
      return a.localeCompare(b);
    });

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption({ [option.id]: v })}
              key={v}
              className={cn(
                "border-border bg-muted border text-xs leading-5 font-normal h-10 rounded-md p-2 flex-1 ",
                {
                  "border-primary ring-1 ring-primary": v === current,
                  "hover:shadow-md transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
