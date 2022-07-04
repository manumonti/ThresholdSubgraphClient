import React from "react"
import { Fragment } from "react"
import { BigNumber } from "ethers"
import { useQuery, gql } from "@apollo/client"
import { OngoingRewardsItem } from "./OngoingRewardsItem"

export function OngoingRewardsListFiltered({
  queryData,
  address,
  startTimestamp,
  endTimestamp,
}) {
  // The ongoing stakes query leaves out the first epoch so let's include it
  const FIRST_EPOCH_QUERY = gql`
    query FirstEpoch($id: String, $address: String) {
      epoch(id: $id) {
        id
        timestamp
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
    parseInt(queryData.epoches[0].id) > 0
      ? parseInt(queryData.epoches[0].id) - 1
      : 0
  const id = firstEpochId.toString()
  const { loading, error, data } = useQuery(FIRST_EPOCH_QUERY, {
    variables: { id, address },
  })

  if (!address) return <div></div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error {error.message}</div>

  let epochs = [data.epoch, ...queryData.epoches]

  const lastEpochIndex = epochs.length - 1 > 0 ? epochs.length - 1 : 0
  const firstEpochDuration = BigNumber.from(epochs[1].timestamp).sub(
    BigNumber.from(startTimestamp)
  )
  const lastEpochDuration = BigNumber.from(endTimestamp).sub(
    BigNumber.from(epochs[lastEpochIndex].timestamp)
  )
  const firstEpoch = structuredClone(epochs[0])
  const lastEpoch = structuredClone(epochs[lastEpochIndex])
  firstEpoch.duration = firstEpochDuration.toString()
  firstEpoch.timestamp = startTimestamp
  lastEpoch.duration = lastEpochDuration.toString()
  epochs[0] = firstEpoch
  epochs[lastEpochIndex] = lastEpoch

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
