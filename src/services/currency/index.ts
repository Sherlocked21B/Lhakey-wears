import { apiUrl } from "@/lib/utils";

export const getCurrencyRates = async () => {
  try {
    const res = await fetch(`${apiUrl}/currency/all`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const updateCurrencyRates = async () => {
//   try {
//     const response = await fetch(
//       "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_0wmfTxX83MQiqvSuzxJ5euAxwsRhuXqfQQS4vtkg"
//     ); // Replace with your API endpoint
//     const data = await response.json();
//     console.log(data);

//     const res = await fetch(`${apiUrl}/currency/update`, {
//       method: "PUT",
//       headers: {
//         "content-type": "application/json",
//       },
//       cache: "no-store",
//       body: data,
//     });

//     const resData = await res.json();

//     return resData;
//   } catch (error) {
//     console.log(error);
//   }
// };
