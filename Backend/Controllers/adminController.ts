import { Request, Response } from "express";
import { IAdminServices } from "../Interfaces/adminInterfaces";
import HTTP_statusCode from "../Enums/httpStatusCode";

class AdminController {
   private adminService: IAdminServices;

   constructor(adminService: IAdminServices) {
      this.adminService = adminService;
   }

   async login(req: Request, res: Response) {
      try {
         const { email, password } = req.body;
         const serviceResponse = await this.adminService.login(email, password);
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

   async findUser(req: Request, res: Response) {
      try {
         const serviceResponse = await this.adminService.findUser();
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json("Something wrong please try again later");
      };
   };

   async unBlock(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await this.adminService.unBlock(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      };
   };

   async block(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await this.adminService.block(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      };
   };

   async findTechnician(req: Request, res: Response) {
      try {
         const controllResponse = await this.adminService.findTechnician();
         res.status(HTTP_statusCode.OK).json(controllResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   async findBooking(req: Request, res: Response) {
      try {
         const response = await this.adminService.findBooking();
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

};

export default AdminController;