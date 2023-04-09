import { IconButton } from '@mui/material';

interface ButtonProps {
  cond: boolean;
  true: any;
  icon: any;
  text: string;
  false: any | null;
  iconAlt: any | null;
  textAlt: string | null;
}

const IconPersoButton = (button: ButtonProps) => {
  return (
    <>
      {button.cond ? (
        <IconButton size="small" sx={{ ml: 2 }} onClick={button.true}>
          {button.icon}
          <span>{button.text}</span>
        </IconButton>
      ) : (
        <IconButton size="small" sx={{ ml: 2 }} onClick={button.false}>
          {button.iconAlt}
          <span>{button.textAlt}</span>
        </IconButton>
      )}
    </>
  );
};

export default IconPersoButton;
