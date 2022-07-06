import React from "react"
import { Fragment } from "react"
import { useState, useEffect } from "react"
import BigNumber from "bignumber.js"
import { getTotalOngoingRewards } from "@manumonti/staking-rewards-calculation"

export function OngoingRewardsStats({ gqlUrl, timestamp }) {
  const decimals = new BigNumber(1e18)
  const [reward, setReward] = useState(null)

  const getReward = async () => {
    setReward(await getTotalOngoingRewards(gqlUrl, timestamp))
  }

  useEffect(() => {
    if (timestamp && !reward) {
      getReward()
    }
  })

  if (!reward) return <div>Loading...</div>

  return (
    <Fragment>
      <div>Ongoing Rewards generated since June 1st:</div>
      <div>
        <strong>{reward.div(decimals).toFixed(0)}</strong>
      </div>
      <small>in Ether units (10^18)</small>
    </Fragment>
  )
}
