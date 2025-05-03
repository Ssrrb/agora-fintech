// components/kyc/KYCForm.tsx

'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from 'react'; // Import React

// Import shadcn/ui components (adjust paths as needed)
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- 1. Define the Zod Schema ---
// Define the structure and validation rules for your form data.
const kycFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }).max(100, {
    message: "Full name must not exceed 100 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  country: z.string({ // Making country required
    required_error: "Please select a country.",
  }).min(1, { message: "Please select a country." }), // Ensure a value is selected
  taxId: z.string().min(5, { // Basic validation for Tax ID - enhance as needed
    message: "Tax ID must be at least 5 characters.",
  }).max(50, {
     message: "Tax ID seems too long."
  }),
  // Add more fields and validation rules as necessary
  // Example: Date of Birth
  // dob: z.date({ required_error: "Please enter your date of birth." }),
});

// --- Define Type Alias for Form Values ---
type KycFormValues = z.infer<typeof kycFormSchema>;

// --- Mock Country Data (Replace with your actual data source) ---
const countries = [
  { value: "py", label: "Paraguay" },
  { value: "bol", label: "Bolivia" },
  { value: "br", label: "Brasil" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  // Add more countries as needed
];

// --- The KYC Form Component ---
export default function KYCForm() {
  // --- 2. Define the Form using useForm ---
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      country: "", // Important: Initialize select with an empty string or a valid default value
      taxId: "",
      // dob: undefined, // Default for date if using
    },
    mode: "onChange", // Optional: Validate on change for immediate feedback
  });

  // Get the current country value to potentially adjust Tax ID label/validation later
  const selectedCountry = form.watch("country");

  // --- 3. Define the Submit Handler ---
  function onSubmit(values: KycFormValues) {
    // ✅ This data is validated and type-safe!
    console.log("KYC Form Submitted:", values);

    // TODO: Implement your actual KYC submission logic here
    // (e.g., send data to your backend API)
    alert(`Form submitted successfully!\nData: ${JSON.stringify(values, null, 2)}`);
    // Optionally reset the form after successful submission
    // form.reset();
  }

  // --- 4. Build the Form using <Form /> Components ---
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-md shadow-sm max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">KYC Verification</h2>

        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter your full legal name.
              </FormDescription>
              <FormMessage /> {/* Displays validation errors */}
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll use this email for communication.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Field */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country of Residence</FormLabel>
              {/* Use shadcn/ui Select component */}
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    {/* Show placeholder if no value selected */}
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Populate with your country list */}
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                  {/* Add a disabled "placeholder" option if needed, although SelectValue handles it */}
                  {/* <SelectItem value="" disabled>Select your country</SelectItem> */}
                </SelectContent>
              </Select>
              <FormDescription>
                Your primary country of tax residence.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tax ID Field */}
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              {/* Dynamically change label based on country if needed */}
              <FormLabel>
                Tax Identification Number
                {selectedCountry === 'us' && ' (SSN/ITIN)'}
                {selectedCountry === 'ca' && ' (SIN)'}
                {/* Add more country-specific labels */}
              </FormLabel>
              <FormControl>
                <Input placeholder={`Enter your Tax ID${selectedCountry ? ` for ${countries.find(c=>c.value === selectedCountry)?.label ?? ''}` : ''}`} {...field} />
              </FormControl>
              <FormDescription>
                Enter your government-issued tax identifier.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit KYC Information'}
        </Button>
      </form>
    </Form>
  );
}