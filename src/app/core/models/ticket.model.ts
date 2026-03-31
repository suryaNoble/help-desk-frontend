export interface TicketRequest {
  title: string;
  description: string;
  category: 'Hardware' | 'Software' | 'Access' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assetId?: number; // Only required for Hardware
  stepsToReproduce: string[]; // For FormArray
}

// export interface Ticket {
//   id: number;
//   title: string;
//   status: string; 
//   priority: string;
//   createdAt: string;
//   category: { 
//     id?: number;
//     name: string; 
//   };
// }

export interface Ticket {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  status: string;
  
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  
  // We include this just in case, even though we won't focus on it heavily here
  asset?: {
    id: number;
    name: string;
  };
}