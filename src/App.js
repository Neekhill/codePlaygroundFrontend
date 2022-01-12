import styled from "styled-components";

const Title = styled.h1`
  margin: 2rem;
`;
const Conatiner = styled.div`
  display: flex;
`;
const CodeArea = styled.textarea`
  margin-left: 2rem;
  font-size: 20px;
  flex: 2;
`;
const OutputArea = styled.div`
  flex: 1;
  margin: 0 20px;
  padding: 5px;
  border: 1px solid black;
`;
const SubmitButton = styled.button`
  margin: 1rem 2rem;
  padding: 0.5rem 2rem;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
function App() {
  return (
    <>
      <Title>Code Playground</Title>
      <Conatiner>
        <CodeArea rows="22" cols="100"></CodeArea>
        <OutputArea></OutputArea>ˀ
      </Conatiner>
      <SubmitButton>Run</SubmitButton>
    </>
  );
}

export default App;
