import styled from "styled-components";
import { useState } from "react";
import axios from "axios";

const Title = styled.h1`
  margin: 1rem 2rem;
`;
const LangOptionContainer = styled.div`
  margin: 1rem 2rem;
`;
const LangLabel = styled.label``;
const SelectLanguage = styled.select``;
const LangOption = styled.option``;
const Conatiner = styled.div`
  display: flex;
`;
const CodeArea = styled.textarea`
  flex: 1;
  margin-left: 2rem;
  font-size: 20px;

  padding: 1rem;
`;
const OutputArea = styled.div`
  flex: 1;
  margin: 0 20px;
  padding: 1rem;
  border: 10px solid #cbcbcb;
  background-color: black;
  color: #fff;
  max-width: 400px;
  word-wrap: wrap wr;
`;
const OutputDetail = styled.p`
  margin-bottom: 1rem;
  padding: 0.4rem;
  font-size: 1.2rem;
  overflow-wrap: break-word;
  background-color: ${(props) =>
    props.type === "id" ? "orange" : props.type === "status" ? "purple" : ""};
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
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");
      const { data } = await axios.post("http://localhost:3030/run", payload);
      console.log(data);
      setJobId(data.jobId);
      let intervalId;

      // long polling to check the status and get the outout
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:3030/status",
          { params: { id: data.jobId } }
        );
        console.log(dataRes);
        const { success, job, error } = dataRes;

        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
          setStatus(jobStatus);
          if (jobStatus === "pending") return;
          setOutput(jobOutput);
          clearInterval(intervalId);
        } else {
          console.error(error);
          setStatus("Error: please retry");
          setOutput(error);
          clearInterval(intervalId);
        }
      }, 250);
    } catch ({ response }) {
      if (response) {
        setOutput(response.data.err);
      } else {
        setOutput("error connecting to the server");
      }
    }
  };
  return (
    <>
      <Title>Code Playground</Title>
      <LangOptionContainer>
        <LangLabel>Language : </LangLabel>
        <SelectLanguage
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
        >
          <LangOption value="cpp">cpp</LangOption>
          <LangOption value="py">python</LangOption>
          <LangOption value="js">javaScript</LangOption>
        </SelectLanguage>
      </LangOptionContainer>

      <Conatiner>
        <CodeArea
          rows="22"
          cols="100"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></CodeArea>
        <OutputArea>
          <OutputDetail type="id">Job ID: {jobId}</OutputDetail>
          <OutputDetail type="status">Status: {status}</OutputDetail>
          <OutputDetail>Output: {output}</OutputDetail>
        </OutputArea>
        ˀ
      </Conatiner>
      <SubmitButton onClick={handleSubmit}>Run</SubmitButton>
    </>
  );
}

export default App;
