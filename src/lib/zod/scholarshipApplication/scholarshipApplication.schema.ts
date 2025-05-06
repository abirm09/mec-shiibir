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

export const ScholarshipApplicationUpdateSchema = z.object({
  name: z.string().optional(),
  applicationSubject: z.string().optional(),
  session: z.string().optional(),
  registrationNumber: z.string().optional(),
  // status: z.string(z.enum(["pending", "approved", "rejected"])).optional(),
  mobileNumber: z.string().optional(),
  reference1: z.string().nullable().optional(),
  reference2: z.string().nullable().optional(),
  problemDetails: z.string().optional(),
  departmentId: z.number().int().optional(),
  hallId: z.number().int().optional(),
});
