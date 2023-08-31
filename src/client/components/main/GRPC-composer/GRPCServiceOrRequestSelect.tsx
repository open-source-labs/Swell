import React from 'react';
import dropDownArrow from '../../../../assets/icons/caret-down.svg';
import useDropdownState from '~/hooks/useDropdownState';

interface Props {
  value: string;
  items: string[];
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  defaultTitle: string;
  id: string;
}

const GRPCServiceOrRequestSelect: React.FC<Props> = ({
  value,
  items,
  onClick,
  defaultTitle,
  id,
}) => {
  const { dropdownIsOpen, dropdownRef, toggleDropdown, closeDropdown } =
    useDropdownState();

  return (
    <div
      ref={dropdownRef}
      className={`mt-1 mb- dropdown ${dropdownIsOpen ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          id={id}
          className="button is-small is-outlined is-primary mr-3"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleDropdown}
        >
          <span>{value}</span>
          <span className="icon is-small">
            <img
              src={dropDownArrow}
              className="is-awesome-icon"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <ul className="dropdown-content">
          {/**
           * @todo 2023-08-31 - This markup needs love and care. Originally this
           * was a list of <a> elements, even though onClick isn't valid on it.
           * I changed it to <button> (adding type="button" to avoid any
           * possible weird interactions with <form> elements higher up), but
           * this still probably isn't right.
           *
           * I'm wondering if this should be a radio button or one of the other
           * <input> elements, in which case, onClick should become onChange.
           *
           * Also, because this is inside a <ul>, the markup should include
           * <li> elements around each main item element. Didn't do that because
           * I didn't have time to verify whether that would break any CSS.
           */}
          {items.map((itemText, i) => (
            <button
              key={i}
              type="button"
              className="dropdown-item"
              onClick={(e) => {
                closeDropdown();
                onClick(e);
              }}
            >
              {itemText}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GRPCServiceOrRequestSelect;
