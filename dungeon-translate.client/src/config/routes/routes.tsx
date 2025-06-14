import { createBrowserRouter, RouterProvider } from "react-router";

import ChatPage from "../../pages/chat/ChatPage";
import LoginPage from "../../pages/login/LoginPage";



const Routes = () => {

  const publicRoutes = [
    {
      path: "/login",
      element: <LoginPage />
    },
    {
      path: "/chat",
      element: <ChatPage />
    },
    {
      path: "*",
      element: <LoginPage />
    }

  ];


  const router = createBrowserRouter([...publicRoutes]);
  return <RouterProvider router={router} />;

};
export default Routes;