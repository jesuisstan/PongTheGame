import { Player } from '../../types/Player';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import * as colorPong from '../UI/colorsPong';

interface PongBadgeProps {
  color?: string;
  pulse?: boolean;
  player: Player;
  children: React.ReactNode;
}

const BadgePong = ({ color, pulse, player, children }: PongBadgeProps) => {
  const badgeColor = color
    ? color
    : player.status === 'PLAYING'
    ? colorPong.PONG_BLUE
    : player.status === 'ONLINE'
    ? 'green'
    : 'red';

  const StyledPulseBadge = styled(Badge)(({ theme }) => ({
    zIndex: 0,
    '& .MuiBadge-badge': {
      backgroundColor: badgeColor,
      color: badgeColor,
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.5s infinite ease-in-out',
        border: '2px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.5)',
        opacity: 2
      },
      '100%': {
        transform: 'scale(2.5)',
        opacity: 0
      }
    }
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    zIndex: 0,
    '& .MuiBadge-badge': {
      backgroundColor: badgeColor,
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`
    }
  }));

  return (player.status === 'OFFLINE' && pulse != true) || pulse === false ? (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      {children}
    </StyledBadge>
  ) : (
    <StyledPulseBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      {children}
    </StyledPulseBadge>
  );
};

export default BadgePong;
