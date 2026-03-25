import { create } from 'zustand';
import { Appointment } from '../lib/types';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateStatus: (id: string, status: Appointment['status']) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [
    {
      id: '1',
      donorId: 'd1',
      hospitalId: 'h1',
      hospitalName: 'Hospital Josina Machel',
      date: '2024-05-15',
      time: '10:30 AM',
      status: 'completed',
      type: 'Platelets',
    },
    {
      id: '2',
      donorId: 'd1',
      hospitalId: 'h2',
      hospitalName: 'Clínica Girassol',
      date: '2024-02-10',
      time: '09:00 AM',
      status: 'completed',
      type: 'Whole Blood',
    },
  ],
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [appointment, ...state.appointments] })),
  updateStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
}));
