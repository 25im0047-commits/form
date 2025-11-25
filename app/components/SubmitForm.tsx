"use client";
import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { isReactCompilerRequired } from "next/dist/build/swc/generated-native";


const SubmitForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data : any) => {
    console.log(data);
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

