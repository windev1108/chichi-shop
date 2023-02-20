import Layout from '@/components/Layout'
import { GetServerSidePropsContext, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React , { useState } from 'react'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from 'next-auth';
import { Session } from '@/utils/types'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({req,res} : GetServerSidePropsContext) => {
  const session : Session | null = await getServerSession(req, res, authOptions)
  if (session?.user?.email!) {
    return {
        redirect: {
            destination: '/',
            permanent: true,
        },
        props: {},
    };
}

return {
    props: {
        session,
        origin: `${
            req.headers.host?.includes('localhost') ? 'http' : 'https'
        }://${req.headers.host}`,
    },
};
}


const SignIn: NextPage<{
  session: Session
}>= ({ session }) => {
  const router = useRouter()
    const [ form , setForm ] = useState<{
        email: string
        password: string
    }>({
        email: '',
        password: ''
    })
    const { email , password } = form

    const onSubmitForm = async (e: React.FormEvent) => {
      e.preventDefault()
          try {
           if(!email){
            toast.error("Vui lòng nhập email")
           }else if(!password){
            toast.error("Vui lòng nhập password")
           }
            else{
            const { ok , error } : any= await signIn("credentials", {
              redirect: false,
              email,
              password
            })
             if(!ok){
               toast.error(error)
             }else{
               toast.success("Đăng nhập thành công")
               router.replace("/")
             }
           }
          } catch (error: any) {
             toast.error(error.message)
          }
    }

  return (
    <Layout>
       <div className="bg-gray-100 min-h-screen flex items-center justify-center">
       <div className="max-w-md w-full mx-auto">
        <h1 className="text-center font-bold text-2xl">
            Đăng nhập
        </h1>
        <div className="bg-white rounded-lg overflow-hidden shadow-md p-8 mt-6">
          <form onSubmit={onSubmitForm}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={email}
                onChange={({target}) => setForm({...form, email: target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={({target}) => setForm({...form,password: target.value})}
              />
            </div>
            <div className="flex justify-between w-full my-3">
               <div className="flex items-center">
                <input id="remember" type="checkbox" />
                <label className="inline-block mx-2 " htmlFor="remember">
                Ghi nhớ tôi?
              </label>
               </div>
                <Link href="/forgot">
                    <span className="text-blue-500 hover:underline">Quên mật khẩu?</span>
                </Link>
            </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Đăng nhập
              </button>
          </form>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default SignIn


