import { Request, Response } from "express";
import TechnicianService from "../Services/technicianService";
import { slotType } from "../interfaces";
import HTTP_statusCode from "../Enums/httpStatusCode";

const technicianService = new TechnicianService();

class TechnicianController {

  async joinNewTechnicianController(req: Request, res: Response): Promise<void> {
    try {
      const user_id: string = req.query.user_id as string;
      const profession: string = req.query.profession as string;
      const serviceResult = await technicianService.joinNewTechnicianService(user_id, profession);
      res.status(HTTP_statusCode.OK).json(serviceResult);
    } catch (error) {
      console.log("error from controll ", error);
      res.status(HTTP_statusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  async changeProfessionController(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, profession } = req.body;
      await technicianService.changeProfessionService(user_id, profession);
      res.status(HTTP_statusCode.OK).send("Changes commit successfully");
    } catch (error: any) {
      if (error.message === "No changes found") {
        res.status(HTTP_statusCode.NoChange).json({ message: "No changes found" });
      } else {
        res.status(HTTP_statusCode.InternalServerError).json(error);
      }
    }
  };

  async changeAvailabilityStatusController(req: Request, res: Response) {
    try {
      const { user_id, newStatus } = req.body;
      await technicianService.changeAvailabilityStatusService(user_id, newStatus);
      res.status(HTTP_statusCode.OK).send("Changes completed successfully");
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).json(error);
    }
  };

  async fetchTechnicianBookingHistoryController(req: Request, res: Response) {
    try {
      const technicianUserID = req.query.technicianUserID as string
      const result = await technicianService.fetchTechnicianBookingHistoryService(technicianUserID);
      res.status(HTTP_statusCode.OK).json(result);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
    }
  };

  async fetchTechnicianInformationController(req: Request, res: Response) {
    try {
      const technicianUser_id: string = req.query.technicianUserID as string;
      const serviceResponse = await technicianService.fetchTechnicianInformationService(technicianUser_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.")
    };
  };

  async fetchingIndividualBookingDetailsController(req: Request, res: Response) {
    try {
      const booking_id: string = req.query.booking_id as string;
      const response = await technicianService.fetchingIndividualBookingDetailsService(booking_id);
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).send("Can't collect booking details");
    }
  };

  async acceptRejectCancelNewBookingController(req: Request, res: Response) {
    try {
      const { booking_id, newStatus, technician_id, serviceDate } = req.body;
      await technicianService.acceptRejectCancelNewBookingService(booking_id, newStatus, technician_id, serviceDate);
      res.status(HTTP_statusCode.OK).json({ message: "Status changed successfully" });
    } catch (error: any) {
      if (error.message === "Status is not changed") {
        res.status(HTTP_statusCode.NoChange).send("Status is not changed");
      } else {
        res.status(HTTP_statusCode.InternalServerError).json(error);
      };
    };
  };

  async completeBookingController(req: Request, res: Response) {
    try {
      const { booking_id, client_id, laborCharge } = req.body;
      await technicianService.completeBookingService(booking_id, client_id, laborCharge);
      res.status(HTTP_statusCode.OK).send("Booking completed");
    } catch (error: any) {
      if (error.message === "Booking details is not changed") {
        res.status(HTTP_statusCode.NoChange).send("Booking details is not changed");
      } else if (error.message === "Can't find the client details") {
        res.status(HTTP_statusCode.NotFound).send("Can't find the client details");
      } else {
        res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      };
    };
  };

  async clearNotificationController(req: Request, res: Response) {
    try {
      const technicianUser_id: string = req.body.technicianUser_id as string;
      await technicianService.clearNotificationService(technicianUser_id);
      res.status(HTTP_statusCode.OK).send("Notification cleared successfully");
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).send("Can't clear notifications.")
    };
  };

  async modifyAvailableSlotsController(req: Request, res: Response) {
    try {
      const technician_id = req.body.technician_id as string;
      const slots = req.body.slots as slotType[];
      await technicianService.modifyAvailableSlotsService(technician_id, slots);
      res.status(HTTP_statusCode.OK).send("Slot modified completed successfully");
    } catch (error: any) {
      if (error.message === "Slot modification is failed.") {
        res.status(HTTP_statusCode.NoChange).send("Slot modification is failed.");
      } else {
        res.status(HTTP_statusCode.InternalServerError).send("something worng please try again later.");
      }
    };
  };

  async fetchWalletInformationController(req: Request, res: Response) {
    try {
      const user_id: string = req.query.user_id as string;
      const serviceResponse = await technicianService.fetchWalletInformationService(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong, Please try again later.")
    };
  };

  async fetchningRatingWithReviewerDetailsController(req: Request, res: Response) {
    try {
      const technicianUser_id = req.query.technicianUser_id as string;
      const serviceResponse = await technicianService.fetchningRatingWithReviewerDetailsService(technicianUser_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.")
    };
  };

};

export default TechnicianController;