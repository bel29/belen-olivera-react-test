import React from "react";
import { InputGroup, InputGroupText, Input } from "reactstrap";
import { SearchBoxProps } from "../../types/utils";
import style from "../../styles/SearchBox.module.scss";

const SearchBox: React.FC<SearchBoxProps> = ({ search, setSearch }) => {
  return (
    <InputGroup className={style.inputGroup}>
      <InputGroupText className={style.searchIcon}>
        <i className="fas fa-search"></i>
      </InputGroupText>
      <Input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={style.searchBox}
      />
    </InputGroup>
  );
};

export default SearchBox;
