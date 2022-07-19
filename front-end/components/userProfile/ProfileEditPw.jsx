/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import { Card, message } from "antd";
import { useForm } from "react-hook-form";
import { myInfoSubmitBtnStyle } from "./styles/MyInfoStyles";
import { EditPwContainer, EditPwFormStyle } from "./styles/ProfileEditPwStyles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { editPassword } from "../../actions/user";
const ProfileEditPw = () => {
  const dispatch = useDispatch();
  const { editPasswordDone, editPasswordError } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editPasswordDone) {
      message.success("성공적으로 비밀번호가 변경되었습니다.");
    }
    if (editPasswordError) {
      message.error("비밀번호 변경 중 에러가 발생했습니다.");
    }
  }, [editPasswordDone, editPasswordError]);

  const onSubmit = (data) => {
    console.log(data);
    // dispatch(editPassword(data.password));
  };
  return (
    <Card css={EditPwContainer}>
      <div css={EditPwFormStyle}>
        <h2>비밀번호 변경</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="새 비밀번호">새 비밀번호</label>
            <p>영문, 숫자를 포함한 8자 이상 15자 이하의 비밀번호를 입력해주세요.</p>
            <input
              type="password"
              autoComplete="off"
              {...register("password", { required: true })}
            />
          </div>
          <label htmlFor="새 비밀번호">새 비밀번호 확인</label>
          <input
            type="password"
            autoComplete="off"
            {...register("passwordConfirm", { required: true })}
          />
          <input css={myInfoSubmitBtnStyle} type="submit" value={"회원정보 변경"} />
        </form>
      </div>
    </Card>
  );
};
export default ProfileEditPw;
