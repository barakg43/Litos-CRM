import AppProviders from "./app/AppProviders";
import AppRoutes from "./app/AppRoutes";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
