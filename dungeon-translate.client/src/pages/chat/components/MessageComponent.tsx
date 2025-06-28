import React, { useState } from "react";
import "../../../assets/fonts/fonts.css";

interface MessageProps {
  message: string;
  langugage: string;
  isTranslated: boolean;
}


const Message: React.FC<MessageProps> = ({ message, langugage, isTranslated }) => {

  const langToFont: {[key: string]: string} = {
    pseudo: "RedactedScript",
    Infernal: "Daedra",
    Dwarvish: "Dwarvish",
    Elvish: "Elvish",
    Draconic: "Draconic"
  };

  const [translated, setTranslated] = useState(isTranslated);

  return (
    <p className="px-3 py-2 text-left text-s font-normal bg-[#FCF5E5]/85 text-gray-900 "
      style={{
        fontFamily: translated ? "" : langToFont[langugage],
        fontSize: translated ? "" : 20
      }}>
      {message}
    </p>
  );
};
export default Message;
