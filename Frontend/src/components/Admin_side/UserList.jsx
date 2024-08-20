import { useEffect, useState } from "react";
import BackgroundShape from "../Common/backgroundShape";
import { toast } from "sonner";
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import adminAxiosInstance from "../../config/AxiosInstance/adminInstance";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import backgroundImage from "../../../public/images/Login&RegisterBackground.jpg";

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
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="text-white font-weight-bolder mb-0 ms-2">Instant-Fix Users</h6>
        <p className="text-light text-sm text-white mt-0 ms-2">Admin/ users</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <span className="mask bg-gradient-primary opacity-5"></span>
        </div>
        <div className="card card-body blur shadow-blur mx-4 mb-5 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            <div className="container-fluid">
              {usersArray.length !== 0 ? (
                <>
                  <div className="card-header pb-0 mb-3 mt-3">
                    <h5 className="text-center mb-4">All users</h5>
                  </div>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3"  style={{maxHeight:"300px"}}>
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
                </>
              ) : (
                <h5 className="mt-7 text-dark">No users found.</h5>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserList;