import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import Expense from "@/lib/models/expense.model";
import Income from "@/lib/models/income.model";
import Account from "@/lib/models/account.model";
import Category from "@/lib/models/category.model";
import User from "@/lib/models/user.model";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    await connectToDB();
    
    // Get the user with their accounts and categories
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Fetch expenses
    const expenses = await Expense.find({ account: { $in: user.account } })
      .select("name date amount account category")
      .lean();
    
    // Fetch incomes
    const incomes = await Income.find({ account: { $in: user.account } })
      .select("name date amount account")
      .lean();
    
    // Fetch accounts
    const accounts = await Account.find({ _id: { $in: user.account } })
      .select("name balance color")
      .lean();
    
    // Fetch categories
    const categories = await Category.find({ _id: { $in: user.category } })
      .select("name budget")
      .lean();
    
    // Process data to convert ObjectIds to strings
    const processedData = {
      expenses: expenses.map(expense => ({
        ...expense,
        _id: String(expense._id),
        account: String(expense.account),
        category: String(expense.category),
        date: new Date(expense.date).toISOString()
      })),
      incomes: incomes.map(income => ({
        ...income,
        _id: String(income._id),
        account: String(income.account),
        date: new Date(income.date).toISOString()
      })),
      accounts: accounts.map(account => ({
        ...account,
        _id: String(account._id)
      })),
      categories: categories.map(category => ({
        ...category,
        _id: String(category._id)
      })),
      exportDate: new Date().toISOString()
    };
    
    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error("Error in export API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export data" },
      { status: 500 }
    );
  }
}
