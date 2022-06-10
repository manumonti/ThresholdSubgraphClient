import React from "react"
import { useQuery, gql } from "@apollo/client"

export function ElegibilityCheck({ stakingProvider, block }) {
  const OPERATOR_QUERY = gql`
    query GetOperator($stakingProvider: String, $block: Int) {
      confirmedOperators(
        first: 1000
        block: { number: $block }
        where: { stakingProvider: $stakingProvider }
      ) {
        stakingProvider
        operator
      }
    }
  `

  // Since Delegation is not a requirements for bonus anymore,
  //  this query is not necessary by the moment.

  // const DELEGATION_QUERY = gql`
  // query GetDelegation ($stakingProvider: String){
  //   delegations(
  //     where: {delegator: $stakingProvider}
  //   ) {
  //     delegator
  //     delegate
  //   }
  // }
  // `;

  const { loading, error, data } = useQuery(OPERATOR_QUERY, {
    variables: { stakingProvider, block },
  })
  // const { loading: loadingDele, error: errorDele, data: dataDele } = useQuery(DELEGATION_QUERY, {variables: {stakingProvider}});
  // if (loading || loadingDele) return <div>Loading...</div>;
  if (loading) return <div>Loading...</div>
  // if (error || errorDele) return <div>Error</div>;
  if (error) return <div>Error: {error.message}</div>

  let operator = ""
  let operatorCheck = "❌"

  if (data.confirmedOperators.length !== 0) {
    operator = data.confirmedOperators[0].operator
    operatorCheck = "✅"
  }

  // let delegate = ''
  // let delegateCheck = '❌'

  // if (dataDele.delegations.length !== 0) {
  //   delegate = dataDele.delegations[0].delegate
  //   delegateCheck = `✅`
  // }

  return (
    <div>
      <div>Elegibility checks:</div>
      <div>✅ Staking at June 1st</div>
      <div>
        {operatorCheck} Node operator confirmed: {operator}
      </div>
      {/* <div>{delegateCheck} Voting power delegate: {delegate}</div> */}
      <div></div>
    </div>
  )
}
