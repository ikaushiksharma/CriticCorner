import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = localStorage.getItem("auth-token");
  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "content-type": "mulitpart/form-data",
      },
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress) onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    console.log(error.response.data);
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};
