import client from "./client";
import { getToken, catchError } from "../utils/helper";
export const createActor = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const updateActor = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/actor/update/${id}`, formData, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const deleteActor = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/actor/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/actors/?pageNo=${pageNo}&limit=${limit}`, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getActorProfile = async (id) => {
  try {
    const { data } = await client("/actor/single" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
