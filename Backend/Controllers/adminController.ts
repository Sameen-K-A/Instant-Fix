import { Request, Response } from "express";
import AdminServices from "../Services/adminServices";
import HTTP_statusCode from "../Enums/httpStatusCode";
const adminServices = new AdminServices();

class AdminController {

   async loginController(req: Request, res: Response) {
      try {
         const { email, password } = req.body;
         const serviceResponse = await adminServices.loginService(email, password);
         res.status(HTTP_statusCode.OK).send(serviceResponse);
      } catch (error: any) {
         if (error.message === "Wrong email") {
            res.status(HTTP_statusCode.NotFound).json({ message: "Email not found" })
         } else if (error.message === "Wrong password") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Password is wrong" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error);
         }
      }
   };

   async fetchUserController(req: Request, res: Response) {
      try {
         const serviceResponse = await adminServices.fetchUserService();
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json("Something wrong please try again later");
      }
   };

   async unblockUserController(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await adminServices.unblockUserService(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      }
   };

   async blockUserController(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await adminServices.blockUserService(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         res.status(HTTP_statusCode.InternalServerError).json("Something went wrong, please try again later");
      }
   };

   async fetchTechniciansController(req: Request, res: Response) {
      try {
         const controllResponse = await adminServices.fetchTechnicianService();
         res.status(HTTP_statusCode.OK).json(controllResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      }
   };

   async fetchBookingsController(req: Request, res: Response) {
      try {
         const response = await adminServices.fetchBookingsService();
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      }
   };

};

export default AdminController;