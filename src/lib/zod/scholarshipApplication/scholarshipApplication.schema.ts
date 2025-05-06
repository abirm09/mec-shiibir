import { z } from "zod";

export const ScholarshipApplication = z.object({
  name: z.string({ required_error: "Name is required!" }),
  applicationSubject: z.string({
    required_error: "Application subject is required!",
  }),
  session: z.string({ required_error: "Session is required!" }),
  registrationNumber: z.string({
    required_error: "Registration number is required!",
  }),
  mobileNumber: z.string({ required_error: "Mobile number is required!" }),
  reference1: z.string().nullable().optional(),
  reference2: z.string().nullable().optional(),
  problemDetails: z.string({ required_error: "Problem details is required!" }),
  departmentId: z
    .number({ required_error: "Department id is required!" })
    .int(),
  hallId: z.number({ required_error: "Hall Id is required!" }).int(),
});
