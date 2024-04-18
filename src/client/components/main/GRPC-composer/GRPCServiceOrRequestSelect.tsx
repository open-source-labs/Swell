import React, { useState, useRef, useEffect } from 'react';
import dropDownArrow from '../../../../assets/icons/caret-down.svg';
import { $TSFixMe } from '../../../../types';
import { useAppSelector } from '../../../toolkit-refactor/hooks';


interface Props {
  value: string;
  items: string[];
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  defaultTitle: string;
  id: string;
}


const GRPCServiceOrRequestSelect: React.FC<Props> = (props) => {
  const isDark = useAppSelector((store: { ui: { isDark: boolean } }) => store.ui.isDark);

  const { 
    value, 
    items, 
    onClick, 
    defaultTitle, 
    id 
  } = props;

  const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false);
  const dropdownEl = useRef<null | HTMLDivElement >(null);

  useEffect(() => {
    const closeDropdown = (event: $TSFixMe) => {
      if (!dropdownEl.current.contains(event.target)) {
        setDropdownIsActive(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  const listItems: $TSFixMe[] = [];
  items.forEach((itemStr, index) => {
    if (value !== itemStr) {
      listItems.push(
        <a
          onClick={(e) => {
            setDropdownIsActive(false);
            onClick(e);
          }}
          key={`listItem${index}`}
          className="dropdown-item"
        >
          {itemStr}
        </a>
      );
    }
  });

  return (
    <div
      ref={dropdownEl}
      className={`mt-1 mb- dropdown ${dropdownIsActive ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          id={id}
          className={`button is-small is-outlined is-primary button-padding-verticals button-hover-color mr-3`}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setDropdownIsActive(!dropdownIsActive)}
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
          {listItems}
        </ul>
      </div>
    </div>
  );
};

export default GRPCServiceOrRequestSelect;
