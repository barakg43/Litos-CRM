import AppProviders from "./app/AppProviders";
import AppRoutes from "./app/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import "./styles/pollen.css";
import StandardErrorBoundary from "./components/StandardErrorBoundary";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <StandardErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProviders>
    </StandardErrorBoundary>
  );
}

export default App;
