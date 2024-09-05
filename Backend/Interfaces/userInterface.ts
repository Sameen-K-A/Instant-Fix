export type IUser = {
   _id?: string;
   user_id?: string;
   name: string;
   email: string;
   phone: string;
   password: string;
   isBlocked?: boolean;
   profileIMG: string;
   isTechnician?: boolean;
   addressDetails?: null | IUserAddress;
   alreadychattedtechnician?: string[];
   savedTechnicians?: string[];
};

export type IUserAddress = {
   name?: string;
   address: string;
   district: string;
   state: string;
   pincode: string;
   phone: string;
   alternatePhone: string;
   location?: {
      type: "Point";
      coordinates: [number, number];
   };
};