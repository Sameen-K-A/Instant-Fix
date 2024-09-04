import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnicianProfileCard from '../../Components/User_side/TechnicianProfileCard';
import UserNavbar from '../../Components/User_side/NavbarPage';
import Footer from '../../Components/common/Footer'; 
import userAxiosInstance from '../../config/axiosInstance/userInstance'; 
import { toast } from 'sonner';
import NoResultFoundImage from "../../../public/images/NoResultFound.png";
import { useUserDetails } from "../../Contexts/UserDetailsContext"
import Reveal from '../../../public/Animation/Animated';

const TechniciansListPage = () => {
  const [primaryTechniciansList, setPrimaryTechnicianList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [techniciansArray, setTechniciansArray] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState([]);
  const professions = ["Painter", "Welder", "Electrician", "Plumber", "Automobile Mechanic", "AC Mechanic", "Carpenter"];
  const district = ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"];
  const navigate = useNavigate();
  const { userDetails } = useUserDetails();

  useEffect(() => {
    (async () => {
      try {
        if (!userDetails) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
          return;
        };
        const responseDetails = await userAxiosInstance.get(`/fetchTechnician?user_id=${userDetails.user_id}`);
        setPrimaryTechnicianList(responseDetails.data);
        setTechniciansArray(responseDetails.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          console.log(error);
          toast.warning("Something went wrong, please try again later");
        };
      };
    })();
  }, [navigate]);

  useEffect(() => {
    let afterFiltering = primaryTechniciansList;

    if (selectedDistrict.length !== 0) {
      afterFiltering = afterFiltering.filter((data) => {
        return selectedDistrict.includes(data?.addressDetails?.district);
      });
    };

    if (selectedProfession.length !== 0) {
      afterFiltering = afterFiltering.filter((data) => {
        return selectedProfession.includes(data?.technicianDetails?.profession);
      });
    };

    if (searchInput.length !== 0) {
      afterFiltering = afterFiltering.filter((data) => {
        return data.name.toLowerCase().includes(searchInput.toLowerCase()) || data?.technicianDetails?.profession.toLowerCase().includes(searchInput.toLowerCase());
      })
    };

    setTechniciansArray(afterFiltering)
  }, [searchInput, selectedDistrict, selectedProfession, primaryTechniciansList]);

  const handleChangeDistrict = (event) => {
    const { value, checked } = event.target;
    if (checked === true) {
      setSelectedDistrict([...selectedDistrict, value]);
    } else {
      const afterUnchecked = selectedDistrict.filter((district) => district !== value);
      setSelectedDistrict(afterUnchecked);
    };
  };

  const handleSelectProfessions = (event) => {
    const { value, checked } = event.target;
    if (checked === true) {
      setSelectedProfession([...selectedProfession, value]);
    } else {
      const afterUnselect = selectedProfession.filter((profession) => profession !== value);
      setSelectedProfession(afterUnselect);
    };
  };

  return (
    <>
      <UserNavbar />
      <div className="d-flex col-12 pe-4" style={{ overflow: 'hidden', minHeight: '88vh' }}>
        <div className="col-lg-3 col-12 col-sm-6 mt-5 ps-5">
          <div className="col-11">
            <div className="card" style={{ minHeight: "100vh", padding: "20px" }}>

              <div className=" mt-5">
                <h6>Profession</h6>
                <ul className='d-flex flex-column mt-3 ps-0 ms-0'>
                  {professions.map((pro, index) => {
                    return (
                      <li key={index + 1} className='d-inline-block d-flex mb-1' >
                        <input type="checkbox" id={pro} value={pro} onChange={(e) => handleSelectProfessions(e)} />
                        <label htmlFor={pro} className="ms-2 text-sm">{pro}</label>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className=" mt-3">
                <h6>Location</h6>
                <ul className='d-flex flex-column mt-3 ps-0 ms-0'>
                  {district.map((dist, index) => {
                    return (
                      <li key={index + 1} className='d-inline-block d-flex mb-1' >
                        <input type="checkbox" id={dist} value={dist} onChange={(e) => handleChangeDistrict(e)} />
                        <label htmlFor={dist} className="ms-2 text-sm">{dist}</label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-12 pe-5">
          <div className="container p-0 mt-5 col-12 d-flex justify-content-end">
            <div className="col-lg-3 col-12">
              <input type="text" className='form-control' placeholder='Search Technician or Category' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
          </div>
          <Reveal>
            <div className="col-12">
              {techniciansArray.length === 0 ? (
                <div className='d-flex flex-column justify-content-center align-items-center mt-8'>
                  <img src={NoResultFoundImage} alt="No result found" className='mb-0' width={"400px"} />
                  <p className='text-center text-bold'>Sorry, no results found!</p>
                </div>
              ) : (
                <div className="row d-flex justify-content-start">
                  {techniciansArray.map((technician) => {
                    return (
                      technician.technicianDetails?.availability && (
                        <TechnicianProfileCard key={technician.user_id} technicianData={technician} />
                      )
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TechniciansListPage;