import React from 'react';
import { StakerWithOperatorItem } from './StakerWithOperatorItem';

export function StakerWithOperatorList( {totalStaked, stakeWithConfOpList} ) {
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
        {stakeWithConfOpList.map((stake) => (
          <StakerWithOperatorItem key={stake.stakeData.stakingProvider} totalStaked={totalStaked} stake={stake}/>
        ))}
      </tbody>
    </table>
  )
}
