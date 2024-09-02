import React from 'react'
import Banner from "../../components/User_side/Home/Banner";
import SecondRow from "../../components/User_side/Home/SecondRow";
import UserNavbar from '../../components/User_side/NavbarPage';
import Footer from '../../components/Common/Footer';
import LastRaw from '../../components/User_side/Home/LastRow';

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