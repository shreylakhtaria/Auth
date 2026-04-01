"use client";

import { useState, Suspense } from "react";
import { useMutation } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { VERIFY_OTP_MUTATION, RESEND_OTP_MUTATION } from "@/graphql/mutations";
import { getErrorMessage } from "@/lib/getErrorMessage";

function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromParams);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [verifyOtp, { loading: verifying }] = useMutation(
        VERIFY_OTP_MUTATION,
        {
            onCompleted: (data) => {
                if (data.verifyOtp.success) {
                    setSuccess(data.verifyOtp.message || "Account verified!");
                    setTimeout(() => router.push("/login"), 1500);
                } else {
                    setError(data.verifyOtp.message || "Verification failed");
                }
            },
            onError: (err) => setError(getErrorMessage(err)),
        }
    );

    const [resendOtp, { loading: resending }] = useMutation(
        RESEND_OTP_MUTATION,
        {
            onCompleted: () => {
                setSuccess("OTP resent! Check your email.");
                setTimeout(() => setSuccess(""), 3000);
            },
            onError: (err) => setError(getErrorMessage(err)),
        }
    );

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        verifyOtp({ variables: { verifyOtpInput: { email, otp } } });
    };

    const handleResend = () => {
        setError("");
        setSuccess("");
        resendOtp({ variables: { resendOtpInput: { email } } });
    };

    return (
        <div className="min-h-screen auth-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md auth-card rounded-2xl p-8 relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-1 text-white">
                    Verify Your Account
                </h1>
                <p className="text-center text-sm text-slate-400 mb-6">
                    Enter the OTP sent to your email
                </p>

                {error && (
                    <div className="mb-4 p-3 alert-error rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 alert-success rounded-lg text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg auth-input text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-1.5">
                            OTP Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg auth-input text-sm tracking-[0.3em] text-center text-lg"
                            placeholder="000000"
                            maxLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={verifying}
                        className="w-full py-2.5 auth-btn rounded-lg text-sm cursor-pointer mt-2"
                    >
                        {verifying ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-50 cursor-pointer transition-colors"
                    >
                        {resending ? "Resending..." : "Resend OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen auth-bg flex items-center justify-center">
                    <p className="text-slate-400">Loading...</p>
                </div>
            }
        >
            <VerifyOtpForm />
        </Suspense>
    );
}
