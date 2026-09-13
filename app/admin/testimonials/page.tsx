import React from "react";
import { getTestimonials } from "@/lib/actions/admin";
import TestimonialsClient from "./TestimonialsClient";

export const metadata = {
  title: "Testimonials | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <TestimonialsClient initialTestimonials={testimonials} />
    </div>
  );
}
