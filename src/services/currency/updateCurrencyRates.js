const updateCurrencyRates = async () => {
  try {
    const response = await fetch(
      "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_0wmfTxX83MQiqvSuzxJ5euAxwsRhuXqfQQS4vtkg&currencies=&base_currency=INR"
    ); // Replace with your API endpoint
    const data = await response.json();
    console.log("data fetched in indian:", JSON.stringify(data));

    const nepaliRates = divideValuesBy1Point6(data.data);
    console.log("data fetched in nepali:", JSON.stringify(nepaliRates));

    const res = await fetch(`http://localhost:3000/api/currency/update`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(nepaliRates),
    });

    const resData = await res.json();

    return resData;
  } catch (error) {
    console.log(error);
  }
};

function divideValuesBy1Point6(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key] / 1.6;
    }
  }
  return result;
}

module.exports = updateCurrencyRates;
