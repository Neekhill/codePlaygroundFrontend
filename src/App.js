import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";

const SettingOptions = styled.div`
  display: flex;
  align-items: center;
`;
const SelectOptionContainer = styled.div`
  margin: 1rem 2rem;
`;
const SelectLabel = styled.label``;
const Select = styled.select``;
const SelectOption = styled.option``;
const Conatiner = styled.div`
  display: flex;
  margin-left: 2rem;
`;

const OutputArea = styled.div`
  flex: 1;
  margin: 0 20px;
  padding: 1rem;
  //border: 10px solid #cbcbcb;
  background-color: black;
  color: #fff;
  width: 25vw;
  height: 70vh;
  word-wrap: wrap wr;
`;
const OutputDetail = styled.p`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  overflow-wrap: break-word;
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
  let [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (language === "python") {
      language = "py";
    }
    if (language === "javascript") {
      language = "js";
    }
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
      }, 5000);
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
      <Navbar />
      <SettingOptions>
        <SelectOptionContainer>
          <SelectLabel>Language : </SelectLabel>
          <Select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <SelectOption value="javascript">javaScript</SelectOption>
            <SelectOption value="python">python</SelectOption>
            <SelectOption value="cpp">cpp</SelectOption>
          </Select>
        </SelectOptionContainer>

        <SubmitButton onClick={handleSubmit}>Run</SubmitButton>
      </SettingOptions>

      <Conatiner>
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
        <OutputArea>
          <OutputDetail type="id">Job ID: {jobId}</OutputDetail>
          <OutputDetail type="status">Status: {status}</OutputDetail>
          <OutputDetail>Output: {output}</OutputDetail>
        </OutputArea>
        ˀ
      </Conatiner>
    </>
  );
}

export default App;
