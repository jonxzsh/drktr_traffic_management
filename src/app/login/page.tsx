"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoginPage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.ok) {
      router.push("/dashboard/publishers");
    } else {
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Form {...form}>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <div className="text-xl font-semibold">Login</div>
            <div className="text-sm">
              Please enter your details below to authenticate
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type={"password"} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type={"submit"}>Login</Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
