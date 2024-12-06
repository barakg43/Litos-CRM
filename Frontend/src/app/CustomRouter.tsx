import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppRoutes from "./AppRoutes";

export const router = createBrowserRouter(
  [{ path: "*", element: <AppRoutes /> }],
  {
    basename: import.meta.env.BASE_URL,
  }
);

function CustomRouter() {
  return <RouterProvider router={router} />;
}

export default CustomRouter;
