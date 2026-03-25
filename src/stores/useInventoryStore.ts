import { create } from 'zustand';
import { BloodType } from '../lib/types';

interface InventoryState {
  stock: Record<BloodType, number>;
  updateStock: (bloodType: BloodType, units: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  stock: {
    'A+': 80,
    'A-': 55,
    'B+': 48,
    'B-': 35,
    'O+': 12,
    'O-': 90,
    'AB+': 8,
    'AB-': 22,
  },
  updateStock: (bloodType, units) =>
    set((state) => ({
      stock: { ...state.stock, [bloodType]: units },
    })),
}));
