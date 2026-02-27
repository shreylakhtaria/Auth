"use client";

import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { ME_QUERY } from "@/graphql/queries";

export default function DashboardPage() {
    const router = useRouter();

    const { data, loading, error } = useQuery(ME_QUERY, {
        fetchPolicy: "network-only",
    });

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen auth-bg flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-400">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen auth-bg flex items-center justify-center px-4">
                <div className="w-full max-w-md auth-card rounded-2xl p-8 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <p className="text-red-400 mb-4 text-sm">
                        {error.message || "Not authenticated"}
                    </p>
                    <button
                        onClick={() => router.push("/login")}
                        className="auth-btn px-6 py-2 rounded-lg text-sm cursor-pointer"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const user = data?.me;

    return (
        <div className="min-h-screen auth-bg px-4 py-8">
            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                {/* User Info Card */}
                <div className="dash-card rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-semibold text-sm">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{user?.email}</p>
                            <p className="text-slate-500 text-xs">Account Details</p>
                        </div>
                    </div>

                    <div className="space-y-0">
                        <div className="dash-row flex justify-between items-center py-3.5">
                            <span className="text-sm text-slate-400">Email</span>
                            <span className="text-sm font-medium text-slate-200">
                                {user?.email}
                            </span>
                        </div>

                        <div className="dash-row flex justify-between items-center py-3.5">
                            <span className="text-sm text-slate-400">Role</span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {user?.role}
                            </span>
                        </div>

                        <div className="dash-row flex justify-between items-center py-3.5">
                            <span className="text-sm text-slate-400">Verified</span>
                            <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${user?.isVerified
                                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                    }`}
                            >
                                {user?.isVerified ? "Verified" : "Not Verified"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-3.5">
                            <span className="text-sm text-slate-400">Created</span>
                            <span className="text-sm font-medium text-slate-200">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                    : "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
