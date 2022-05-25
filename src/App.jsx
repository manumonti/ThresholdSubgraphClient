import React from 'react';
import {
  Fragment,
  useState,
  useRef
} from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { StakeList } from './components/BonusElegibility/StakeList';
import { ConfirmedOperatorsData } from './components/ConfirmedOperators/ConfirmedOperatorsData';

const gplClient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/24143/threshold/0.0.4',
  cache: new InMemoryCache()
});

const TIMESTAMP = "1654041600" // Jun 1 2022 00:00:00 GMT

export function App() {
  const stakingAddressRef = useRef();
  const [ownerAddress, setOwnerAddress] = useState('');

  const handleStakingCheck = () => {
    const address = stakingAddressRef.current.value;
    if (address === '') return;
    setOwnerAddress(address.toLowerCase());
  }

  return (
    <Fragment>
      <ApolloProvider client={gplClient}>
        <h1>Bonus Elegibility (June 1st)</h1>
        <input ref={stakingAddressRef} type="text" size="42" placeholder="Staking address (owner)" />
        <button onClick={handleStakingCheck}>Check</button>
        <StakeList ownerAddress={ownerAddress} timestamp={TIMESTAMP}/>
        <h1>Stakers with confirmed operator (June 1st)</h1>
        <ConfirmedOperatorsData timestamp={TIMESTAMP}/>
      </ApolloProvider>
    </Fragment>
  );
}
