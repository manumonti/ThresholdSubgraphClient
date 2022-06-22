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

  const reward = stake.reduce((total, epochStake) => {
    const stakeAmount = BigNumber.from(epochStake.amount)
    const epochDuration = epochStake.epochDuration
      ? BigNumber.from(epochStake.epochDuration)
      : currentTime.sub(BigNumber.from(epochStake.epochTimestamp))
    const epochReward = stakeAmount
      .mul(BigNumber.from(115))
      .div(BigNumber.from(100))
      .sub(stakeAmount)
      .mul(epochDuration)
      .div(secondsInAYear)
    return total.add(epochReward)
  }, BigNumber.from(0))

  return (
    <div>
      <div>Rewards: {reward.toString()}</div>
    </div>
  )
}
