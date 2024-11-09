import React from 'react';
import { styled } from '@linaria/react';

const Div = styled.div`
  padding: 4px 12px;
  background-color: #dfdfdf;
`;

export const Box: React.FC = () => {
  return <Div>box</Div>;
};
