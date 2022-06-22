import React from "react"
import { useQuery, gql } from "@apollo/client"
import { OngoingRewardsFilterList } from "./OngoingRewardsFilterList"

export function OngoingRewardsList({ address, startTimestamp, endTimestamp }) {
  // TODO: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const ONGOING_STAKES_QUERY = gql`
    query OngoingStakes(
      $address: String
      $startTimestamp: String
      $endTimestamp: String
    ) {
      epoches(
        first: 1000
        orderBy: timestamp
        where: { timestamp_gte: $startTimestamp, timestamp_lte: $endTimestamp }
      ) {
        id
        duration
        timestamp
        totalAmount
        stakes(first: 1000, where: { owner: $address }) {
          amount
          stakingProvider
        }
      }
    }
  `

  const { loading, error, data } = useQuery(ONGOING_STAKES_QUERY, {
    variables: { address, startTimestamp, endTimestamp },
  })

  if (!address) return <div></div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  return (
    <OngoingRewardsFilterList queryData={data} address={address} />
  )
}
