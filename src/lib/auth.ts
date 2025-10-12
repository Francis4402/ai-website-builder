import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";

export const auth = betterAuth({
    emailAndPassword: { 
        enabled: true,
        sendResetPassword: async ({user, token}) => {
            
        },
        resetPasswordTokenExpiresIn: 3600,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
            },
            credites: {
                type: "number",
                input: false,
            }
        }
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    plugins: [nextCookies()]
});