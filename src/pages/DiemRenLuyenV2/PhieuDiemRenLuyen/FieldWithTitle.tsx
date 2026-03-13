import { Typography } from 'antd';
import { type ReactNode } from 'react';

interface Props {
  title: string|ReactNode;
  children: ReactNode;
}

export const FieldWithTitle = ({ children, title }: Props) => {
  return (
    <div>
      <Typography style={{ marginBottom: '8px', fontWeight: 500, fontSize: '16px' }}>
        {title}
      </Typography>
      {children}
    </div>
  );
};
