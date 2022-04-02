import { css } from "styled-components";

const mobile = (props) => {
  return css`
    @media only screen and (max-width: 380px) {
      ${props}
    }
  `;
};
const largeMobile = (props) => {
  return css`
    @media only screen and (max-width: 590px) {
      ${props}
    }
  `;
};

const tablet = (props) => {
  return css`
    @media only screen and (max-width: 768px) {
      ${props}
    }
  `;
};
const tabletPlus = (props) => {
  return css`
    @media only screen and (max-width: 968px) {
      ${props}
    }
  `;
};
const large = (props) => {
  return css`
    @media only screen and (max-width: 1090px) {
      ${props}
    }
  `;
};
const Xlarge = (props) => {
  return css`
    @media only screen and (max-width: 1290px) {
      ${props}
    }
  `;
};

export { mobile, largeMobile, tablet, tabletPlus, large, Xlarge };
