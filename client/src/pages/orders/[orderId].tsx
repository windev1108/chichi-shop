import Layout from "@/components/Layout";
import { getOrderById } from "@/lib/orders";
import { Order } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import React from "react";

export const getServerSideProps = async ({
  req,
  query,
}: GetServerSidePropsContext) => {
  const { orderId } = query;
  const { order } = await getOrderById({ orderId: orderId as string });

  console.log('query',query);

  return {
    props: {
      order: order || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const OrderDetail: NextPage<{ order: Order }> = ({ order }) => {
    console.log('order',order);
  return (
    <Layout>
      <h1>{JSON.stringify(order)}</h1>
    </Layout>
  );
};

export default OrderDetail;
