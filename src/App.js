import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";
import useState from 'react';

const EXCHANGE_RATES = gql`
query GetExchangeRates($currency: String!) {
  rates(currency: $currency) {
    currency
    rate
    name
  }
}
`;

let rateData = null;
let rate = 'USD';
let refetcha = null;

function useExchangeRates(selectedCurrency) {
  const currency = selectedCurrency;

  const { loading, error, data, refetch } = useQuery(EXCHANGE_RATES ,{
    variables: {currency},
  });

  if (loading) return 'loading';
  if (error) return 'error';

  console.log(data.rates);
  refetcha = refetch;

  return data.rates
}

function ShowRateData(){
  console.log(rateData);

  if (rateData === 'loading'){
    return(<p>loading</p>);
  }else if(rateData === 'error'){
    return(<p>error</p>);
  }

  return rateData.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}

function onChangeCurrency(e){
  rate = e.target.value;
  refetcha();
}

function SelectCurrency() {
  const [currency, setCurrency] = useState("USD")

  return(
    
      <div>
          <select name="currency" onChange={(e)=>onChangeCurrency(e)}>
              <option value='USD'>USD</option>
              <option value='AOA'>AOA</option>
              <option value='JPY'>JPY</option>
          </select>
      </div>
  );
}

function App() {
  rateData = useExchangeRates(rate);

  return (
    <div className="App">
      <div>
        <SelectCurrency/>
        <ShowRateData />
      </div>
    </div>
  );
}

export default App;
