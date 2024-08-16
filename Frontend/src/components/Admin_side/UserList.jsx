import { useEffect, useState } from "react";
import BackgroundShape from "../Common/backgroundShape";
import { toast } from "sonner";
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import adminAxiosInstance from "../../config/AxiosInstance/adminInstance";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminUserList = () => {
  const [usersArray, setUsersArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await adminAxiosInstance.get(`/fetchUser`);
        setUsersArray(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/admin", { state: { message: "Authorization failed please login" } });
        } else {
          console.log(error);
          toast.warning("Something wrong please try again later");
        }
      }
    })();
  }, []);

  const unblockUser = (user_id) => {
    confirmAlert("Do you want to unblock the user")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await adminAxiosInstance.patch(`/unblockUser?user_id=${user_id}`);
            const afterUnblocking = usersArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: false } : user
            );
            setUsersArray(afterUnblocking);
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/admin", { state: { message: "Authorization failed please login" } });
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      })
  };

  const blockUser = async (user_id) => {
    confirmAlert("Do you want to block this user")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await adminAxiosInstance.patch(`/blockUser?user_id=${user_id}`);
            const afterblocking = usersArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: true } : user
            );
            setUsersArray(afterblocking);
          } catch (error) {
            if (error.response.status === 401) {
              navigate("/admin", { state: { message: "Authorization failed please login" } });
            } else {
              console.log(error);
              toast.warning("Something wrong please try again later");
            }
          }
        }
      })
  }

  return (
    <>
      <AdminNavbar />
      <div className="page-header min-vh-75">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
              <div className="container-fluid">
                {usersArray ? (
                  <div className="card mb-4 mt-6">
                    <div className="card-header pb-0 mb-3 mt-3">
                      <h5 className="text-center mb-3">Users</h5>
                    </div>
                    <div className="card-body px-0 pt-0 pb-2">
                      <div className="table-responsive p-0 pb-3">
                        <table className="table align-items-center mb-0">
                          <thead>
                            <tr>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">SL</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Phone</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {usersArray.map((user, index) => {
                              return (
                                <tr key={user.user_id}>
                                  <td><p className="text-xs font-weight-bold mb-0">{index + 1}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{user?.name}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{user?.email}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{user?.phone}</p></td>
                                  <td className="text-sm">{user.isBlocked ? (
                                    <span className="badge badge-sm bg-gradient-faded-danger w-50">Blocked</span>
                                  ) : (
                                    <span className="badge badge-sm bg-gradient-faded-success w-50">Active</span>
                                  )}</td>
                                  <td className=" text-sm">{user.isBlocked ? (
                                    <button className="btn bg-gradient-primary mb-0 w-50" onClick={() => unblockUser(user.user_id)}>UnBlock</button>
                                  ) : (
                                    <button className="btn btn-outline-primary mb-0 w-50" onClick={() => blockUser(user.user_id)}>Block</button>
                                  )}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h5>No users found.</h5>
                )}
              </div>
            </div>
            <BackgroundShape />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserList;