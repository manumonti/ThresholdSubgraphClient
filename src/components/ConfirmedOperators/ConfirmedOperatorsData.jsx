import React from "react"
import { Fragment, useState } from "react"
import { ethers } from "ethers"
import { useQuery, gql } from "@apollo/client"
import { StakerWithOperatorList } from "./StakerWithOperatorList"

export function ConfirmedOperatorsData({ timestamp, block }) {
  const [showState, setShowState] = useState(false)

  const handleShow = () => {
    setShowState(!showState)
  }

  // Todo: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const BONUS_STAKES_QUERY = gql`
    query BonusStakes($timestamp: String) {
      epoches(
        first: 1
        orderBy: timestamp
        orderDirection: desc
        where: { timestamp_lte: $timestamp }
      ) {
        totalAmount
        stakes(first: 1000) {
          stakingProvider
          owner
          amount
        }
      }
    }
  `

  const SIMPLE_PRE_APPS_QUERY = gql`
    query SimplePREApplications($timestamp: String) {
      simplePREApplications(
        first: 1000
        where: { confirmedTimestamp_lte: $timestamp }
      ) {
        operator
        stake {
          id
        }
      }
    }
  `

  const {
    loading: loadingSt,
    error: errorSt,
    data: dataSt,
  } = useQuery(BONUS_STAKES_QUERY, {
    variables: { timestamp },
  })
  const {
    loading: loadingPRE,
    error: errorPRE,
    data: dataPRE,
  } = useQuery(SIMPLE_PRE_APPS_QUERY, { variables: { timestamp } })

  if (loadingSt || loadingPRE) return <div>Loading...</div>
  if (errorSt || errorPRE)
    return (
      <div>
        Error: {errorSt?.message} {errorPRE?.message}
      </div>
    )

  // Stakes list
  const stakeList = dataSt.epoches[0].stakes
  // Simple PRE App list
  const preAppList = dataPRE.simplePREApplications

  // Stakes with confirmed operators list
  const stakeWithConfOperList = stakeList.filter((stake) =>
    preAppList.map((preApp) => preApp.stake.id).includes(stake.stakingProvider)
  )
  const stakersConfOperPerc = (
    (stakeWithConfOperList.length / stakeList.length) *
    100
  ).toFixed(2)

  // Tokens staked in the epoch
  const totalStakedInEpoch = ethers.BigNumber.from(
    dataSt.epoches[0].totalAmount
  )
  // Token stake amount list
  const stakeAmountList = stakeWithConfOperList.map((stake) =>
    ethers.BigNumber.from(stake.amount)
  )
  // Tokens staked by stakers with confirmed operator
  let totalStakedConfOper = stakeAmountList.reduce((a, b) => a.add(b))

  const totalStakedInEpochEther = totalStakedInEpoch.div(
    ethers.BigNumber.from(10).pow(18)
  )
  const totalStakedConfOperEther = totalStakedConfOper.div(
    ethers.BigNumber.from(10).pow(18)
  )
  const stakesOpConfirmedPercentaje = (
    (totalStakedConfOperEther.toNumber() / totalStakedInEpochEther.toNumber()) *
    100
  ).toFixed(2)

  return (
    <Fragment>
      <div>Number of stakes with Confirmed Operator:</div>
      <div>
        {stakeWithConfOperList.length} of {stakeList.length} (
        {stakersConfOperPerc}%)
      </div>
      <div>
        Number of tokens staked by Confirmed Operator stakers (T, Nu & Keep):
      </div>
      <div>
        {totalStakedConfOperEther.toString()} of{" "}
        {totalStakedInEpochEther.toString()} (
        {stakesOpConfirmedPercentaje.toString()}%)
      </div>
      <h3>List of stakers with confirmed operator:</h3>
      <button onClick={handleShow}>Show</button>
      {showState && (
        <StakerWithOperatorList
          totalStaked={totalStakedInEpoch}
          stakeWithConfOperList={stakeWithConfOperList}
        />
      )}
    </Fragment>
  )
}
