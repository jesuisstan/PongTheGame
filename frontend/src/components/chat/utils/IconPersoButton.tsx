import { IconButton } from '@mui/material';

interface ButtonProps {
  cond: boolean;
  true: any;
  icon: any;
  text: string;
  false?: any | null;
  iconAlt?: any | null;
  textAlt?: string | null;
};

const IconPersoButton = (button: ButtonProps) => {
  return (
    <>
  { button.cond
    ? <IconButton size="small" sx={{ml:2}} onClick={button.true}>
		    {button.icon}
		    <div className="black">{button.text}</div>
	    </IconButton>
    : <IconButton size="small" sx={{ml:2}} onClick={button.false}>
		    {button.iconAlt}
		    <div className="black">{button.textAlt}</div>
	    </IconButton>
  }
    </>
  );
};

export default IconPersoButton;
