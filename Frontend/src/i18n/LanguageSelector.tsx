import { Box, SystemStyleObject } from "@chakra-ui/react";
import StyledSelect, { Option } from "../components/StyledSelect";
import { useSwitchLanguage } from "./useSwitchLanguage";

const langOption: Option[] = [
  { value: "en", label: "English" },
  {
    value: "he",
    label: "עברית",
  },
];

function LanguageSelector({ style }: { style?: SystemStyleObject }) {
  const { lang, setLang } = useSwitchLanguage();
  function handleLangChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLang(e.target.value);
  }

  return (
    <Box as='span' sx={style}>
      <StyledSelect
        options={langOption}
        value={lang}
        onChange={handleLangChange}
        width='10rem'
        fontSize='1.2rem'
      />
    </Box>
  );
}

export default LanguageSelector;
