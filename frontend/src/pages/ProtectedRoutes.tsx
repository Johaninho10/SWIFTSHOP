import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

type User = {
  user: {};
};

type Store = {
  user: User;
};

const ProtectedRoutes = () => {
  const user = useSelector((store: Store) => store.user.user);

  if (user) {
    return (
      <div>
        <Outlet />
      </div>
    );
  } else if (user === false) {
    return <Navigate to={"/signin"}></Navigate>;
  }
};

export default ProtectedRoutes;
