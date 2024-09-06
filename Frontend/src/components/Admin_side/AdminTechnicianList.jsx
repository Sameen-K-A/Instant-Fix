import { useEffect, useState } from "react";
import { toast } from "sonner";
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import adminAxiosInstance from "../../config/axiosInstance/adminInstance"
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import NoResultFoundImage from "../../../public/images/NoResultFound.png";
import Reveal from "../../../public/Animation/Animated";

const AdminTechnicianList = () => {
  const [orginalArray, setOrginalArray] = useState([]);
  const [techniciansArray, setTechniciansArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await adminAxiosInstance.get(`/fetchTechnicians`);
        setOrginalArray(response.data);
        setTechniciansArray(response.data);
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
    confirmAlert("Do you want to unblock the technician")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await adminAxiosInstance.patch(`/unblockUser?user_id=${user_id}`);
            const afterUnblocking = techniciansArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: false } : user
            );
            setTechniciansArray(afterUnblocking);
            const afterUnblockingOrginal = orginalArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: false } : user
            );
            setOrginalArray(afterUnblockingOrginal);
          } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
              navigate("/admin", { state: { message: "Authorization failed please login" } });
            } else {
              toast.warning("Something wrong please try again later");
            }
          }
        }
      })
  };

  const blockUser = async (user_id) => {
    confirmAlert("Do you want to block this technician")
      .then(async (response) => {
        if (response.isConfirmed) {
          try {
            await adminAxiosInstance.patch(`/blockUser?user_id=${user_id}`);
            const afterblocking = techniciansArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: true } : user
            );
            setTechniciansArray(afterblocking);
            const afterblockingOrginal = orginalArray.map((user) =>
              user.user_id === user_id ? { ...user, isBlocked: true } : user
            );
            setOrginalArray(afterblockingOrginal);
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

  const searchTechnician = (e) => {
    const searchInput = e.target.value;
    if (searchInput.trim().length) {
      const afterSearch = orginalArray.filter((technician) =>
        technician.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setTechniciansArray(afterSearch);
    } else {
      setTechniciansArray(orginalArray);
    }
  };

  return (
    <>
      <AdminNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Instant-Fix Technicians</h6>
        <p className="text-sm mt-0 ms-2">Admin/ technicians</p>
      </nav>
      <div className="container-fluid">
        <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
        </div>
        <div className="card card-body blur-sm shadow-blur mx-4 mb-2 mt-n6 overflow-hidden">
          <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column">
            <div className="container-fluid">
              <div className="card-header pb-0 mt-3 mb-5 col-lg-5 col-12 ms-auto">
                <input type="text" className="form-control ms-3" placeholder="Search technician . . ." onChange={(e) => searchTechnician(e)} />
              </div>
              {techniciansArray.length !== 0 ? (
                <Reveal>
                  <div className="card-body px-0 pt-0 pb-2">
                    <div className="table-responsive p-0 pb-3" style={{ maxHeight: "300px" }}>
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
                                <td><p className="text-xs font-weight-bold mb-0">{technician?.technicianDetails?.profession}</p></td>
                                <td className="text-sm">{technician.isBlocked ? (
                                  <span className="badge badge-sm bg-gradient-faded-danger">Blocked</span>
                                ) : (
                                  <span className="badge badge-sm bg-gradient-faded-success">Active</span>
                                )}</td>
                                <td className=" text-sm">{technician.isBlocked ? (
                                  <button className="btn bg-gradient-primary mb-0" onClick={() => unblockUser(technician.user_id)}>UnBlock</button>
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
                </Reveal>
              ) : (
                <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
                  <img src={NoResultFoundImage} alt="No result found" className='mb-0' width={"300px"} />
                  <p className='text-center text-bold'>Sorry, no results found!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminTechnicianList;