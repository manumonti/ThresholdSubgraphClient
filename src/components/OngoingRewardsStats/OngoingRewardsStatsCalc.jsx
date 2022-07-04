import React from "react"
import { Fragment } from "react"
import { useQuery, gql } from "@apollo/client"
import { BigNumber } from "ethers"

export function OngoingRewardsStatsCalc({ queryData, startTimestamp }) {
  const currentTime = BigNumber.from(parseInt(Date.now() / 1000))
  const secondsInAYear = BigNumber.from(31536000)

  // The ongoing stakes query leaves out the first epoch so let's include it
  const FIRST_EPOCH_QUERY = gql`
    query FirstEpoch($id: String) {
      epoch(id: $id) {
        id
        timestamp
        duration
        totalAmount
      }
    }
  `

  const firstEpochId =
    parseInt(queryData.epoches[0].id) > 0
      ? parseInt(queryData.epoches[0].id) - 1
      : 0
  const id = firstEpochId.toString()

  const { loading, error, data } = useQuery(FIRST_EPOCH_QUERY, {
    variables: { id },
  })

  if (!queryData) return <div></div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  let epochs = [data.epoch, ...queryData.epoches]

  const firstEpochDuration = BigNumber.from(epochs[1].timestamp).sub(
    BigNumber.from(startTimestamp)
  )
  const firstEpoch = structuredClone(epochs[0])
  firstEpoch.timestamp = startTimestamp
  firstEpoch.duration = firstEpochDuration.toString()
  epochs[0] = firstEpoch

  const reward = queryData.epoches.reduce((total, epoch) => {
    const amount = BigNumber.from(epoch.totalAmount)
    const duration = epoch.duration
      ? BigNumber.from(epoch.duration)
      : currentTime.sub(BigNumber.from(epoch.timestamp))
    const epochReward = amount
      .mul(BigNumber.from(15))
      .mul(duration)
      .div(secondsInAYear.mul(BigNumber.from(100)))
    return total.add(epochReward)
  }, BigNumber.from(0))

  const rewardInEther = reward.div(BigNumber.from(10).pow(18))

  return (
    <Fragment>
      <div>Ongoing Rewards generated since June 1st:</div>
      <div>{rewardInEther.toString()}</div>
      <small>in Ether units (10^18)</small>
    </Fragment>
  )
}
