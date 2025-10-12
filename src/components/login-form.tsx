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
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { loginValidation, loginValidationSchema } from "@/app/(auth)/authvalidations/loginVlidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { signIn } from "@/server/users"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleButton from "@/app/(auth)/SocialButtons/GoogleButton"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const {formState: {isSubmitting}} = form;

  const onSubmit = async (values: loginValidation) => {
    const {success, message} = await signIn(values.email, values.password)

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
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <GoogleButton />
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <FormField control={form.control} name="email" render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="m@example.com" />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="m@example.com" />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )} />
                <Field>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="size-4 animate-spin"/> : "Login"}</Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
