import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
type SearchbarProps = {
  paramKey?: string;
};
function SearchBar({ paramKey = "query" }: SearchbarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery(searchParams.get(paramKey) || "");
  }, [searchParams, paramKey]);
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value;
    setQuery(newQuery);
    searchParams.set(paramKey, newQuery);
    if (searchParams.get(paramKey)?.length == 0) {
      searchParams.delete(paramKey);
    }
    setSearchParams(searchParams);

    // if (newQuery.length > 0) {
    //   searchParams.set(paramKey, newQuery);
    //   setSearchParams(searchParams);
    // } else {
    //   setSearchParams(searchParams);
    // }
  }

  return (
    <InputGroup width='40rem' _focus={{ minWidth: "60rem" }} size={"lg"}>
      <InputLeftElement pointerEvents='none'>
        <TbSearch />
      </InputLeftElement>
      <Input
        value={query}
        onChange={handleChange}
        focusBorderColor='teal.400'
      ></Input>
    </InputGroup>
  );
}

export default SearchBar;
