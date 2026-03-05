import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Show } from "@clerk/nextjs";
import BookCard from "@/components/BookCard";
import { sampleBooks } from "@/lib/constants";

const steps = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: 2,
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: 3,
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

const Page = () => {
  return (
    <main className="wrapper container">
      <div className="wrapper">
        <section className="library-hero-card wrapper pt-28 mb-10 md:mb-16">
          <div className="library-hero-content">
            {/* Left - Text and CTA */}
            <div className="library-hero-text">
              <h1 className="library-hero-title">Your Library</h1>
              <p className="library-hero-description">
                Convert your books into interactive AI conversations.
                Listen, learn, and discuss your favorite reads.
              </p>

              <Show when="signed-in">
                <Link href="/books/new" className="library-cta-primary">
                  <Plus className="size-5" />
                  Add new book
                </Link>
              </Show>

              <Show when="signed-out">
                <Link href="/sign-in" className="library-cta-primary">
                  <Plus className="size-5" />
                  Add new book
                </Link>
              </Show>
            </div>

            {/* Center - Illustration */}
            <div className="library-hero-illustration-desktop">
              <Image
                src="/assets/hero-illustration.png"
                alt="Library Illustration"
                width={400}
                height={300}
                className="object-contain"
                priority
              />
            </div>

            {/* Right - Steps Card */}
            <div className="library-steps-card min-w-[240px] space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="library-step-item">
                  <div className="library-step-number">{step.number}</div>
                  <div>
                    <h3 className="library-step-title">{step.title}</h3>
                    <p className="library-step-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <div className="library-books-grid">
        {sampleBooks.map((book) => (
          <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  );
}

export default Page;