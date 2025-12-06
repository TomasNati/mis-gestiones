import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CopyButton = ({ onClick, isCopied }: { onClick: () => void; isCopied: boolean }) => (
  <Tooltip title="Copied!" placement="top" open={isCopied}>
    <IconButton onClick={onClick} size="small" aria-label="copy">
      {isCopied ? (
        <CheckCircleIcon fontSize="small" sx={{ color: 'lightgreen' }} />
      ) : (
        <ContentCopyIcon fontSize="small" />
      )}
    </IconButton>
  </Tooltip>
);

interface TextWithCopyProps {
  displayText: string;
  copyText?: string;
  copyButtonAlignment?: 'left' | 'right';
  maxWidth?: number | string;
}

export const TextWithCopy = ({
  displayText,
  copyText,
  copyButtonAlignment = 'left',
  maxWidth = '100%',
}: TextWithCopyProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText || displayText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  const iconVisibility = isHovering;

  return (
    <Box
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, maxWidth }}
    >
      {copyButtonAlignment === 'left' && iconVisibility && <CopyButton onClick={handleCopy} isCopied={isCopied} />}
      <Typography
        variant="body2"
        noWrap
        title={displayText}
        sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {displayText}
      </Typography>
      {copyButtonAlignment !== 'left' && iconVisibility && <CopyButton onClick={handleCopy} isCopied={isCopied} />}
    </Box>
  );
};
