import React, { useEffect, useState } from 'react'
import TechnicianProfileCard from '../../components/User_side/TechnicianProfileCard';
import UserNavbar from '../../components/User_side/NavbarPage';
import Footer from "../../components/Common/Footer";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";

const TechniciansListPage = () => {
  const [techniciansArray, setTechniciansArray] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        const techniciansList = JSON.parse(sessionStorage.getItem("techniciansList"));
        if (!techniciansList) {
          const responseDetails = await userAxiosInstance.get(`/fetchTechnician?user_id=${userDetails.user_id}`);
          setTechniciansArray(responseDetails.data);
          sessionStorage.setItem("techniciansList", JSON.stringify(responseDetails.data));
        } else {
          setTechniciansArray(techniciansList)
        }
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login", { state: { message: "Authorization failed please login" } });
        } else {
          console.log(error);
          toast.warning("Something wrong please try again later");
        }
      }
    })();
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="d-flex col-12">
        <div className="col-lg-3 mt-5 ps-5">
          <div className="col-10">
            <div className="card" style={{ height: "98vh" }}>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="container mt-5 col-12 d-flex justify-content-end">
            <div className="colg-lg-3 col-md-5 col-sm-12 col-12">
              <input type="text" className='form-control' placeholder='Search Technician or Category' />
            </div>
          </div>
          <div className="pe-5">
            <div className="row d-flex justify-content-start">
              {techniciansArray.map((technician) => {
                return (
                  <TechnicianProfileCard key={technician.user_id} technicianData={technician} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TechniciansListPage;