import React from 'react'
import Banner from "../../components/User_side/Home/Banner";
import SecondRow from "../../components/User_side/Home/SecondRow";
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
      <Footer />
    </>
  )
}

export default UserHomePage