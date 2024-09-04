import React from 'react'
import Banner from "../../Components/User_side/Home/Banner";
import SecondRow from "../../Components/User_side/Home/SecondRow";
import UserNavbar from '../../Components/User_side/NavbarPage'; 
import Footer from '../../Components/common/Footer'; 
import LastRaw from '../../Components/User_side/Home/LastRow';

const UserHomePage = () => {
  return (
    <>
      <UserNavbar />
      <Banner />
      <SecondRow />
      <LastRaw />
      <Footer />
    </>
  )
}

export default UserHomePage