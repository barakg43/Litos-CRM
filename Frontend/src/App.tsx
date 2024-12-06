import AppProviders from "./app/AppProviders";
import CustomRouter from "./app/CustomRouter";
import "./styles/pollen.css";

function App() {
  return (
    <AppProviders>
      <CustomRouter />
      {/* <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter> */}
    </AppProviders>
  );
}

export default App;
