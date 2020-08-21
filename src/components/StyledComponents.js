import styled from "styled-components";

const PRIMARY = "#292961";
const SECONDARY = "#296129";

export const AppContainer = styled.div``;
export const AppContent = styled.div``;
export const AppToolbar = styled.div`
  padding: 10px;
  display: flex;
  box-shadow: 0 0 5px 2px lightgrey;
  margin: 20px;
  border-radius: 0.4em;
`;

export const Button = styled.button`
  outline: none;
  margin: 0px 20px;
  font-size: larger;
  font-weight: bold;
  box-shadow: 0 0 10px 2px lightgray;
  background-color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 0.4em;
  color: ${PRIMARY};
  &:hover {
    background: ${PRIMARY};
    color: white;
  }
  &:disabled {
    background-color: lightgrey;
    color: white;
    cursor: not-allowed;
  }
  &:selected {
    background-color: blue;
  }
`;
export const Textbox = styled.p`
  font-size: 20px;
`;
export const Header = styled.h2``;
