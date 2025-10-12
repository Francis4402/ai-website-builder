"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp } from "@/server/users"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerValidation, registerValidationSchema } from "@/app/(auth)/authvalidations/loginVlidation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Loader2 } from "lucide-react"
import GoogleButton from "@/app/(auth)/SocialButtons/GoogleButton"
import Link from "next/link"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(registerValidationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const {formState: {isSubmitting}} = form;

    const onSubmit = async (values: registerValidation) => {
        const {success, message} = await signUp(values.name, values.email, values.password)

        if (success) {
            toast.success(message as string)
            router.push("/dashboard")
        } else {
            toast.error(message as string);
        }
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register Before can you login</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                <Field>
                    <GoogleButton/>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                </FieldSeparator>
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} type="text" placeholder="Enter your name" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password" placeholder="Enter your password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({field}) => (
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password" placeholder="Confirm your password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Field>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="size-4 animate-spin"/> : "Sign Up"}</Button>
                    <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Sign In</Link>
                    </FieldDescription>
                </Field>
                </FieldGroup>
            </form></Form> 
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
