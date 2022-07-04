import React from "react"
import { BigNumber } from "ethers"

export function OngoingRewardsItem({ stake }) {
  const currentTime = BigNumber.from(parseInt(Date.now() / 1000))
  const secondsInAYear = BigNumber.from(31536000)

  //   const areas = stake.reduce( (total, epochStake) => {
  //   const epochDuration = BigNumber.from(epochStake.epochDuration)
  //   const epochAmount = BigNumber.from(epochStake.epochTotalAmount)
  //   const stakeAmount = BigNumber.from(epochStake.amount)
  //   const epochArea = epochDuration.mul(epochAmount)
  //   const stakeArea = epochDuration.mul(stakeAmount)
  //   total.epochArea = total.epochArea.add(epochArea)
  //   total.stakeArea = total.stakeArea.add(stakeArea)
  //   return total
  // }, {epochArea: BigNumber.from(0), stakeArea: BigNumber.from(0)})

  // const stakeAreaConverted = areas.stakeArea.mul(BigNumber.from(10).pow(8))
  // const participation = (stakeAreaConverted.div(areas.epochArea).toNumber())/10 ** 8

  // Rewards formula: r = (s_1 * y_t) * t / 365; where y_t is 0.15
  const reward = stake.reduce((total, epochStake) => {
    const stakeAmount = BigNumber.from(epochStake.amount)
    const epochDuration = epochStake.epochDuration
      ? BigNumber.from(epochStake.epochDuration)
      : currentTime.sub(BigNumber.from(epochStake.epochTimestamp))
    const epochReward = stakeAmount
      .mul(BigNumber.from(15))
      .mul(epochDuration)
      .div(secondsInAYear.mul(BigNumber.from(100)))
    return total.add(epochReward)
  }, BigNumber.from(0))

  const rewardInEther = reward.div(BigNumber.from(10).pow(18))

  return (
    <div>
      <div>Rewards: {rewardInEther.toString()}</div>
      <small>in Ether Unit (10^18)</small>
    </div>
  )
}
