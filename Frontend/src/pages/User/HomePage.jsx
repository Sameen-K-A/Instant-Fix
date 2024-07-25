import React from 'react'
import Banner from "../../components/User_side/Home/Banner";
import SecondRow from "../../components/User_side/Home/SecondRow";
import ThirdRow from "../../components/User_side/Home/ThirdRow";
import UserNavbar from '../../components/User_side/NavbarPage';
import Footer from '../../components/Common/Footer';
import FourthRaw from '../../components/User_side/Home/FourthRow';

const UserHomePage = () => {
  return (
    <>
      <UserNavbar />
      <Banner />
      <SecondRow />
      <FourthRaw />
      <ThirdRow />
      <Footer />
    </>
  )
}

export default UserHomePage