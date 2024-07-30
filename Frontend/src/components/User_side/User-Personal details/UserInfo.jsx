import { useEffect, useState } from "react";
import { Base_URL } from "../../../config/credentials";

const UserInformation = () => {

   const [isEdit, setIsEdit] = useState(false);
   const [userDetails, setUserDetails] = useState({});
   useEffect(() => {
      setUserDetails(JSON.parse(sessionStorage.getItem("userDetails")));
   }, []);

   return (
      <div className="col-12 col-xl-4 mb-4">
         <div className="card min-height-200">
            <div className="card-header pb-0 p-3">
               <h6 className="mb-0 mt-3 text-center">Personal Information</h6>
            </div>
            <div className="card-body p-3">
               {userDetails && (
                  <div className="mt-3">
                     {isEdit ? (
                        <>
                           <input type="text" className="form-control mt-1" placeholder="Name" defaultValue={userDetails?.name} />
                           <input type="text" className="form-control mt-3" placeholder="Phone Number" defaultValue={userDetails?.phone} />
                           <div className="ms-auto mt-3 text-end">
                              <button className="btn text-xs btn-outline-dark border-radius-xl me-1" onClick={() => setIsEdit(false)}>Cancel</button>
                              <button className="btn text-xs bg-gradient-primary border-radius-xl">Save</button>
                           </div>
                        </>
                     ) : (
                        <>
                           <li className="list-group-item border-0 d-flex p-4 mb-2 mt-3 bg-gray-100 border-radius-lg">
                              <div className="d-flex flex-column">
                                 <h6 className="mb-3 text-sm">{userDetails?.name}</h6>
                                 <span className="mb-2 text-xs text-dark">{userDetails?.email}</span>
                                 <span className="mb-2 text-xs text-dark">+91 {userDetails?.phone}</span>
                              </div>
                              <div className="ms-auto text-end">
                                 <button className="btn text-xs btn-outline-dark border-radius-xl p-1 px-4 me-1" onClick={() => setIsEdit(true)}>Edit</button>
                              </div>
                           </li>
                        </>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default UserInformation;