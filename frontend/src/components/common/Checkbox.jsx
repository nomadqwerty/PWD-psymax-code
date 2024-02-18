import React from 'react';
import { Check as CheckIcon } from '@mui/icons-material';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

const Checkbox = ({ onChange, value, checked, defaultChecked, ...rest }) => {
  return (
    <RadixCheckbox.Root
      className="h-[24px] w-[24px] bg-[#EEEEEE] transition rounded flex items-center justify-center data-checked:bg-[#2B86FC]"
      onCheckedChange={onChange}
      value={value}
      checked={checked}
      defaultChecked={defaultChecked}
    >
      <RadixCheckbox.Indicator>
        <CheckIcon checked fontSize="small" className="text-white" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
};

export default Checkbox;
