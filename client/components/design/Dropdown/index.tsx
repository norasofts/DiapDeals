import React, { FC } from "react";

interface Drop {
  setOpenDropdown?: React.SetStateAction<any>;
  selected?: any;
  openDropdown?: any;
}

const Dropdown: FC<Drop> = ({ setOpenDropdown, selected, openDropdown }) => {
  return (
    <button
      id="dropdown-button"
      data-dropdown-toggle="dropdown"
      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
      type="button"
      onBlur={() => {
        const timer = setTimeout(() => {
          setOpenDropdown(false);
          clearTimeout(timer);
        }, 100);
      }}
      onClick={() => setOpenDropdown(!openDropdown)}
    >
      {selected}
      <svg
        aria-hidden="true"
        className="ml-1 w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default Dropdown;
