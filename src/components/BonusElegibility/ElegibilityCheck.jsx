import React from "react"
import { Fragment } from "react"
import { useQuery, gql } from "@apollo/client"

export function ElegibilityCheck({ stakingProvider, timestamp }) {
  const SIMPLE_PRE_APP_QUERY = gql`
    query SimplePREApplication($stakingProvider: String) {
      simplePREApplication(id: $stakingProvider) {
        confirmedTimestamp
        operator
      }
    }
  `

  const { loading, error, data } = useQuery(SIMPLE_PRE_APP_QUERY, {
    variables: { stakingProvider },
  })
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  let operator = ""
  let operatorCheck = "❌"

  const confirmedTimestamp = parseInt(
    data.simplePREApplication?.confirmedTimestamp
  )

  if (confirmedTimestamp <= parseInt(timestamp)) {
    operator = data.simplePREApplication.operator
    operatorCheck = "✅"
  }

  return (
    <Fragment>
      <div>Elegibility checks:</div>
      <div>✅ Staking at June 1st</div>
      <div>
        {operatorCheck} Node operator confirmed: {operator}
      </div>
    </Fragment>
  )
}
