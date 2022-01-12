import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

const Title = styled.h1`
  margin: 1rem 2rem;
`;
const Conatiner = styled.div`
  display: flex;
`;
const CodeArea = styled.textarea`
  margin-left: 2rem;
  font-size: 20px;
  flex: 2;
  min-width: 700px;
  padding: 1rem;
`;
const OutputArea = styled.div`
  flex: 1;
  margin: 0 20px;
  padding: 1rem;
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
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language: "cpp",
      code: code,
    };
    try {
      const result = await axios.post("http://localhost:3030/run", payload);
      setOutput(result.data.output);
    } catch (err) {
      setOutput(err.response.data.err.stderr);
    }
  };
  return (
    <>
      <Title>Code Playground</Title>
      <Conatiner>
        <CodeArea
          rows="22"
          cols="100"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></CodeArea>
        <OutputArea>{output}</OutputArea>ˀ
      </Conatiner>
      <SubmitButton onClick={handleSubmit}>Run</SubmitButton>
    </>
  );
}

export default App;
