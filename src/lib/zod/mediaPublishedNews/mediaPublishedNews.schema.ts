import { z } from "zod";

export const mediaPublishedNews = z.object({
  title: z.string({ required_error: "Title is required!" }),
  url: z.string({ required_error: "Url is required!" }),
  origin: z.string({ required_error: "Origin is required!" }),
});
