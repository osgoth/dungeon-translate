"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { BookA } from "lucide-react";

interface LanguageSelectProps {
  languages: string[];
  chooseLanguage: (lang: string) => void;
}


const LanguageSelect = ({ languages, chooseLanguage }: LanguageSelectProps) => {

  const [language, setLanguage] = useState("pseudo");

  useEffect(() => {
    chooseLanguage(language);
  }, [language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <BookA />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Choose language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
          {
            languages.map((lang, index) => {
              return <div key={index}>
                <DropdownMenuRadioItem value={lang}>{lang}</DropdownMenuRadioItem>
              </div>;
            })
          }
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelect;
