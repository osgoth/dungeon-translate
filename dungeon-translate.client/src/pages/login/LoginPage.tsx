import  { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useDispatch } from "react-redux";
import { setUserName, setLanguages, setRoomNumber, setUserId, setUserRole } from "../../components/slices/user/user.slice";
import { useNavigate } from "react-router";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import LanguageMultiSelect from "./components/LanguageMultiSelectComponent";
import axios from "axios";
import env from "../../config/app.config";

const LoginPage = () => {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState<string>("");
  const [userNameChosen, setUserNameChosen] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");

  const dispatch = useDispatch();

  const handleLogin = async () => {
    const user = await axios.post(`${env.apiUrl}/api/login`, {
      userName: userNameChosen,
      password: userPassword
    });
    if (user.status !== 200) {
      alert("User data incorrect");
      return;
    }

    dispatch(setUserId(user.data._id));
    dispatch(setUserRole(user.data.role));
    dispatch(setLanguages(user.data.languagesKnown));
    dispatch(setUserName(user.data.userName));
    dispatch(setRoomNumber(roomName));

    navigate("/chat", {replace: true});
  };

  return (

    <div>

      <div className={cn("flex flex-col gap-6 justify-center justify-items-center")}>
        <Card className="rounded-xl ">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
            Enter your User Name and Passwird below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label>User Name</Label>
                  <Input
                    type="text"
                    value={userNameChosen}
                    onChange={(e) => {return setUserNameChosen(e.target.value);}}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Room number</Label>
                  <Input
                    type="text"
                    value={roomName}
                    onChange={(e) => {return setRoomName(e.target.value);}}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password"
                    value={userPassword}
                    onChange={(e) => { return setUserPassword(e.target.value); }}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleLogin} className="w-full">
                  Login
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default LoginPage;
