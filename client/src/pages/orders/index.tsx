import Layout from "@/components/Layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import { User } from "@/utils/types";
import { getUserById } from "@/lib/users";
import Navigation from "@/components/Nav/Navigation";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Order from "@/components/Items/Order";

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session: any = await getServerSession(req, res, authOptions);
  const { user }: { user: User } = await getUserById({ id: session?.user?.id });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
      user: user || null,
      origin: `${
        req.headers.host?.includes("localhost") ? "http" : "https"
      }://${req.headers.host}`,
    },
  };
};

const Orders: NextPage<{ user: User }> = ({ user }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isUpdateRealtime } = useAppSelector((state) => state.isSlice);

  React.useEffect(() => {
    router.replace(router.asPath);
  }, [isUpdateRealtime]);

 

  return (
    <Layout>
      <div className="grid grid-cols-9 m-40 gap-2 h-screen">
        {session?.user.id === user?.id ? (
          <Navigation user={user} />
        ) : (
          <div className="col-span-2"></div>
        )}
        <div className="col-span-7 space-y-4">
          <div className="flex justify-around shadow-md h-12 items-center">
            <h1>Tất cả</h1>
            <h1>Chờ thanh toán</h1>
            <h1>Vận chuyển</h1>
            <h1>Đang giao</h1>
            <h1>Hoàn thành</h1>
            <h1>Đã Hủy</h1>
            <h1>Trả hàng / Hoàn tiền</h1>
          </div>

          <div className="space-y-4">
            {user?.orders?.map(
              ({
                totalPayment,
                status,
                products,
                transportFee,
                user: userOrder,
                createdAt,
                id,
              }) => (
                <Order
                id={id!}
                key={id}
                status={status!}
                products={products!}
                totalPayment={totalPayment!}
                transportFee={transportFee!}
                user={userOrder!}
                createdAt={createdAt!}
                />
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
