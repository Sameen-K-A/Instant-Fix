import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { ITechnicianService } from "../Interfaces/technician.service.interface";
import { ISlot } from "../Interfaces/common.interface";

class TechnicianController {
  private technicianService: ITechnicianService;

  constructor(technicianService: ITechnicianService) {
    this.technicianService = technicianService;
  };

  createTechnician = async (req: Request, res: Response) => {
    try {
      const { user_id, profession } = req.query;
      const serviceResult = await this.technicianService.createTechnician(user_id as string, profession as string);
      res.status(HTTP_statusCode.OK).json(serviceResult);
    } catch (error) {
      console.log("Technician:= create technician error", error);
      res.status(HTTP_statusCode.InternalServerError).json({ message: 'Internal Server Error' });
    };
  };

  updateProfession = async (req: Request, res: Response) => {
    try {
      const { user_id, profession } = req.body;
      await this.technicianService.updateProfession(user_id, profession);
      res.status(HTTP_statusCode.OK).send("Changes commit successfully");
    } catch (error: any) {
      console.log("Technician:= update profession error", error);
      if (error.message === "No changes found") {
        res.status(HTTP_statusCode.NoChange).json({ message: "No changes found" });
      } else {
        res.status(HTTP_statusCode.InternalServerError).json(error);
      };
    };
  };

  updateAvailableStatus = async (req: Request, res: Response) => {
    try {
      const { user_id, newStatus } = req.body;
      await this.technicianService.updateAvailableStatus(user_id, newStatus);
      res.status(HTTP_statusCode.OK).send("Changes completed successfully");
    } catch (error) {
      console.log("Technician:= update available status error", error);
      res.status(HTTP_statusCode.InternalServerError).json(error);
    };
  };

  getBookings = async (req: Request, res: Response) => {
    try {
      const technicianUserID = req.query.technicianUserID as string
      const result = await this.technicianService.getBookings(technicianUserID);
      res.status(HTTP_statusCode.OK).json(result);
    } catch (error) {
      console.log("Technician:= get booking error", error);
      res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
    };
  };

  getTechnicianInfo = async (req: Request, res: Response) => {
    try {
      const technicianUser_id: string = req.query.technicianUserID as string;
      const serviceResponse = await this.technicianService.getTechnicianInfo(technicianUser_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      console.log("Technician:= get technician information error", error);
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.")
    };
  };

  getBookingDetails = async (req: Request, res: Response) => {
    try {
      const booking_id: string = req.query.booking_id as string;
      const response = await this.technicianService.getBookingDetails(booking_id);
      res.status(HTTP_statusCode.OK).json(response);
    } catch (error) {
      console.log("Technician:= get booking details error", error);
      res.status(HTTP_statusCode.InternalServerError).send("Can't collect booking details");
    };
  };

  updateBookingStatus = async (req: Request, res: Response) => {
    try {
      const { booking_id, newStatus, technician_id, serviceDate } = req.body;
      await this.technicianService.updateBookingStatus(booking_id, newStatus, technician_id, serviceDate);
      res.status(HTTP_statusCode.OK).json({ message: "Status changed successfully" });
    } catch (error: any) {
      console.log("Technicia:=n update booking status error", error);
      if (error.message === "Status is not changed") {
        res.status(HTTP_statusCode.NoChange).send("Status is not changed");
      } else {
        res.status(HTTP_statusCode.InternalServerError).json(error);
      };
    };
  };

  completeBooking = async (req: Request, res: Response) => {
    try {
      const { booking_id, client_id, laborCharge } = req.body;
      await this.technicianService.completeBooking(booking_id, client_id, laborCharge);
      res.status(HTTP_statusCode.OK).send("Booking completed");
    } catch (error: any) {
      console.log("Technician:= complete booking error", error);
      if (error.message === "Booking details is not changed") {
        res.status(HTTP_statusCode.NoChange).send("Booking details is not changed");
      } else if (error.message === "Can't find the client details") {
        res.status(HTTP_statusCode.NotFound).send("Can't find the client details");
      } else {
        res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      };
    };
  };

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const technicianUser_id: string = req.body.technicianUser_id as string;
      await this.technicianService.deleteNotification(technicianUser_id);
      res.status(HTTP_statusCode.OK).send("Notification cleared successfully");
    } catch (error) {
      console.log("Technician:= delete notification error", error);
      res.status(HTTP_statusCode.InternalServerError).send("Can't clear notifications.")
    };
  };

  updateAvailableSlots = async (req: Request, res: Response) => {
    try {
      const technician_id = req.body.technician_id as string;
      const slots = req.body.slots as ISlot[];
      await this.technicianService.updateAvailableSlots(technician_id, slots);
      res.status(HTTP_statusCode.OK).send("Slot modified completed successfully");
    } catch (error: any) {
      console.log("Technician:= update availbale slot error", error);
      if (error.message === "Slot modification is failed.") {
        res.status(HTTP_statusCode.NoChange).send("Slot modification is failed.");
      } else {
        res.status(HTTP_statusCode.InternalServerError).send("something worng please try again later.");
      };
    };
  };

  getWallet = async (req: Request, res: Response) => {
    try {
      const user_id: string = req.query.user_id as string;
      const serviceResponse = await this.technicianService.getWallet(user_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      console.log("Technician:= get wallet error", error);
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong, Please try again later.")
    };
  };

  getRatingWithReviewerDetails = async (req: Request, res: Response) => {
    try {
      const technicianUser_id = req.query.technicianUser_id as string;
      const serviceResponse = await this.technicianService.getRatingWithReviewerDetails(technicianUser_id);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error) {
      console.log("Technician:= get rating with reviewer details error", error);
      res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.")
    };
  };

};

export default TechnicianController;