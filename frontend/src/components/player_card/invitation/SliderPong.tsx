import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Dispatch, SetStateAction, useState } from 'react';

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
      />
    </Box>
  );
};

export default SliderPong;
