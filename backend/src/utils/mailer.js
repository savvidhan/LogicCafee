import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD,
  },
});

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPEmail = async ({ to, otp, name }) => {
  const displayName = name || "there";
  const year = new Date().getFullYear();

  // Build HTML without nested template literals to avoid interpolation conflicts
  const html = [
    '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;max-width:520px;margin:0 auto;background:#09090b;color:#f4f4f5;border-radius:12px;overflow:hidden;">',
    '<div style="background:#18181b;padding:32px 40px 24px;border-bottom:1px solid #27272a;">',
    '<p style="margin:0;font-size:20px;font-weight:600;color:#f4f4f5;">Logic<span style="color:#6366f1;">Cafe</span></p>',
    '</div>',
    '<div style="padding:40px;">',
    '<p style="margin:0 0 8px;font-size:15px;color:#a1a1aa;">Hey ' + displayName + ',</p>',
    '<p style="margin:0 0 32px;font-size:15px;color:#a1a1aa;line-height:1.6;">Use this code to verify your email and create your account.</p>',
    '<div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:28px;text-align:center;margin-bottom:32px;">',
    '<p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#71717a;">Your verification code</p>',
    '<p style="margin:0;font-size:40px;font-weight:700;letter-spacing:12px;color:#6366f1;font-family:monospace;">' + otp + '</p>',
    '</div>',
    '<p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;">This code expires in <strong style="color:#71717a;">10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>',
    '</div>',
    '<div style="padding:20px 40px;border-top:1px solid #27272a;background:#18181b;">',
    '<p style="margin:0;font-size:12px;color:#52525b;">&copy; ' + year + ' LogicCafe &middot; Master DSA by Patterns</p>',
    '</div>',
    '</div>',
  ].join("");

  await transporter.sendMail({
    from: '"LogicCafe" <' + env.GMAIL_USER + '>',
    to,
    subject: otp + " is your LogicCafe verification code",
    html,
  });
};
