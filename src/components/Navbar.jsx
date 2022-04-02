import styled from "styled-components";
import { largeMobile } from "../responsive";
const Container = styled.div`
  height: 60px;
  color: #fff;
  background-color: #2a2424;
  //padding: 10px;
  position: sticky;
  top: 0;
  z-index: 999;
`;
const Wrapper = styled.div`
  padding: 10px 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${largeMobile({ padding: "1rem" })};
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 26px;
  ${largeMobile({ fontSize: "20px" })};
`;

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Left>
          <Logo>{`</> CodingPLayground`}</Logo>
        </Left>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
