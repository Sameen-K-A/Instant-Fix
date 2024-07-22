import React from 'react'
import TechnicianProfileCard from '../../components/User_side/TechnicianProfileCard';
import UserNavbar from '../../components/User_side/NavbarPage';

const TechniciansListPage = () => {
   return (
      <>
         <UserNavbar />
         <div className="container mt-5">
            <input type="text" className="form-control" placeholder="Name or Category" />
         </div>
         <div className="container mb-5">
            <div className="row d-flex">
               <TechnicianProfileCard />
               <TechnicianProfileCard />
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
      </>
   )
}

export default TechniciansListPage;