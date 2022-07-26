/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import moment from "moment";
import { Badge, Tag } from "antd";
import { MessageOutlined, StarOutlined } from "@ant-design/icons";
import { TitleContainer, DescriptionContainer } from "../styles/QuestionStyle";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const QuestionItem = ({ question }) => {
  const parsedContents = JSON.parse(question.contents);

  const filteredBlocks =
    parsedContents &&
    parsedContents.blocks.map(({ type, data }) => {
      return type === "paragraph" || type === "header" ? data : "";
    });

  const texts = filteredBlocks.map((block) => block.text).slice(0, 1);

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const getAnswerLength = async () => {
      const response = await axios.get(`/api/qnas/${question._id}`);
      setAnswers([...response.data.Answers]);
    };
    getAnswerLength();
  }, []);

  return (
    <div key={question._id}>
      <div css={TitleContainer}>
        <Badge count={answers.length}>
          <MessageOutlined />
        </Badge>
        <Link href={`/qna/${question._id}`}>{question.title}</Link>
      </div>
      <div css={DescriptionContainer}>
        {texts.map((text, index) => (
          <span className="descriptions" key={index}>
            {text}
          </span>
        ))}
        <div className="tag-container">
          <div>
            {question.tags.map((tag, idx) => {
              return <Tag key={idx}>{tag}</Tag>;
            })}
          </div>
          <span>{`(${question.author}이/가 ${moment(question.createdAt).format(
            "YYYY월 MM월 DD일",
          )}에 질문함)`}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
