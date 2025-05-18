import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';

export const submitOrder = async (
    addressId: number,
    items: { product_id: number; quantity: number }[]
  ) => {
    const headers = await getAuthHeader();
    const res = await axios.post(
      'http://localhost:8000/api/orders/',
      {
        address: addressId,  // просто id, не объект!
        items,               // массив с product_id и quantity
      },
      { headers }
    );
    return res.data;
  };
  
