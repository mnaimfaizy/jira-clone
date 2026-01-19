import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      const session = await account.createEmailPasswordSession(email, password);

      // Check if email is verified
      // Note: Appwrite allows login even if email is not verified by default
      // We'll handle this on the client side by checking user.emailVerification

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials";
      return c.json({ error: errorMessage }, 401);
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      // Create the user account
      console.log("Creating user account for:", email);
      const user = await account.create(ID.unique(), email, password, name);
      console.log("User created successfully:", user.$id);

      // Create a session for the user
      console.log("Creating session...");
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Session created:", session.$id);

      // Optionally send verification email (if SMTP is configured)
      // This will not block registration if SMTP is not set up
      let emailSent = false;
      try {
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`;
        console.log(
          "Attempting to send verification email to:",
          email,
          "with URL:",
          verificationUrl,
        );
        await account.createVerification(verificationUrl);
        console.log("Verification email sent successfully");
        emailSent = true;
      } catch (emailError) {
        console.warn(
          "Failed to send verification email (SMTP may not be configured):",
          emailError,
        );
        // Continue with registration - email verification is optional
      }

      // Set session cookie to log user in
      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      console.log("Registration completed successfully");

      return c.json({
        success: true,
        message: emailSent
          ? "Registration successful! Please check your email to verify your account."
          : "Registration successful! You can now use the application.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      return c.json({ error: errorMessage }, 400);
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  })
  .post(
    "/forgot-password",
    zValidator("json", forgotPasswordSchema),
    async (c) => {
      const { email } = c.req.valid("json");

      const { account } = await createAdminClient();

      // Appwrite will send a password recovery email with a link
      // The link should point to your reset password page
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;

      await account.createRecovery(email, redirectUrl);

      return c.json({ success: true, message: "Password reset email sent" });
    },
  )
  .put(
    "/reset-password",
    zValidator("json", resetPasswordSchema),
    async (c) => {
      const { userId, secret, password } = c.req.valid("json");

      const { account } = await createAdminClient();

      // Complete the password recovery process
      await account.updateRecovery(userId, secret, password);

      return c.json({ success: true, message: "Password reset successful" });
    },
  )
  .put("/verify-email", zValidator("json", verifyEmailSchema), async (c) => {
    const { userId, secret } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      // Complete the email verification
      await account.updateVerification(userId, secret);

      return c.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      return c.json({ error: errorMessage }, 400);
    }
  })
  .post("/resend-verification", sessionMiddleware, async (c) => {
    const account = c.get("account");

    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`;
      await account.createVerification(verificationUrl);

      return c.json({ success: true, message: "Verification email sent" });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification email";
      return c.json({ error: errorMessage }, 400);
    }
  });

export default app;
