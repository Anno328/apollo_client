import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";
import {useState,useEffect} from 'react';

function useExchangeRates(selectedCurrency) {
  const EXCHANGE_RATES = gql`
  query GetExchangeRates($currency: String!) {
    rates(currency: $currency) {
      currency
      rate
      name
    }
  }
  `;

  const currency = selectedCurrency;

  const { loading, error, data, refetch } = useQuery(EXCHANGE_RATES ,{
    variables: {currency},
  });

  if (loading) return 'loading';
  if (error) return 'error';

  console.log("useExchangeRates run");

  return {
    rateData:data.rates,
    refetch
  }
}

function ShowRateData(props){
    console.log(props.rateData);

    if(!props.rateData){
      return(<p>no data</p>);
    }else if (props.rateData === 'loading'){
      return(<p>loading</p>);
    }else if(props.rateData === 'error'){
      return(<p>error</p>);
    }
  
    return props.rateData.map(({ currency, rate }) => (
      <div key={currency}>
        <p>
          {currency}: {rate}
        </p>
      </div>
    ));
}

function useSelectCurrency() {
  const [currency, setCurrency] = useState("USD");

  return{
    currency,
    onChangeCurrency: e=>{
      setCurrency(e.target.value)
    }
  }
}

function App() {
  const {currency,onChangeCurrency} = useSelectCurrency();
  const {rateData,refetch} = useExchangeRates(currency);

  useEffect(() => {
    if(refetch){
      refetch();
    }
  }, [currency, refetch])

  return (
    <div className="App">
      <div>
        <div>
            <select name="currency" onChange={(e)=>onChangeCurrency(e)}>
                <option value='USD'>USD</option>
                <option value='AOA'>AOA</option>
                <option value='JPY'>JPY</option>
            </select>
        </div>
        <ShowRateData rateData={rateData}/>
      </div>
    </div>
  );
}

export default App;
