"use client"

import { login } from "@/actions/login"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { LoginSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormError } from "../form-error"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { CardWrapper } from "./card-wrapper"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError(undefined)

    startTransition(() => {
      login(data).then((res) => {
        if (res && res.error) {
          setError(res.error)
        }
      })
    })
  }

  return (
    <CardWrapper headerLabel="Welcome back" backButtonLabel="Don't have an account?" backButtonHref="/auth/register" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john.doe@example.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="********" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={error} />}
          <Button type="submit" className="w-full" disabled={isPending}>Login</Button>
        </form>
      </Form>
    </CardWrapper>
  )
} 