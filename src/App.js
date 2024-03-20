import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import { large, largeMobile } from "./responsive";
import BASE_URL from "./constants";

const SettingOptions = styled.div`
  display: flex;
  align-items: center;
  ${largeMobile({ flexWrap: "wrap", paddingLeft: "0rem" })};
`;
const SelectOptionContainer = styled.div`
  margin: 1rem 2rem;
  ${largeMobile({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginRight: "5px",
  })};
`;
const SelectLabel = styled.label``;
const Select = styled.select`
  padding: 1px 7px;
`;
const SelectOption = styled.option``;

const Conatiner = styled.div`
  display: flex;
  margin-left: 2rem;
  ${large({ flexDirection: "column", alignItems: "center", margin: "1rem" })}
`;
const EditorContainer = styled.div`
  flex: 2;
  width: 60vw;
  border: 1px solid lightgray;
  ${large({ flex: "1", width: "90vw", height: "50vh" })};
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
  word-wrap: wrap;
  ${large({ width: "90%", margin: "20px 0px" })}
`;
const OutputDetail = styled.p`
  margin-bottom: 1rem;
  overflow-wrap: break-word;
`;

const SubmitButton = styled.button`
  margin: 1rem 2rem;
  padding: 0.5rem 2rem;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: teal;
    color: white;
    transition: all 0.4s ease;
  }
`;
function App() {
  const [code, setCode] = useState("");
  let [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("vs-light");
  const [font, setFont] = useState(14);

  const handleEditorChange = (value, event) => {
    setCode(value);
  };
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
      const { data } = await axios.post(`${BASE_URL}/run`, payload);
      console.log(data);
      setJobId(data.jobId);
      let intervalId;

      // long polling to check the status and get the outout
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(`${BASE_URL}/status`, {
          params: { id: data.jobId },
        });
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
      }, 1000);
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

        <SelectOptionContainer>
          <SelectLabel>Theme : </SelectLabel>
          <Select
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
            }}
          >
            <SelectOption value="vs-light">light</SelectOption>
            <SelectOption value="vs-dark">dark</SelectOption>
          </Select>
        </SelectOptionContainer>

        <SelectOptionContainer>
          <SelectLabel>Font : </SelectLabel>
          <Select
            value={font}
            onChange={(e) => {
              setFont(e.target.value);
            }}
          >
            <SelectOption value={12}>12</SelectOption>
            <SelectOption value={14}>14</SelectOption>
            <SelectOption value={16}>16</SelectOption>
            <SelectOption value={18}>18</SelectOption>
            <SelectOption value={20}>20</SelectOption>
            <SelectOption value={22}>22</SelectOption>
          </Select>
        </SelectOptionContainer>
        <SubmitButton onClick={handleSubmit}>Run</SubmitButton>
      </SettingOptions>

      <Conatiner>
        <EditorContainer>
          <Editor
            height="75vh"
            border
            defaultLanguage="javascript"
            language={language}
            defaultValue="/* write your code here */"
            onChange={handleEditorChange}
            options={{
              theme: theme,
              fontSize: font,
            }}
          />
        </EditorContainer>
        <OutputArea>
          Output:
          {jobId && <OutputDetail>Job ID: {jobId}</OutputDetail>}
          {status && <OutputDetail>Status: {status}</OutputDetail>}
          {output && <OutputDetail> {output}</OutputDetail>}
        </OutputArea>
        ˀ
      </Conatiner>
    </>
  );
}

export default App;
