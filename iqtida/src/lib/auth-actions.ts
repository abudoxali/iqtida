"use server";

import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { signIn, signOut } from "./auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "البريد الإلكتروني وكلمة المرور مطلوبان" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "البريد الإلكتروني مستخدم بالفعل" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return { success: true };
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    return { error: "بيانات الدخول غير صحيحة" };
  }
}

export async function logoutAction() {
  await signOut();
}
