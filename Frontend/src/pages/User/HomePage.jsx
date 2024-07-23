import React from 'react'
import Banner from "../../components/User_side/Home/Banner";
import SecondRow from "../../components/User_side/Home/SecondRow";
import ThirdRow from "../../components/User_side/Home/ThirdRow";
import UserNavbar from '../../components/User_side/NavbarPage';

const UserHomePage = () => {
  return (
    <>
      <UserNavbar />
      <Banner />
      <SecondRow />
      <ThirdRow />
    </>
  )
}

export default UserHomePage