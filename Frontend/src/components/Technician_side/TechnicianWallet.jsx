import TechnicianNavbar from "./NavbarPage";
import backgroundImage from "../../../public/images/HeaderBanner_2.png";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { useEffect, useState } from "react";
import userAxiosInstance from "../../Config/AxiosInstance/userInstance"; 
import { toast } from "sonner";
import Reveal from "../../../public/Animation/Animated";

const TechnicianWalletPage = () => {

  const { userDetails } = useUserDetails();
  const [walletDetails, setWalletDetails] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const walletInformation = await userAxiosInstance.get("/technician/wallet", { params: { user_id: userDetails.user_id } });
        setWalletDetails(walletInformation.data);
      } catch (error) {
        toast.error("Can't collect wallet information");
      };
    })();
  }, [userDetails.user_id]);

  return (
    <>
      <TechnicianNavbar />
      <nav className="bg-transparent shadow-none position-absolute ps-5 mt-5 w-100 z-index-2">
        <h6 className="font-weight-bolder mb-0 ms-2">Wallet</h6>
        <p className="text-sm mt-0 ms-2">Technician/ Wallet</p>
      </nav>
      {walletDetails && (
        <div className="container-fluid">
          <div className="page-header min-height-200 border-radius-xl mt-4" style={{ backgroundImage: `url(${backgroundImage})` }}>
          </div>
          <div className="card card-body blur-sm shadow-blur mx-4 mt-n6 overflow-hidden">
            <div className="col-xl-12 col-lg-12 col-md-12 d-flex flex-column" style={{ zIndex: "1" }}>
              <div className="row p-2">
                <p className="mb-1 ms-3 text-sm">Total Balance</p>
                <h2 className="mb-1 ms-3 text-primary">{walletDetails?.balanceAmount}.00<span className="text-sm ms-1 text-black-65">INR</span></h2>
              </div>
            </div>
          </div>
          <Reveal>
            <div className="container-fluid py-4">
              <div className="row">
                <div className="col-12 col-xl-4 mb-4">
                  <div className="card col-12 mt-3 min-height-200">
                    <div className="card-body p-3">
                      <div className="card-header pb-0 p-3">
                        <h6>Add to Wallet</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-8 mb-4">
                  <div className="card col-12 mt-3">
                    <div className="card-body p-3">
                      <div className="card-header pb-0 p-3">
                        <h6>transaction history</h6>
                      </div>
                      {walletDetails?.transactions.length === 0 ? (
                        <p className="text-center text-xs mb-6 mt-5">
                          <strong className='text-sm text-black-65'>Transactions is not found</strong>
                        </p>
                      ) : (
                        <div style={{ overflowY: "auto" }} className="mt-3 max-height-300">
                          <div className="card-body">
                            {walletDetails.transactions.map((transaction, index) => {
                              return (
                                <li key={index} className="list-group-item border-1 d-flex justify-content-between mb-2 border-radius-lg">
                                  <div className="d-flex flex-column">
                                    <h6 className="mb-1 text-dark text-sm">Service cost</h6>
                                    <span className="text-xs">{transaction?.dateTime}</span>
                                  </div>
                                  <div className="d-flex align-items-center text-sm font-weight-bold">+₹ {transaction?.amount}.00</div>
                                  <div className="d-flex align-items-center text-success text-sm font-weight-bold">{transaction?.transactionStatus}</div>
                                </li>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </>
  );
}

export default TechnicianWalletPage;