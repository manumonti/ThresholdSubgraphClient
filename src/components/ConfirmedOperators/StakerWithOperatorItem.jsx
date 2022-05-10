import React from 'react';
import { ethers } from 'ethers';

export function StakerWithOperatorItem( {totalStaked, stake} ) {

  const convertAmount = (amount) => {
    amount = ethers.BigNumber.from(amount)
    return amount.div(ethers.BigNumber.from(10).pow(18)).toString();
  }

  const calcPercentage = (amount, totalStaked) => {
    amount = ethers.BigNumber.from(amount)
    totalStaked = ethers.BigNumber.from(totalStaked)
    amount = amount.div(ethers.BigNumber.from(10).pow(18))
    totalStaked = totalStaked.div(ethers.BigNumber.from(10).pow(18))
    // console.log(amount)
    return (amount.toNumber()/totalStaked.toNumber()*100).toFixed(4);
  }

  return (
    <tr>
    <td>{stake.stakeData.stakingProvider}</td>
    <td>{stake.stakeData.owner}</td>
    <td>{convertAmount(stake.amount)}</td>
    <td>{calcPercentage(stake.amount, totalStaked)} %</td>
  </tr>
  )
}
