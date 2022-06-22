import React from "react"
import { Fragment } from "react"
import { useQuery, gql } from "@apollo/client"
import { BigNumber } from "ethers"

export function OngoingRewardsStats({ timestamp }) {
  const currentTime = BigNumber.from(parseInt(Date.now() / 1000))
  const secondsInAYear = BigNumber.from(31536000)

  // TODO: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const ONGOING_STAKES_QUERY = gql`
    query OngoingStakesJuneFirst($timestamp: String) {
      epoches(
        first: 1000
        orderBy: timestamp
        where: { timestamp_gte: $timestamp }
      ) {
        duration
        timestamp
        totalAmount
      }
    }
  `

  const { loading, error, data } = useQuery(ONGOING_STAKES_QUERY, { variables: {timestamp} })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  const reward = data.epoches.reduce((total, epoch) => {
    const amount = BigNumber.from(epoch.totalAmount)
    const duration = epoch.duration
      ? BigNumber.from(epoch.duration)
      : currentTime.sub(BigNumber.from(epoch.timestamp))
    const epochReward = amount
      .mul(BigNumber.from(115))
      .div(BigNumber.from(100))
      .sub(amount)
      .mul(duration)
      .div(secondsInAYear)
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
