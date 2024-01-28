import { cva } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../utils/classnames';

const Button = ({ children, varient, size, className, ...rest }) => {
  return (
    <button
      className={cn(buttonVarient({ varient, size }), className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

const buttonVarient = cva('leading-[26px] text-center font-medium', {
  variants: {
    size: {
      md: 'text-base h-[56px] rounded py-[15px] px-[14px]',
      sm: 'text-sm h-[42px] rounded px-[8px]',
      xm: 'text-sm h-[34px] px-[16px]  py-[4px]',
    },
    varient: {
      primary: 'text-[#0E0E0E] bg-[#EEEEEE]',
      secondary:
        'text-[#707070] bg-[#D6D8DC] border-[1px] border-[#D6D8DC] hover:bg-[#D6D8DC]',
      destructive: 'text-[#E30C40] bg-transparent',
      'primary-outline':
        'hover:text-white hover:bg-[#2B86FC] text-[#0E0E0E] bg-[#EEEEEE]',
      'destructive-outline':
        'hover:bg-[#E30C40] hover:text-white bg-[#FBD6D8] text-[#E30C40]',
    },
  },
});
