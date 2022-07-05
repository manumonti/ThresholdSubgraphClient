import React from "react"
import { Fragment } from "react"
import { useState, useEffect } from "react"
import BigNumber from "bignumber.js"
import { getOngoingRewards } from "@manumonti/staking-rewards-calculation"

export function OngoingRewardsList({ address, startTimestamp, endTimestamp }) {
  const decimals = new BigNumber(1e18)
  const [rewards, setRewards] = useState(null)

  const getRewards = async () => {
    setRewards(await getOngoingRewards(address, parseInt(startTimestamp), parseInt(endTimestamp)))
  }

  useEffect(() => {
    if (address && !rewards) {
      getRewards()
    }
  })

  if (!address) return <div></div>
  if (!rewards) return <div>Loading...</div>

  return (
    <Fragment>
      <ul>
        {rewards.map(stake => {
          return (
            <li key={stake.stakingProvider}>
              <strong>Staking Provider: {stake.stakingProvider}</strong>
              <div>Reward: {stake.reward.div(decimals).toFixed()}</div>
              <small>in Ether units (10^18)</small>
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
