import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import "antd/dist/antd.css";
import { useEffect } from "react";
import wrapper from "../store/index";
import { useSelector, useDispatch } from "react-redux";
import { userinfo } from "../actions/user";
import userSlice from "../reducers/user";
import { useCallback } from "react";
const MyApp = ({ Component, pageProps }) => {
  const dispatch = useDispatch();
  const { isLoggedin } = useSelector((state) => state.user);
  const getuserInfo = useCallback(() => {
    dispatch(userinfo(isLoggedin));
    console.log("check실행");
  }, [isLoggedin]);

  const checkLoginStatus = useCallback(() => {
    dispatch(userSlice.actions.checkLoggedin());
    const checkStorage = localStorage.getItem("token");
    if (!checkStorage) {
      return;
    }
    dispatch(userSlice.actions.addLoginStatus(checkStorage));
    getuserInfo();
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>CFD</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default wrapper.withRedux(MyApp);