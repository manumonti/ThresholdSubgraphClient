import React from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import {
  useQuery,
  gql
} from "@apollo/client";
import { StakerWithOperatorList } from './StakerWithOperatorList';

const TIMESTAMP = "1652659199" // May 15 2022 23:59:59 GMT

export function ConfirmedOperatorsData( ) {

  const [showState, setShowState] = useState(false);

  const handleShow = () => {
    setShowState(!showState);
  }

  // Todo: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const STAKERS_QUERY = gql`
    query GetStakers ($TIMESTAMP: String){
      epoches(
        orderBy: startTime
        orderDirection: desc
        first: 1
        where: {startTime_lte: $TIMESTAMP}
      ) {
        totalStaked
        stakes (first: 1000){
          amount
          stakeData {
            stakingProvider
            owner
          }
        }
      }
    }
  `;

  const OPERATOR_QUERY = gql`
  query GetOperators {
    confirmedOperators {
      stakingProvider
    }
  }
  `;

const { loading, error, data } = useQuery(STAKERS_QUERY, {variables: {TIMESTAMP}});
const { loading: loadingOp, error: errorOp, data: dataOp } = useQuery(OPERATOR_QUERY);

if (loading || loadingOp) return <div>Loading...</div>;
if (error || errorOp ) return <div>Error :(</div>;

// Stake list from Staking events
const stakeList = data.epoches[0].stakes
// Staking Provider list from Confirmed Operators events
const stakingProvWithConfOpList = dataOp.confirmedOperators.map(operator => operator.stakingProvider);

const stakeWithConfOpList = stakeList.filter(
  stake => (stakingProvWithConfOpList.indexOf(stake.stakeData.stakingProvider) >= 0 )
)

const totalStaked = ethers.BigNumber.from(data.epoches[0].totalStaked);
const amountList = stakeWithConfOpList.map(stake => ethers.BigNumber.from(stake.amount))
let tokenAmount = ethers.BigNumber.from(0)
for (let i = 0; i < amountList.length; i++) {
  tokenAmount = tokenAmount.add(amountList[i])
}

const tokenAmountEther = tokenAmount.div(ethers.BigNumber.from(10).pow(18));
const totalStakedEther = totalStaked.div(ethers.BigNumber.from(10).pow(18));

const stakersOpConfirmedPercentaje = (stakeWithConfOpList.length / stakeList.length * 100).toFixed(2);
const stakesOpConfirmedPercentaje = (tokenAmountEther.toNumber() / totalStakedEther.toNumber() * 100).toFixed(2);


  return (
    <div>
      <div>Number of stakes with Confirmed Operator:</div>
      <div>{stakeWithConfOpList.length} of {stakeList.length} ({stakersOpConfirmedPercentaje}%)</div>
      <div>Number of tokens staked by Confirmed Operator stakers (T, Nu & Keep):</div>
      <div>{tokenAmountEther.toString()} of {totalStakedEther.toString()} ({stakesOpConfirmedPercentaje.toString()}%)</div>
      <h3>List of stakers with confirmed operator:</h3>
      <button onClick={handleShow}>Show</button>
      {showState && <StakerWithOperatorList totalStaked={totalStaked} stakeWithConfOpList={stakeWithConfOpList}/>}
    </div>
  )
}
