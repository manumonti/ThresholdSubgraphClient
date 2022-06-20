import React from "react"
import { useQuery, gql } from "@apollo/client"
import { BonusStakeItem } from "./BonusStakeItem"

export function BonusStakeList({ ownerAddress, timestamp }) {
  // TODO: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const BONUS_STAKES_QUERY = gql`
    query BonusStakes($timestamp: String, $ownerAddress: String) {
      epoches(
        first: 1
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_lte: $timestamp }
      ) {
        stakes(first: 1000, where: { owner: $ownerAddress }) {
          stakingProvider
          amount
        }
      }
    }
  `

  const { loading, error, data } = useQuery(BONUS_STAKES_QUERY, {
    variables: { timestamp, ownerAddress },
  })

  if (!ownerAddress) return <div></div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  const stakeList = data.epoches[0].stakes

  if (stakeList.length === 0) {
    return <div>No stakes for this address!</div>
  }

  return (
    <ul>
      {stakeList.map((stake) => (
        <BonusStakeItem
          key={stake.stakingProvider}
          stake={stake}
          timestamp={timestamp}
        />
      ))}
    </ul>
  )
}
