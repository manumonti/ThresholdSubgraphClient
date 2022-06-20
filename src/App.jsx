import React from "react"
import { Fragment, useState, useRef } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BonusStakeList } from "./components/BonusElegibility/BonusStakeList"
import { ConfirmedOperatorsData } from "./components/ConfirmedOperators/ConfirmedOperatorsData"

const gplClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/24143/main-threshold-subgraph/0.0.5",
  cache: new InMemoryCache(),
})

const TIMESTAMP = "1654041600" // Jun 1 2022 00:00:00 GMT

export function App() {
  const stakingAddressRef = useRef()
  const [ownerAddress, setOwnerAddress] = useState("")

  const handleStakingCheck = () => {
    const address = stakingAddressRef.current.value
    if (address === "") return
    setOwnerAddress(address.toLowerCase())
  }

  return (
    <Fragment>
      <ApolloProvider client={gplClient}>
        <h1>Threshold Network Staking</h1>
        <h2>Bonus Elegibility (June 1st)</h2>
        <input
          ref={stakingAddressRef}
          type="text"
          size="42"
          placeholder="Staking address (owner)"
        />
        <button onClick={handleStakingCheck}>Check</button>
        <BonusStakeList ownerAddress={ownerAddress} timestamp={TIMESTAMP} />
        <h2>Bonus elegible stakers (June 1st)</h2>
        <ConfirmedOperatorsData timestamp={TIMESTAMP} block={TIMESTAMP} />
      </ApolloProvider>
    </Fragment>
  )
}
