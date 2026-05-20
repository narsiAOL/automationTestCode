import { z } from "zod";

export const personFormSchema = z.object({
  type: z.string().min(1, "Relationship type is required"),
  gender: z.string().min(1, "Gender is required"),
  surname: z.string().min(1, "Surname is required"),
  firstname: z.string().min(1, "First name is required"),
  //   dob: z.string().min(1, "Date of birth is required"),
  // Add more fields and rules as needed
});

export type PersonFormSchema = z.infer<typeof personFormSchema>;
