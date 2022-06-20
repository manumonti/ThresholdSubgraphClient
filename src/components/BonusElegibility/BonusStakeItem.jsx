import React from "react"
import { Fragment } from "react"
import { ElegibilityCheck } from "./ElegibilityCheck"

export function BonusStakeItem({ stake, timestamp }) {
  return (
    <Fragment>
      <li>
        <h3>Stake:</h3>
        <div>Staking Provider address: {stake.stakingProvider}</div>
        <div>Amount: {Math.round(stake.amount / Math.pow(10, 18))}</div>
        <ElegibilityCheck
          stakingProvider={stake.stakingProvider}
          timestamp={timestamp}
        />
      </li>
    </Fragment>
  )
}
