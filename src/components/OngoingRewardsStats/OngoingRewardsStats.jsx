import React from "react"
import { useQuery, gql } from "@apollo/client"
import { OngoingRewardsStatsCalc } from "./OngoingRewardsStatsCalc"

export function OngoingRewardsStats({ timestamp }) {
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
        id
        timestamp
        duration
        totalAmount
      }
    }
  `

  const { loading, error, data } = useQuery(ONGOING_STAKES_QUERY, {
    variables: { timestamp },
  })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  return <OngoingRewardsStatsCalc queryData={data} startTimestamp={timestamp} />
}
