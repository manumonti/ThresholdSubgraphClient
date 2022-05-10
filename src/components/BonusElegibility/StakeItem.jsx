import React from 'react';
import { ElegibilityCheck } from './ElegibilityCheck';

export function StakeItem({ stake }) {
  return (
    <div>
      <li>
        <h3>Stake:</h3>
        <div>Staking Provider address: {stake.stakeData.stakingProvider}</div>
        <div>Stake Type: {stake.stakeData.stakeType}</div>
        <div>Amount: {Math.round(stake.amount/Math.pow(10, 18))}</div>
        <ElegibilityCheck stakingProvider={stake.stakeData.stakingProvider} />
      </li>
    </div>
  );
}

