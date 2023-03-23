import { NextPage } from "next";
import React, { ReactNode, useEffect, useRef } from "react";
import Header from "@/components/Layout/Header";
import Head from "next/head";
import Footer from "@/components/Layout/Footer";
import moment from "moment";
import NavMobile from "@/components/Layout/NavMobile";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import OrderModal from "@/components/Modal/OrderModal";
import Backdrop from "@/components/Modal/Backdrop";
import { Socket, io } from "socket.io-client";
import { toggleUpdateRealtime } from "@/redux/features/isSlice";
import { useRouter } from "next/router";
import Meta from "../Meta";
const socket: Socket = io(process.env.NEXT_PUBLIC_BASE_URL as string);

const Layout: NextPage<{
  children: ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const { orderModal } = useAppSelector((state) => state.orderSlice);
  const { isOpenBackdrop } = useAppSelector((state) => state.isSlice);
  useEffect(() => {
    moment.locale("vi");
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket initialization");
      socket.on("updateOrder", () => {
        dispatch(toggleUpdateRealtime())
        router.replace(router.asPath);
      });
    });
  }, []);

  return (
    <>
     <Meta title="Chi Chi - Handmade" description="Website bán đồ thủ công , tự làm" image="" />
      <NavMobile />
      {isOpenBackdrop && <Backdrop />}
      {orderModal.isOpen && <OrderModal />}
      <div className="relative bg-white w-screen h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 overflow-x-hidden">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
