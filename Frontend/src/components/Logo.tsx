import { Container, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { isDevelopmentEnvironment } from "../services/utils";
const imgSrc =
  (isDevelopmentEnvironment ? "" : "/quik") + "/assets/logo/logo.webp";
function Logo() {
  const navigate = useNavigate();
  return (
    <Container centerContent maxHeight='11rem'>
      <Image
        src={imgSrc}
        alt='logo'
        maxHeight='13rem'
        display='block'
        paddingTop='1rem'
        onClick={() => navigate("/")}
        cursor='pointer'
      />
    </Container>
  );
}

export default Logo;
