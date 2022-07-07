import React from "react"
import { Fragment, useState, useRef } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BonusStakeList } from "./components/BonusElegibility/BonusStakeList"
import { ConfirmedOperatorsData } from "./components/ConfirmedOperators/ConfirmedOperatorsData"
import { OngoingRewardsList } from "./components/OngoingRewards/OngoingRewardsList"
import { OngoingRewardsStats } from "./components/OngoingRewardsStats/OngoingRewardsStats"

const TIMESTAMP = "1654041600" // Jun 1 2022 00:00:00 GMT
const GQLURL =
  "https://api.studio.thegraph.com/query/24143/main-threshold-subgraph/0.0.6"

const gplClient = new ApolloClient({
  uri: GQLURL,
  cache: new InMemoryCache(),
})

export function App() {
  const bonusAddressRef = useRef()
  const ongoingAddressRef = useRef()
  const ongoingStartDateRef = useRef()
  const ongoingEndDateRef = useRef()
  const ongoingStartTimeRef = useRef()
  const ongoingEndTimeRef = useRef()
  const [bonusAddress, setBonusAddress] = useState("")
  const [ongoingAddress, setOngoingAddress] = useState("")
  const [ongoingStartTimestamp, setOngoingStartTimestamp] = useState("")
  const [ongoingEndTimestamp, setOngoingEndTimestamp] = useState("")

  const handleBonusCheck = () => {
    const address = bonusAddressRef.current.value
    if (address === "") return
    setBonusAddress(address.toLowerCase())
  }

  const handleOngoingCalc = () => {
    const address = ongoingAddressRef.current.value
    const startDate = ongoingStartDateRef.current.value
    const startTime = ongoingStartTimeRef.current.value
      ? ongoingStartTimeRef.current.value
      : "00:00"
    const endDate = ongoingEndDateRef.current.value
    const endTime = ongoingEndTimeRef.current.value
      ? ongoingEndTimeRef.current.value
      : "00:00"
    const startTimestamp = (
      new Date(`${startDate}T${startTime}+00:00`).getTime() / 1000
    ).toString()
    const endTimestamp = (
      new Date(`${endDate}T${endTime}+00:00`).getTime() / 1000
    ).toString()
    if (address === "" || !startTimestamp || !endTimestamp) return
    setOngoingAddress(address.toLowerCase())
    setOngoingStartTimestamp(startTimestamp)
    setOngoingEndTimestamp(endTimestamp)
  }

  return (
    <Fragment>
      <ApolloProvider client={gplClient}>
        <h1>Threshold Network Staking</h1>
        <div>
          <h2>Bonus elegibility (June 1st)</h2>
          <input
            ref={bonusAddressRef}
            type="text"
            size="42"
            placeholder="Staking address (owner)"
          />
          <button onClick={handleBonusCheck}>Check</button>
          <BonusStakeList address={bonusAddress} timestamp={TIMESTAMP} />
        </div>
        <div>
          <h2>Bonus elegibility stats (June 1st)</h2>
          <ConfirmedOperatorsData timestamp={TIMESTAMP} block={TIMESTAMP} />
        </div>
        <div>
          <h2>Ongoing rewards</h2>
          <div>
            <input
              ref={ongoingAddressRef}
              type="text"
              size="42"
              placeholder="Staking address (owner)"
            />
          </div>
          <div>
            <label>Start date: </label>
            <input
              ref={ongoingStartDateRef}
              id="startDate"
              type="date"
              min="2022-06-01"
            />
            <input ref={ongoingStartTimeRef} type="time" />
          </div>
          <div>
            <label>End date: </label>
            <input
              ref={ongoingEndDateRef}
              id="endDate"
              type="date"
              min="2022-06-01"
            />
            <input ref={ongoingEndTimeRef} type="time" />
          </div>
          <button onClick={handleOngoingCalc}>Calculate</button>
          <OngoingRewardsList
            gqlUrl={GQLURL}
            address={ongoingAddress}
            startTimestamp={ongoingStartTimestamp}
            endTimestamp={ongoingEndTimestamp}
          />
        </div>
        <div>
          <h2>Ongoing rewards stats (June 1st to Now) </h2>
          <small>
            Note: this calculation doesn't take into account if operators are
            confirmed (yet)
          </small>
          <OngoingRewardsStats gqlUrl={GQLURL} timestamp={TIMESTAMP} />
        </div>
      </ApolloProvider>
    </Fragment>
  )
}
