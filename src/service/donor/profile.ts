import { api } from '@/utils/axios';
import { ProfileFormValues } from '@/schemas/donor/index';

export async function updateDonorProfile(id: number, data: ProfileFormValues) {
  const response = await api.put(`/doador/${id}`, data);
  return response.data;
}
