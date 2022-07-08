/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { Button, Input, Divider } from "antd";
import QuestionsList from "./QuestionsList";
import { FlexBox } from "../styles/QuestionStyle";
import Link from "next/link";

const Questions = ({ questions }) => {
  return (
    <>
      <div css={FlexBox}>
        <Input.Search
          placeholder="input search text"
          allowClear
          enterButton
          size="large"
          onSearch={() => {}}
        />
        <Link href="/questions/new">
          <Button size="large" type="primary">
            질문하기
          </Button>
        </Link>
      </div>
      <Divider plain />
      <QuestionsList questions={questions} />
    </>
  );
};

export default Questions;
