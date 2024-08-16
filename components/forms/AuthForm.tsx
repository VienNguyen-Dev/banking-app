"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import PlaidLink from "../PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      city: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const newUser = await signUp(values);
        if (newUser) setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className="auth-form">
      <header className=" flex flex-col gap-6">
        <Link href={"/"} className="flex gap-2 items-center cursor-pointer">
          <Image src={"/icons/logo.svg"} alt="logo" width={24} height={24} />
          <p className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</p>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-24 lg:text-32 font-bold font-ibm-plex-serif">{user ? "Link access account" : `${type === "sign-in" ? "Sign In" : "Sign Up"}`}</h1>
          <p>{type === "sign-in" ? "Wellcome back! Please enter your details." : "Enter your details to create new account."}</p>
        </div>
      </header>
      {/* Authentication */}
      {user ? (
        <div className="">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {type === "sign-in" && (
              <>
                <CustomInput control={form.control} name="email" placeholder="Enter your Email" label="Email" />
                <CustomInput control={form.control} name="password" placeholder="Enter your Password" label="Password" />
              </>
            )}
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput control={form.control} name="firstName" placeholder="Ex: Nguyen" label="First Name" />
                  <CustomInput control={form.control} name="lastName" placeholder="Ex:Vien" label="Last Name" />
                </div>
                <CustomInput control={form.control} name="address1" placeholder="Enter your specific address" label="Address" />
                <CustomInput control={form.control} name="city" placeholder="Ex:Some City" label="City" />
                <div className="flex gap-4">
                  <CustomInput control={form.control} name="state" placeholder="Ex:NY,CA" label="State" />
                  <CustomInput control={form.control} name="postalCode" placeholder="Ex:11101" label="Postal Code" />
                </div>
                <div className="flex gap-4">
                  <CustomInput control={form.control} name="dateOfBirth" placeholder="YYYY-MM-DD" label="Date of Birth" />
                  <CustomInput control={form.control} name="ssn" placeholder="Ex:1234" label="SSN" />
                </div>
                <CustomInput control={form.control} name="email" placeholder="Enter your Email" label="Email" />
                <CustomInput control={form.control} name="password" placeholder="Enter your Password" label="Password" />
              </>
            )}

            <Button disabled={isLoading} type="submit" className="form-btn w-full">
              {isLoading ? (
                <>
                  <Loader2 size={20} className=" animate-spin ml-2" />
                  Loading...
                </>
              ) : (
                <span>{type === "sign-in" ? "Sign In" : "Sign Up"}</span>
              )}
            </Button>
          </form>
        </Form>
      )}
      <footer className="flex justify-center items-center gap-2">
        <>
          <p>{type === "sign-in" ? "Don't have an account?" : "Already have an account?"}</p>
          <Link href={type === "sign-in" ? "sign-up" : "sign-in"} className="form-link">
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </>
      </footer>
    </section>
  );
};

export default AuthForm;
