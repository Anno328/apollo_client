import './App.css';
import {
  useQuery,
  gql
} from "@apollo/client";
import React, { useState,useEffect } from 'react';

function useExchangeRates() {
  const GET_SHIPS = gql`
  query GetShips($name: String!) {
    ships(find: {name: $name}) {
      name
      image
      id
    }
  }
  `;

  const shipName = '';

  const { loading, error, data, refetch } = useQuery(GET_SHIPS ,{
    variables: {name: shipName},
  });

  console.log({
    variables: {name: shipName},
  });

  if (loading) return 'loading';
  if (error) return 'error';

  console.log("useExchangeRates run");

  return {
    shipData:data.ships,
    refetch
  }
}

function ShowshipData(props){
    if(!props.shipData){
      return(<p>no data</p>);
    }else if (props.shipData === 'loading'){
      return(<p>loading</p>);
    }else if(props.shipData === 'error'){
      return(<p>loading</p>);
    }
  
    return props.shipData.map(({ name, image }) => (
      <div>
        <p>{name}</p>
        <img src={image} alt=''/>
      </div>
    ));
}

function useSearchShipData(){
  const [ship, setShip] = useState('')

  return {
    ship,
    onChangeShip: (e)=>{
      setShip(e.target.value);
    }
  };
}

function SelectShip(props){
  if(!props.shipData){
    return <p>loading</p>
  }

  return(
    <select name="ship" onChange={(e)=>{props.onChangeShip(e)}}>
          {props.shipData.map(ship => (
            <option key={ship.id} value={ship.name}>
              {ship.name}
            </option>
          ))}
        </select>
  )
}

function App() {
  const {shipData,refetch} = useExchangeRates();
  const {ship,onChangeShip} = useSearchShipData();

  useEffect(() => {
    if(refetch){
      console.log({variables:{name:ship}});
      refetch({variables:{name:ship}});
    }
  }, [refetch, ship])

  return (
    <div className="App">
      <div>
        <SelectShip shipData={shipData} onChangeShip={onChangeShip}/>
        <ShowshipData shipData={shipData}/>
      </div>
    </div>
  );
}

export default App;
