import React from 'react';

import { styled } from '../utils/stitches.conf';
import { OrderBook } from './order-book';

export const Dashboard = () => {
  return (
    <DashboardWrapper>
      <DashboardContainer>
        <OrderBook />
      </DashboardContainer>
    </DashboardWrapper>
  );
};

const DashboardWrapper = styled('main', {
  maxWidth: '100vw',
  maxHeight: '100vh',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  overflow: 'hidden',
});

const DashboardContainer = styled('div', {
  background: '$bg',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
});
