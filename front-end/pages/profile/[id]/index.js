/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import wrapper from "../../../store";
import ProfileNav from "../../../components/userProfile/ProfileNav";
import AppLayout from "../../../components/AppLayout";
import ProfileCard from "../../../components/userProfile/ProfileCard";
import ProfileMyInfo from "../../../components/userProfile/ProfileMyInfo";
import { ProfileContentContainer } from "../profileStyle";
import { myinfo } from "../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <ProfileNav />
      <div css={ProfileContentContainer}>
        <ProfileCard me={me} />
        <ProfileMyInfo me={me} />
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const cookie = req?.headers.cookie;
  axios.defaults.headers.Cookie = "";
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  await store.dispatch(myinfo());
  return {
    props: {},
  };
});

export default Profile;
