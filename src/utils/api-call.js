import axios from 'axios';

export async function serviceCall(
  method,
  endpoint,
  params = {},
  data = {}
) {
  try {
    return axios({
      method,
      url: `${process.env.REACT_APP_API_ENDPOINT}/${endpoint}`,
      data,
      params
    });
  } catch (err) {
    console.error(err);
  }
}