import axios from 'axios';

export async function httpsRequest<T>(
  endpoint: string,
  resource: string,
  method: string,
  payload?: Record<string, string | boolean | object | number>,
  headers?: Record<string, string>,
): Promise<T> {
  const url = `${endpoint}${resource}`;

  try {
    const response = await axios({
      url: url,
      timeout: 10000,
      data: payload,
      method: method,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data,
        )}`,
      );
    }
    throw error;
  }
}
