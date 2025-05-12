// page.tsx (the page that renders your LoginForm)
"use client";

// import LoginForm from "../components/LoginForm"; // adjust path as needed

// export default function LoginPage() {
//   return (
//     <div className="w-screen h-screen p-0 m-0 overflow-x-hidden">
//       <LoginForm />
//     </div>
//   );
// }

// LoginForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { motion } from "framer-motion";
import { DollarSign, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "../ui/use-toast";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "testaccount@gmail.com",
    password: "test123456",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await signIn("credentials", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
        rememberMe,
      });

      if (res?.status !== 200) {
        toast({
          description: "Invalid Account",
          variant: "destructive",
        });
        setSubmitting(false);
      } else {
        router.refresh();
        router.replace("/dashboard");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  return (
    <div className="min-h-screen w-screen m-0 p-0 bg-black text-white flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-900 to-black p-8 md:p-12 flex flex-col justify-between">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-12">
            <DollarSign className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold">Money Manager</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-1/2"
          >
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6">Welcome back to Money Manager</h1>
            <p className="text-gray-300 mb-8 text-lg">
              Sign in to continue your journey to financial freedom. Track your expenses, manage your budget, and
              achieve your financial goals.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 w-full"
        >
          <p className="italic text-gray-300 mb-4">
            "Money Manager has transformed how I handle my finances. The insights are invaluable!"
          </p>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200 font-bold">
              AK
            </div>
            <div className="ml-3">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-400">Product Designer</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-950 border-gray-800 w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-emerald-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-950 border-gray-800 w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={handleCheckboxChange} />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 py-6"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            
            {error && (
              <div className="flex w-full justify-center">
                <p className="mt-4 w-fit rounded-md bg-destructive/90 px-3 py-1.5 font-semibold text-destructive-foreground shadow-lg">
                  {error}
                </p>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              className="w-full bg-black border border-gray-800 hover:bg-gray-900 text-white py-6"
              onClick={() => signIn("google")}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-emerald-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;