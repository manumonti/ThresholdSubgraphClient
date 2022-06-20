import React from "react"
import { StakerWithOperatorItem } from "./StakerWithOperatorItem"

export function StakerWithOperatorList({ totalStaked, stakeWithConfOperList }) {
  return (
    <table border="1px">
      <thead>
        <tr>
          <th>Staking Provider</th>
          <th>Owner</th>
          <th>Amount</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
        {stakeWithConfOperList.map((stake) => (
          <StakerWithOperatorItem
            key={stake.stakingProvider}
            totalStaked={totalStaked}
            stake={stake}
          />
        ))}
      </tbody>
    </table>
  )
}
