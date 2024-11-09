'use client';
import React from 'react';
import { styled } from '@linaria/react';

type Props = {
  //
};

const Btn = styled.button`
  padding: 4px 12px;
  background-color: #dfdfdf;
`;

export const Button: React.FC<Props> = ({}: Props) => {
  const [label, setLabel] = React.useState<string | null>(null);
  React.useEffect(() => {
    setLabel('SandBox Button!');
  }, []);
  if (label === null) {
    return null;
  }
  return <Btn type="button">{label}</Btn>;
};
