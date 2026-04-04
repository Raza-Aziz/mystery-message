import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Mystery-message Verification Code ",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Email service error" };
    }

    return { success: true, message: "Verification Email sent" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    console.error("Resend error");
    return { success: false, message: "Failed to send verification email" };
  }
}
