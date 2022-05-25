import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import { StakeItem } from './StakeItem';

export function StakeList({ ownerAddress, timestamp }) {

  // Todo: Max amount of items you can get in a query is 100.
  // adding 'first: 1000' is a WA to get more than 100 stakes,
  // but the most correct option is to use GraphQL pagination.
  const STAKERS_QUERY = gql`
    query GetBonusStakes ($timestamp: String){
      epoches(
        orderBy: startTime
        orderDirection: desc
        first: 1
        where: {startTime_lte: $timestamp}
      ) {
        totalStaked
        stakes (first: 1000){
          amount
          stakeData {
            id
            owner {
              id
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(STAKERS_QUERY, {variables: {timestamp}});

  if (!ownerAddress) return <div></div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error {error.message}</div>;

  const stakeList = data.epoches[0].stakes.filter((stake) => stake.stakeData.owner.id === ownerAddress)

  if (stakeList.length === 0) {
    return <div>No stakes for this address!</div>
  }

  return (
    <ul>
      {stakeList.map((stake) => (
        <StakeItem key={stake.stakeData.id} stake={stake} />
      ))}
    </ul>
  );
}
