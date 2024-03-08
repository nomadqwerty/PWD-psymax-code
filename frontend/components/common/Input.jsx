import React from 'react';

const Input = ({ value, placeholder,type, ...rest }) => {
  return (
    <div>
      <input
        className="bg-transparent py-[15px] px-[8px] text-[#707070] text-base h-[56px] focus-within:outline-0 border-[1px] rounded "
        type={type}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default Input;
