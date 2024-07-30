import React from 'react'
import TechnicianProfileCard from '../../components/User_side/TechnicianProfileCard';
import UserNavbar from '../../components/User_side/NavbarPage';
import Footer from "../../components/Common/Footer";

const TechniciansListPage = () => {
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
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                     <TechnicianProfileCard />
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   )
}

export default TechniciansListPage;