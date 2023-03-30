import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Player } from '../../types/Player';

interface PongBadgeProps {
  player: Player;
  children: React.ReactNode; // Add children prop here
}

const PongBadge = ({ player, children }: PongBadgeProps) => {
  const badgeColor =
    player.status === 'PLAYING'
      ? 'rgb(37, 120, 204)'
      : player.status === 'ONLINE'
      ? 'green'
      : 'rgba(253, 80, 135, 0.91)';

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: badgeColor,
      color: badgeColor,
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.5s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""'
      }
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0
      }
    }
  }));

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      {children}
    </StyledBadge>
  );
};

export default PongBadge;
