'use server';

/* eslint-disable consistent-return */

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints, getErrorMessage } from 'src/utils/axios';

interface IParams {
  page: number;
  limit: number;
  filters?: string;
  type?: string | null;
}
export const fetchBanners = async ({
  page = 1,
  limit = 50,
  filters = '',
  type = null,
}: IParams): Promise<any> => {
  const accessToken = cookies().get('access_token')?.value;
  const lang = cookies().get('Language')?.value;

  try {
    const res = await axiosInstance.get(endpoints.banners.fetch, {
      params: {
        page,
        limit,
        by_name: filters,
        advertisementType: type,
      },
      headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': lang },
    });
    return res?.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSingleBannder = async (id: string): Promise<any> => {
  try {
    const accessToken = cookies().get('access_token')?.value;
    const res = await axiosInstance.get(endpoints.banners.bannerDetails(id), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
export const fetchSingleBannderCenters = async (
  id: string,
  page: number,
  limit: number
): Promise<any> => {
  try {
    const accessToken = cookies().get('access_token')?.value;
    const res = await axiosInstance.get(endpoints.banners.bannerCenters(id, page, limit), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const newBanner = async (reqBody: FormData): Promise<any> => {
  const accessToken = cookies().get('access_token')?.value;
  const lang = cookies().get('Language')?.value;
  console.log(reqBody);
  try {
    await axiosInstance.post(endpoints.banners.newBanner, reqBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
        'Content-Type': 'multipart/form-data',
      },
    });
    revalidatePath(paths.dashboard.faq);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const editBanner = async (reqBody: FormData, bannerId: string): Promise<any> => {
  const accessToken = cookies().get('access_token')?.value;
  const lang = cookies().get('Language')?.value;
  console.log(reqBody);

  try {
    const res = await axiosInstance.put(endpoints.banners.editBanner(bannerId), reqBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': lang,
        'Content-Type': 'multipart/form-data',
      },
    });
    revalidatePath(paths.dashboard.banners);
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
