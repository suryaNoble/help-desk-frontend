// export interface Asset {
//   id: number;
//   name: string;
//   status: string;
//   serialNumber: string;
//   category?: {
//     id: number;
//     name: string;
//     parentCategory?: {
//       id: number;
//       name: string;
//     };
//   };
//   assignedTo?: {
//     id: number;
//     name: string;
//     email: string;
//   };
// }


export interface Asset {
  id: number;
  name: string;
  status: string;
  serialNumber: string;
  
  category?: {
    id: number;
    name: string;
    parentCategory?: any; // Added to prevent your previous error!
  };

  // This is the property Angular is looking for
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
}