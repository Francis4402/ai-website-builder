import z from "zod";


export const loginValidationSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const registerValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type loginValidation = z.infer<typeof loginValidationSchema>;
export type registerValidation = z.infer<typeof registerValidationSchema>;