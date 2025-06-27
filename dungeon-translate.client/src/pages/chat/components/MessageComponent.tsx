import React, { useState } from "react";
import { Button } from "../../../components/ui/button";


interface MessageProps {
    message: string;
    dict: {
        [letter: string]: string;
    };
    isTranslated: boolean;
}


const Message: React.FC<MessageProps> = ({message, dict, isTranslated }) => {
// const Message = ({message: string, dict: { [letter: string]: string }}) => {
  const [translated, setTranslated] = useState(isTranslated);

  return (
    <p className="text-left text-s font-light">
      {
        !translated?
          message
            .toLowerCase()
            .split("")
            .map((character) => {
              if (!(character in dict)) {
                return character;
              }

              return dict[character];
            }).join("") :
          message
      }

      {/* <Button variant={"outline"}
        onClick={() => {return setTranslated(!translated);}}
      >
        Translate
      </Button> */}
    </p>
  );
};
export default Message;
