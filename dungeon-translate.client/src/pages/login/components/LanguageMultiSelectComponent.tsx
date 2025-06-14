import React, { useCallback, useEffect, useRef, useState } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "../../../components/ui/command";
import { Badge } from "../../../components/ui/badge";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";


type Language = Record<"value" | "label", string>;

interface LanguageMultiSelectProps {
    setFormatLanguages: (languagesRaw: Record<"value" | "label", string>[]) => void
}

const Languages = [
  {
    value: "Dwarvish",
    label: "Dwarvish",
  },
  {
    value: "Elvish",
    label: "Elvish",
  },
  {
    value: "Giant",
    label: "Giant",
  },
  {
    value: "Gnomish",
    label: "Gnomish",
  },
  {
    value: "Goblin",
    label: "Goblin",
  },
  {
    value: "Halfling",
    label: "Halfling",
  },
  {
    value: "Orc",
    label: "Orc",
  },
  {
    value: "Draconic",
    label: "Draconic",
  },
  {
    value: "Infernal",
    label: "Infernal",
  },
] satisfies Language[];

const LanguageMultiSelect = (props: LanguageMultiSelectProps) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Language[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    props.setFormatLanguages(selected);
  }, [selected]);

  const handleUnselect = useCallback((language: Language) => {
    setSelected((prev) => { return prev.filter((s) => { return s.value !== language.value; }); });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = Languages.filter(
    (language) => {return !selected.includes(language);},
  );


  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((language) => {
            return (
              <Badge key={language.value} variant="secondary" className={"cursor-pointer"}
                onClick={() => {return handleUnselect(language);}}
              >
                {language.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(language);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {return setOpen(false);}}
            onFocus={() => {return setOpen(true);}}
            placeholder="Select languages..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((language) => {
                  return (
                    <CommandItem
                      key={language.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => { return [...prev, language]; });
                      }}
                      className={"cursor-pointer"}
                    >
                      {language.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
};

export default LanguageMultiSelect;