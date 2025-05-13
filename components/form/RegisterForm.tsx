"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import Link from "next/link";
import { BASE_API_URL } from "../..";
import { motion } from "framer-motion";
import { DollarSign, Mail, Lock, User, ArrowRight, Check } from "lucide-react";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/dashboard");
      router.refresh();
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "You must agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${BASE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const msg = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "destructive",
        });
      } else {
        setSubmitting(false);
        toast({
          description: msg.message,
          variant: "success",
        });
        router.push("/");
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
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-900 to-black p-8 md:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <DollarSign className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold">FTRAKT</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Start Your Financial Journey Today</h1>
            <p className="text-gray-300 mb-8">
              Join thousands of users who are taking control of their finances with FTRAKT.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6 max-w-md"
          >
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 p-1 rounded-full mt-0.5">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium">Track Your Spending</h3>
                <p className="text-sm text-gray-400">Automatically categorize and monitor your expenses</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 p-1 rounded-full mt-0.5">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium">Create Smart Budgets</h3>
                <p className="text-sm text-gray-400">Set realistic budgets based on your spending habits</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-emerald-500/20 p-1 rounded-full mt-0.5">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium">Get Financial Insights</h3>
                <p className="text-sm text-gray-400">Receive personalized recommendations to improve your finances</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-gray-400">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-950 border-gray-800"
                />
              </div>
            </div>

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
                  className="pl-10 bg-gray-950 border-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  className="pl-10 bg-gray-950 border-gray-800"
                />
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeTerms} 
                onCheckedChange={handleCheckboxChange} 
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="#" className="text-emerald-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-emerald-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create account"}
              {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

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
              className="w-full bg-black border border-gray-800 hover:bg-gray-900 text-white"
              onClick={() => router.push("/landing")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Landing Page
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterForm;
