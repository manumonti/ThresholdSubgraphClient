import React from "react"
import { Fragment } from "react"
import { useQuery, gql } from "@apollo/client"
import { OngoingRewardsItem } from "./OngoingRewardsItem"

export function OngoingRewardsFilterList({ queryData, address }) {
  // The ongoing stakes query leaves out start date epoch so let's include it
  const FIRST_EPOCH_QUERY = gql`
    query FirstEpoch($id: String, $address: String) {
      epoch(id: $id) {
        id
        duration
        totalAmount
        stakes(first: 1000, where: { owner: $address }) {
          amount
          stakingProvider
        }
      }
    }
  `

  const firstEpochId =
    parseInt(queryData.epoches[0].id) > 0 ? parseInt(queryData.epoches[0].id) - 1 : 0
  const id = firstEpochId.toString()
  const { loading, error, data } = useQuery(FIRST_EPOCH_QUERY, {
    variables: { id, address },
  })

  if (!address) return <div></div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  let epochs = [data.epoch, ...queryData.epoches]

  // Clean the empty epochs
  epochs = epochs.filter((epoch) => {
    return epoch.stakes.length > 0
  })

  // Sort the epoch's stakes by staking provider
  const stakeList = {}
  epochs.forEach((epoch, index) => {
    epoch.stakes.forEach((stake) => {
      const stakeData = {}
      stakeData.epochTotalAmount = epoch.totalAmount
      stakeData.epochDuration = epoch.duration
      stakeData.epochTimestamp = epoch.timestamp
      stakeData.amount = stake.amount
      stakeList[stake.stakingProvider] = stakeList[stake.stakingProvider]
        ? stakeList[stake.stakingProvider]
        : []
      stakeList[stake.stakingProvider].push(stakeData)
    })
  })

  return (
    <Fragment>
      <ul>
        {Object.keys(stakeList).map((stakingProvider, index) => {
          return (
            <li key={stakingProvider}>
              <h3>Stake {index + 1}</h3>
              <div>Staking Provider: {stakingProvider}</div>
              <OngoingRewardsItem stake={stakeList[stakingProvider]} />
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
