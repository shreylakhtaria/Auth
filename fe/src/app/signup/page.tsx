"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SIGNUP_MUTATION } from "@/graphql/mutations";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
        onCompleted: (data) => {
            localStorage.setItem("token", data.signup.token);
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
            setError(getErrorMessage(err));
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        signup({ variables: { signupInput: { email, password } } });
    };

    return (
        <div className="min-h-screen auth-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md auth-card rounded-2xl p-8 relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-1 text-white">
                    Create Account
                </h1>
                <p className="text-center text-sm text-slate-400 mb-6">
                    Get started with your free account
                </p>

                {error && (
                    <div className="mb-4 p-3 alert-error rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg auth-input text-sm"
                            placeholder="Min 8 chars, uppercase, number, special"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 auth-btn rounded-lg text-sm cursor-pointer mt-2"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
