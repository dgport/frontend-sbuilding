import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function isAuthServer() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return {
        authenticated: false,
        user: null,
      };
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "aisisecret"
    );

    try {
      const { payload } = await jwtVerify(token, secret);

      return {
        authenticated: true,
        user: {
          id: payload.userId as string,
          email: payload.email as string,
        },
      };
    } catch (verifyError) {
      console.error(verifyError)
      return {
        authenticated: false,
        user: null,
      };
    }
  } catch (error) {
    console.error("❌ Unexpected error in isAuthServer:", error);
    return {
      authenticated: false,
      user: null,
    };
  }
}