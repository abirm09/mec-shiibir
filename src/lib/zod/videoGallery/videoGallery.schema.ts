import { z } from "zod";

export const videoGallery = z.object({
  title: z.string({ required_error: "Title is required!" }),
  ytVideoLink: z.string({ required_error: "YouTube Video link is required!" }),
  ytVideoId: z.string({ required_error: "YouTube Video id is required!" }),
});
