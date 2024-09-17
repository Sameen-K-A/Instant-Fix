import { useEffect, useState } from "react";
import Reveal from "../../../public/Animation/Animated";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import userAxiosInstance from "../../Config/AxiosInstance/userInstance"; 
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { Star } from "../../../public/svgs/Icons";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const TechnicianFeedbacks = () => {

  const [ratingDetails, setRatingDetails] = useState([]);
  const { userDetails, setUserDetails } = useUserDetails();
  const navigate = useNavigate();
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await userAxiosInstance.get("/technician/fetchningRatingWithReviewerDetails", { params: { technicianUser_id: userDetails.user_id } });
        setRatingDetails(response.data.reviews);
        if (response.data.technicianRating.rating !== userDetails.technicianDetails[0].rating) {
          console.log("its working");
          const afterFindingTechnicianRating = { ...userDetails, technicianDetails: [{ ...userDetails.technicianDetails[0], rating: response.data.technicianRating.rating }] }
          setUserDetails(afterFindingTechnicianRating);
          localStorage.setItem("userDetails", JSON.stringify(afterFindingTechnicianRating));
        };
      } catch (error) {
        if (error.response.status === 401) {
          setIsLogged(false);
          navigate("/login", { state: { message: "Authorization failed, please login" } });
        } else {
          toast.error("Something went wrong, please try again later.");
        }
      };
    })();
  }, []);

  return (
    <div className="col-12 col-xl-4 mb-4">
      <div className="card card-body py-2">
        <Reveal>
          <h6 className="mb-0 mt-3 text-center">Feedbacks</h6>
          {ratingDetails.length === 0 ? (
            <div className="card-body p-5">
              <p className="text-center text-xs mb-6 mt-6"><strong className='text-sm'>No Feedbacks founded </strong></p>
            </div>
          ) : (
            <div className="p-1" style={{ overflowY: 'auto', maxHeight: "470px" }}>
              {ratingDetails.map((feedback, index) => {
                return (
                  <li className="list-group-item border-0 d-flex p-3 mb-1 mt-3 bg-gray-100 border-radius-lg align-items-center" key={index + 1}>
                    <a className="avatar rounded-circle me-3">
                      <img alt="Image placeholder" src={`${feedback?.reviewerProfileIMG}`} />
                    </a>
                    <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-bold text-sm m-0">{feedback.reviewerName}</p>
                        <p className="text-xs mt-1 m-0">{feedback.review}</p>
                        <p className="text-xs mt-1 m-0">{[1, 2, 3, 4, 5].map((value) => (
                          <strong key={value} className='me-1'>{value <= feedback?.starCount ? <Star color={"#ffbb00"} size={"10"} /> : <Star size={"10"} />}</strong>
                        ))}</p>
                      </div>
                      <p className="text-xs m-0 text-black-50">{feedback.date}</p>
                    </div>
                  </li>
                )
              })}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  )
}

export default TechnicianFeedbacks;