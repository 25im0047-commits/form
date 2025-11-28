"use client";
import React from "react"
import { useForm } from "react-hook-form"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import POST from "../api/send-email/route";


const SubmitForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  // asyncの呼び方あってる？
  const onSubmit = async(data : any) => {
    console.log(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    await POST(formData) 
  }

  return (
    <>
      <Card className="mx-4 my-4 w-full max-w-sm">
        <div className="form-container flex flex-col ">
          <h1>login Form</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            <label htmlFor="名前">名前</label>
            <input id ="name" type="text" {...register("name", { required: "⚠️名前は必須です" }, )} />
            <p>{errors.name?.message as React.ReactNode}</p>

            <label htmlFor="メールアドレス">メールアドレス</label>
            <input id ="email" type="email" {...register("email", {required: "⚠️Emailは必須です"})}/>
            <p>{errors.email?.message as React.ReactNode}</p>

            <label htmlFor="パスワード">パスワード</label>
            <input id ="password" type="password" {...register("password", { required: "⚠️パスワードは必須です" })}/>
            <p>{errors.password?.message as React.ReactNode}</p>

            <button  type="submit" className="w-full hover:bg-blue-200" >送信</button>

          </form>
        </div>
      </Card>
    </>
  )
}

export default SubmitForm

