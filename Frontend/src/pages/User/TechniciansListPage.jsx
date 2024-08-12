import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianProfileCard from '../../components/User_side/TechnicianProfileCard';
import UserNavbar from '../../components/User_side/NavbarPage';
import Footer from "../../components/Common/Footer";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { toast } from 'sonner';
import GetCurrentLocation from '../../components/Common/CurrentLocation';

const TechniciansListPage = () => {
  const [techniciansArray, setTechniciansArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (!userDetails) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
          return;
        }
        const responseDetails = await userAxiosInstance.get(`/fetchTechnician?user_id=${userDetails.user_id}`);
        setTechniciansArray(responseDetails.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          console.log(error);
          toast.warning("Something went wrong, please try again later");
        }
      }
    })();
  }, [navigate]);

  return (
    <>
      <UserNavbar />
      <div className="d-flex col-12" style={{ overflow: 'hidden', minHeight: '88vh' }}>
        <div className="col-lg-3 mt-5 ps-5">
          <div className="col-10">
            <div className="card" style={{ height: "100vh" }}>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="container p-0 mt-5 col-12 d-flex justify-content-between">
            <GetCurrentLocation />
            <div className="col-lg-3 col-md-5 col-sm-12 col-12">
              <input type="text" className='form-control' placeholder='Search Technician or Category' />
            </div>
          </div>
          <div className="pe-5">
            <div className="row d-flex justify-content-start">
              {techniciansArray.map((technician) => {
                return (
                  technician.technicianDetails[0].availability && (
                    <TechnicianProfileCard key={technician.user_id} technicianData={technician} />
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TechniciansListPage;