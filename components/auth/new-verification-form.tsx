"use client"

import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"
import { PulseLoader } from "react-spinners"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormError } from "../form-error"
import { FormSuccess } from "../form-success"

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)
  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("No token provided")
      return
    }

    newVerification(token)
      .then((result) => {
        setError(result.error)
        setSuccess(result.success)
      }).catch(() => {
        setError("Something went wrong")
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <CardWrapper headerLabel="Confirming your email" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="flex items-center justify-center w-full">
        {
          !error && !success && <PulseLoader color="#bae6fd" />
        }
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  )
}