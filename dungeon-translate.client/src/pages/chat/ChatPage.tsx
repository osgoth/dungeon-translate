import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "./components/MessageComponent";
import { Textarea } from "../../components/ui/textarea";
import { RoomEvents } from "../../components/enums/RoomEvents";
import type { RootState } from "../../config/redux/store";
import { io } from "socket.io-client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Languages, Send } from "lucide-react";
import LanguageSelect from "./components/LanguageSelectComponent";
import { Button } from "../../components/ui/button";
import env from "../../config/app.config";


const socket = io(env.apiUrl);

const ChatPage = () => {

  const user = useSelector((state: RootState) => {return state;});

  const [message, setMessage] = useState<string>("");

  const [messageReceived, setMessageReceived] = useState<{
    userId: string;
    message: string;
    userName: string;
    timestamp: Date;
    language: string;
    isTranslated: boolean;
  }[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [language, setLanguage] = useState("pseudo");

  useEffect(() => {
    socket.connect();

    socket.emit(RoomEvents.JoinRoom, user.roomNumber);

    socket.on(RoomEvents.ReceiveMessage, (data) => {
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messageReceived]);


  const submitMessage = (event: any) => {
    event.preventDefault();
    if (!message)
      return;
    socket.emit(RoomEvents.SendMessage, {
      userName: user.userName,
      message: message,
      roomName: user.roomNumber,
      timestamp: new Date().toISOString(),
      language: language
    });
    setMessage("");

  };

  return (
    <>
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 font-sans">
        <Card className="w-full h-screen flex flex-col mb-0 pb-0 rounded-t-xl">
          <CardHeader className="border-b dark:border-gray-800 flex-shrink-0">
            <CardTitle>Room: {user.roomNumber}</CardTitle>
          </CardHeader>

          <CardContent className="flex-grow p-6 overflow-y-auto" ref={chatContainerRef}>
            <div className="space-y-6">
              {messageReceived.map((msg, index) => {

                const isCurrentUser = msg.userId === user.userName;

                return (
                  <div key={index} className="rounded p-2 ">
                    <div className="flex justify-between">
                      <p className="text-left text-s font-light bg-stone-200 rounded-lg p-1 mb-3 w-fit px-2">
                        {msg.userName}
                      </p>
                      {
                        isCurrentUser ?
                          <Button className="bg-white border hover:bg-gray-100">
                            <Languages color="#212121" />
                          </Button>
                          : <div></div>
                      }
                    </div>
                    <div className="bg-[url(https://www.stateofartacademy.com/wp-content/uploads/2020/03/72_iter_6.jpg)] bg-cover text-gray-900  shadow-md shadow-gray-500/20 text-shadow border-brown-800">
                      <Message
                        message={msg.message}
                        langugage={msg.language}
                        isTranslated={msg.isTranslated}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-right w-fit">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>

                  </div>
                );
              })}
            </div>
          </CardContent>

          <div>
            <CardFooter className="p-0 border-1 dark:border-gray-800 bg-gray-10 border-bl-1 rounded-t-lg">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  className="resize-none flex-1 min-h-0 w-full rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed"
                  value={message}
                  onChange={(e) => {return setMessage(e.target.value);}}
                  placeholder="Type your message here."
                />
                <LanguageSelect languages={user.languages} chooseLanguage={setLanguage}/>
                <Button onClick={submitMessage}
                  type="submit"
                  className="rounded-full font-lg items-center justify-center h-10 w-10 mr-2 hover:bg-gray-100 align-center bg-white border-1">
                  <Send color="#212121"/>
                </Button>
              </div>
            </CardFooter>
          </div>


        </Card >

      </div>
    </>
  );
};


export default ChatPage;
