import NoAccessPermission from "../components/NoAccessPermission";
import UserTable from "../features/users/UserTable";
import { useAuthStore } from "../services/redux/slices/useAuthStore";

function Users() {
  const isUserAdmin = useAuthStore((state) => state.isAdmin());
  return isUserAdmin ? <UserTable /> : <NoAccessPermission />;
}

export default Users;
