import { NextPage } from "next";
import React, { ReactNode, useEffect } from "react";
import Header from "@/components/Layout/Header";
import Head from "next/head";
import Footer from "@/components/Layout/Footer";
import moment from "moment";
import { useAppSelector } from "@/redux/hook";
import NavMobile from "@/components/Layout/NavMobile";
const Layout: NextPage<{
  children: ReactNode;
}> = ({ children }) => {
  useEffect(() => {
    moment.locale("vi");
  }, []);

  return (
    <>
      <Head>
        <title>ChiChi - Shop</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.png" />
      </Head>
      <NavMobile />
      <div className="relative bg-white w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-x-hidden">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
