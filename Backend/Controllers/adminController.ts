import { Request, Response } from "express";
import { IAdminServices } from "../Interfaces/admin.service.interface";
import HTTP_statusCode from "../Enums/httpStatusCode";

class AdminController {
   private adminService: IAdminServices;

   constructor(adminService: IAdminServices) {
      this.adminService = adminService;
   }

   login = async (req: Request, res: Response) => {
      try {
         const { email, password } = req.body;
         const serviceResponse = await this.adminService.login(email, password);
         res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
         });
         res.cookie("AdminAccessToken", serviceResponse.adminAccessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
         });
         res.status(HTTP_statusCode.OK).send(serviceResponse);
      } catch (error: any) {
         if (error.message === "Wrong email") {
            res.status(HTTP_statusCode.NotFound).json({ message: "Email not found" });
         } else if (error.message === "Wrong password") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Password is wrong" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error);
         };
      };
   };

   findUser = async (req: Request, res: Response) => {
      try {
         const serviceResponse = await this.adminService.findUser();
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json("Something wrong please try again later");
      };
   };

   unBlock = async (req: Request, res: Response) => {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await this.adminService.unBlock(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      };
   };

   block = async (req: Request, res: Response) => {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await this.adminService.block(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      };
   };

   findTechnician = async (req: Request, res: Response) => {
      try {
         const controllResponse = await this.adminService.findTechnician();
         res.status(HTTP_statusCode.OK).json(controllResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   findBooking = async (req: Request, res: Response) => {
      try {
         const response = await this.adminService.findBooking();
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   fetchbookingsLocation = async (req: Request, res: Response) => {
      try {
         const response = await this.adminService.fetchbookingsLocation();
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   getCategories = async (req: Request, res: Response) => {
      try {
         const response = await this.adminService.getCategories();
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   filteredBooking = async (req: Request, res: Response) => {
      try {
         const selectedDates: string[] = req.query.selectedDates as string[];
         const response = await this.adminService.filteredBooking(selectedDates);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   logout = async (req: Request, res: Response) => {
      try {
         res.clearCookie("AdminRefreshToken", { httpOnly: true });
         res.clearCookie("AdminAccessToken", { httpOnly: true });
         res.status(HTTP_statusCode.OK).send('Logged out successfully');
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later")
      };
   };

};

export default AdminController;