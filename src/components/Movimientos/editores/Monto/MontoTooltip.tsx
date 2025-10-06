import { transformNumberToCurrenty } from '@/lib/helpers';
import { Tooltip } from '@mui/material';
import React from 'react';

interface MontoTooltipProps {
  tooltip: string;
  formulaValue?: string;
  children: React.ReactElement;
}

export const MontoTooltip: React.FC<MontoTooltipProps> = ({ tooltip, formulaValue, children }) => {
  const valueAsNumber = formulaValue ? parseFloat(formulaValue) : undefined;
  const formatedValue = transformNumberToCurrenty(valueAsNumber);

  return (
    <Tooltip
      title={
        tooltip?.length > 0 ? (
          <span>
            {tooltip.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
            <>
              {'------------------'}
              <br />
              {formatedValue ? `${formatedValue}` : 'No hay resultado'}
            </>
          </span>
        ) : (
          `${formatedValue || ''}`
        )
      }
      arrow
    >
      {children}
    </Tooltip>
  );
};
