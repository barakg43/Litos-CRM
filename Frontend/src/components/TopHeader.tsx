import { Grid, GridItem } from "@chakra-ui/react";
import UserPanel from "../features/auth/UserPanel";
import LanguageSelector from "../i18n/LanguageSelector";
import SearchBar from "./SearchBar";

function TopHeader() {
  return (
    <Grid
      as='header'
      templateColumns='1fr 2fr 1fr 1fr'
      fontSize='x-large'
      justifyContent='flex-end'
      borderBottom='2px solid var(--color-primary-300)'
      boxShadow='xl'
      gap='2.4rem'
      padding='0.5rem 1rem'
      bgColor={"var(--color-primary-0)"}
      height='5rem'
      alignItems='center'
    >
      <GridItem alignContent={"center"}>
        <SearchBar />
      </GridItem>
      <GridItem alignContent='end'>
        <LanguageSelector />
      </GridItem>
      <GridItem>
        <UserPanel />
      </GridItem>
    </Grid>
  );
}

export default TopHeader;
