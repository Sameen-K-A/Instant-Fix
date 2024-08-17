import { Request, Response } from "express";
import TechnicianService from "../Services/technicianService";

const technicianService = new TechnicianService();

class TechnicianController {

  async joinNewTechnicianController(req: Request, res: Response): Promise<void> {
    try {
      const user_id: string = req.query.user_id as string;
      const profession: string = req.query.profession as string;
      const serviceResult = await technicianService.joinNewTechnicianService(user_id, profession);
      res.status(200).json(serviceResult);
    } catch (error) {
      console.log("error from controll ", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  async changeProfessionController(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, profession } = req.body;
      await technicianService.changeProfessionService(user_id, profession);
      res.status(200).send("Changes commit successfully");
    } catch (error: any) {
      if (error.message === "No changes found") {
        res.status(304).json({ message: "No changes found" });
      } else {
        res.status(500).json(error);
      }
    }
  };

  async changeAvailabilityStatusController(req: Request, res: Response) {
    try {
      const { user_id, newStatus } = req.body;
      await technicianService.changeAvailabilityStatusService(user_id, newStatus);
      res.status(200).send("Changes completed successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  };

  async fetchTechnicianBookingHistoryController(req: Request, res: Response) {
    try {
      const technicianUserID = req.query.technicianUserID as string
      const result = await technicianService.fetchTechnicianBookingHistoryService(technicianUserID);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Something wrong please try again later" });
    }
  };

  async fetchingIndividualBookingDetailsController(req: Request, res: Response) {
    try {
      const booking_id: string = req.query.booking_id as string;
      const response = await technicianService.fetchingIndividualBookingDetailsService(booking_id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).send("Can't collect booking details");
    }
  };

  async acceptRejectCancelNewBookingController(req: Request, res: Response) {
    try {
      const booking_id = req.body.booking_id as string;
      const newStatus = req.body.newStatus as string;
      const technician_id = req.body.technician_id as string;
      await technicianService.acceptRejectCancelNewBookingService(booking_id, newStatus, technician_id);
      res.status(200).json({ message: "Status changed successfully" });
    } catch (error: any) {
      if (error.message === "Status is not changed") {
        res.status(304).send("Status is not changed");
      } else {
        res.status(500).json(error);
      };
    };
  };

};

export default TechnicianController;