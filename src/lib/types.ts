export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'donor' | 'hospital';
}

export interface Donor extends User {
  bloodType: BloodType;
  totalDonations: number;
  livesSaved: number;
  lastDonationDate?: string;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  phone: string;
  address: string;
}

export interface Hospital extends User {
  address: string;
  phone: string;
  inventory: Record<BloodType, number>;
}

export interface Appointment {
  id: string;
  donorId: string;
  hospitalId: string;
  hospitalName: string;
  date: string;
  time: string;
  status: 'pending' | 'completed' | 'cancelled';
  type: 'Whole Blood' | 'Platelets' | 'Plasma';
}

export interface BloodRequest {
  id: string;
  hospitalId: string;
  bloodType: BloodType;
  units: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'fulfilled' | 'closed';
  createdAt: string;
}
