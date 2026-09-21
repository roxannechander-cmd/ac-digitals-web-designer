import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const quoteSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(40),
  country: z.string().trim().min(2).max(100),
  businessType: z.string().trim().min(2).max(80),
  hasWebsite: z.boolean(),
  currentWebsiteUrl: z.union([z.string().trim().url().max(500), z.literal("")]),
  projectNeeds: z.array(z.string().trim().min(2).max(80)).min(1).max(9),
  pageCount: z.string().trim().min(1).max(30),
  estimatedBudget: z.string().trim().min(1).max(60),
  projectDetails: z.string().trim().min(20).max(3000),
  mainGoal: z.string().trim().min(2).max(100),
  consent: z.literal(true),
});

export type QuoteInput = z.input<typeof quoteSchema>;

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((input: QuoteInput) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL']!;
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("quote_enquiries").insert({
      full_name: data.fullName,
      business_name: data.businessName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      business_type: data.businessType,
      has_website: data.hasWebsite,
      current_website_url: data.currentWebsiteUrl || null,
      project_needs: data.projectNeeds,
      page_count: data.pageCount,
      estimated_budget: data.estimatedBudget,
      project_details: data.projectDetails,
      main_goal: data.mainGoal,
      consent: data.consent,
    });

    if (error) throw new Error("Your enquiry could not be sent. Please try again or contact us directly.");
    return { success: true };
  });