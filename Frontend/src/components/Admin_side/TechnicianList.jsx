import { useEffect, useState } from "react";
import BackgroundShape from "../Common/backgroundShape";
import axios from "axios";
import { Base_URL } from "../../config/credentials";
import { toast } from "sonner";
import AdminNavbar from "./AdminNavbar";
import confirmAlert from "../Common/SweetAlert/confirmAlert";

const AdminTechnicianList = () => {
  const [techniciansArray, setTechniciansArray] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${Base_URL}/admin/fetchTechnicians`);
        console.log(response.data);
        setTechniciansArray(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong, can't fetch users data. Please try again later");
      }
    })();
  }, []);

  const unblockUser = (user_id) => {
    confirmAlert("Do you want to unblock the technician")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await axios.patch(`${Base_URL}/admin/unblockUser?user_id=${user_id}`);
            const afterUnblocking = techniciansArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: false } : user
            );
            setTechniciansArray(afterUnblocking);
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong, can't un-block user.");
          }
        }
      })
  };

  const blockUser = async (user_id) => {
    confirmAlert("Do you want to block this technician")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await axios.patch(`${Base_URL}/admin/blockUser?user_id=${user_id}`);
            const afterblocking = techniciansArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: true } : user
            );
            setTechniciansArray(afterblocking);
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong, can't block users data.");
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
                {techniciansArray ? (
                  <div className="card mb-4 mt-6">
                    <div className="card-header pb-0 mb-3 mt-3">
                      <h5 className="text-center mb-3">Technicians</h5>
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
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Profession</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
                              <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {techniciansArray.map((technician, index) => {
                              return (
                                <tr key={technician.user_id}>
                                  <td><p className="text-xs font-weight-bold mb-0">{index + 1}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{technician?.name}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{technician?.email}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{technician?.phone}</p></td>
                                  <td><p className="text-xs font-weight-bold mb-0">{technician?.technicianDetails[0]?.profession}</p></td>
                                  <td className="text-sm">{technician.isBlocked ? (
                                    <span className="badge badge-sm bg-gradient-faded-danger">Blocked</span>
                                  ) : (
                                    <span className="badge badge-sm bg-gradient-faded-success">Active</span>
                                  )}</td>
                                  <td className=" text-sm">{technician.isBlocked ? (
                                    <button className="btn bg-gradient-info mb-0" onClick={() => unblockUser(technician.user_id)}>UnBlock</button>
                                  ) : (
                                    <button className="btn btn-outline-primary mb-0" onClick={() => blockUser(technician.user_id)}>Block</button>
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
                  <h5>No Technicians found.</h5>
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

export default AdminTechnicianList;