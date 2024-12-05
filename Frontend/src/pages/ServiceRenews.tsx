import NoAccessPermission from "../components/NoAccessPermission";
import ServiceRenewsTable from "../features/service-renews/ServiceRenewsTable";
import { useAuthStore } from "../services/redux/slices/useAuthStore";

function ServiceRenews() {
  const isUserAdmin = useAuthStore((state) => state.isAdmin());
  return isUserAdmin ? <ServiceRenewsTable /> : <NoAccessPermission />;
}

export default ServiceRenews;
