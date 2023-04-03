import { Dispatch, SetStateAction } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import * as color from '../../UI/colorsPong';

const SliderPong = ({
  disabled,
  setWinScore
}: {
  disabled: boolean;
  setWinScore: Dispatch<SetStateAction<number>>;
}) => {
  const marks = [
    {
      value: 5,
      label: '5'
    },
    {
      value: 10,
      label: '10'
    },
    {
      value: 15,
      label: '15'
    },
    {
      value: 21,
      label: '21'
    }
  ];

  const valueText = (value: number) => {
    return `${value}`;
  };

  const handleChange = (
    event: React.SyntheticEvent | Event,
    value: number | Array<number>
  ) => {
    if (typeof value === 'number' && value > 0) setWinScore(value);
  };

  return (
    <Box>
      <Slider
        aria-label="Always visible"
        defaultValue={5}
        getAriaValueText={valueText}
        step={1}
        max={21}
        min={5}
        marks={marks}
        valueLabelDisplay="on"
        disabled={disabled}
        onChangeCommitted={handleChange}
        title="Set the win score"
        sx={{ color: color.PONG_PINK }}
      />
    </Box>
  );
};

export default SliderPong;
