import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Message from "./components/MessageComponent";
import { Textarea } from "../../components/ui/textarea";
import { RoomEvents } from "../../components/enums/RoomEvents";
import { ButtonTextArea } from "../../components/ui/button.textarea";
// import { socket } from "../../config/socket/socket";
import type { RootState } from "../../config/redux/store";

import { io } from "socket.io-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { SendHorizonalIcon } from "lucide-react";
import LanguageSelect from "./components/LanguageSelectComponent";
import { Input } from "../../components/ui/input";

const socket = io("http://localhost:3000");

const ChatPage = () => {

  const user = useSelector((state: RootState) => {return state;});

  const [message, setMessage] = useState<string>("");


  const [messageReceived, setMessageReceived] = useState<{
    userId: string;
    message: string;
    userName: string;
    timestamp: Date;
    language: string;
    alphabet: { [letter: string]: string; };
    isTranslated: boolean;
  }[]>([]);

  useEffect(() => {
    console.log(user);
    socket.connect();


    socket.emit(RoomEvents.JoinRoom, user.roomNumber);
    // socket.emit(RoomEvents.JoinRoom, user.roomNumber);

    socket.on(RoomEvents.ReceiveMessage, (data) => {
      console.log(data);
      setMessageReceived((prev) => {return [...prev, data];});
    });

    return () => {
      socket.off(RoomEvents.ReceiveMessage);
    };

  }, []);

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);


  const submitMessage = (event: any) => {
    event.preventDefault();
    socket.emit(RoomEvents.SendMessage, {
      userName: user.userName,
      message: message,
      roomName: user.roomNumber,
      timestamp: new Date().toISOString(),
      language: "pseudo"
    });
    setMessage("");

  };


  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 font-sans">
        <Card className="w-full h-screen flex flex-col mb-0 pb-0 rounded-t-xl">
          <CardHeader className="border-b dark:border-gray-800 flex-shrink-0">
            <CardTitle>Room: {user.roomNumber}</CardTitle>
            <CardDescription>A real-time chat with {user.userName} and others.</CardDescription>
          </CardHeader>

          <CardContent className="flex-grow p-6 overflow-y-auto">
            <div className="space-y-6">
              {messageReceived.map((msg, index) => {
                const isCurrentUser = msg.userId === socket.id;
                const dict = msg.alphabet;
                return (
                  <div
                    key={index}
                    className={`flex items-end gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >

                    {/* Message bubble */}
                    <div className={`flex flex-col space-y-1 max-w-xs md:max-w-md`}>
                      <div
                        className={`rounded-xl px-4 py-2 text-sm md:text-base ${
                          isCurrentUser
                            ? "bg-blue-200 text-gray-900 rounded-br-none"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-bl-none"
                        }`}
                      >
                        <span
                          className="text-left text-xs"
                        >
                          {msg.userName}
                        </span>
                        <Message
                          message={msg.message}
                          dict={dict}
                          isTranslated={msg.isTranslated}
                        />
                        <span className={`text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? "text-right" : "text-left"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <form>
            <CardFooter className="p-0 border-1 dark:border-gray-800 bg-gray-10 border-bl-1 rounded-t-lg">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  className="flex-1 min-h-0 w-full rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed resize-y"
                  value={message}
                  onChange={(e) => {return setMessage(e.target.value);}}
                  placeholder="Type your message here."
                />
                <LanguageSelect />


                <Input onClick={submitMessage}
                  type="submit"
                  className="rounded-full font-lg items-center justify-center h-10 w-10 mr-2 hover:bg-gray-100 "
                  placeholder="=>"
                  value=">"
                >
                  {/* <SendHorizonalIcon /> */}
                </Input>
              </div>
            </CardFooter>
          </form>


        </Card >

      </div>
    </>
  );
};


export default ChatPage;
