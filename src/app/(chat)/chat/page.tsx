"use client";

import { motion } from "framer-motion";
import { ChatPanel } from "@/components/chat/ChatPanel";

function BlogContent() {
  return (
    <article className="mr-auto max-w-2xl pl-12 pr-6 py-12">
      {/* Nav */}
      <nav className="mb-10 flex items-center justify-between text-sm text-gray-500">
        <span className="font-semibold text-gray-900">The Gaspy Blog</span>
        <span>Product</span>
      </nav>

      {/* Meta */}
      <div className="mb-6 flex items-center gap-3 text-sm text-gray-500">
        <span>June 2, 2026</span>
        <span>·</span>
        <span>8 min read</span>
      </div>

      {/* Title */}
      <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900" style={{ textWrap: "balance" }}>
        The Future of AI-Powered Document Intelligence
      </h1>

      {/* Subtitle */}
      <p className="mb-8 text-lg leading-relaxed text-gray-600">
        How retrieval-augmented generation is reshaping the way teams interact with their knowledge bases — and why context matters more than ever.
      </p>

      {/* Hero image placeholder */}
      <div className="mb-10 aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />

      {/* Body */}
      <div className="space-y-5 text-base leading-relaxed text-gray-700">
        <p>
          In the past decade, we have witnessed an extraordinary shift in how organizations manage and access information. From static file repositories to dynamic knowledge graphs, the evolution has been rapid — but not without friction. Teams still struggle to surface the right document at the right time, and when they do, extracting actionable insight often feels like archaeology.
        </p>

        <p>
          Enter retrieval-augmented generation, or RAG. By combining the contextual depth of large language models with the precision of vector search, RAG systems can answer complex questions grounded in your actual documents — not generic training data. This is not chatbot theater. It is a fundamentally different way of thinking about organizational memory.
        </p>

        <h2 className="pt-4 text-xl font-bold text-gray-900">Why Context Beats Conversation</h2>

        <p>
          Most AI assistants suffer from a critical flaw: they hallucinate. They generate plausible-sounding but factually incorrect answers because they have no tether to reality. RAG solves this by constraining the model&apos;s response to retrieved passages from your own corpus. The result is answers that are not just fluent, but faithful.
        </p>

        <p>
          Consider a legal team reviewing contract precedents. A standard LLM might invent clauses or misattribute jurisdiction. A RAG-powered assistant, by contrast, identifies the exact paragraph in the exact document that supports its conclusion — and cites it. This shift from probabilistic generation to grounded reasoning changes the trust calculus entirely.
        </p>

        <blockquote className="my-6 border-l-2 border-gray-300 py-2 pl-5 text-base italic text-gray-600">
          &ldquo;The best AI assistant is not the one that sounds smartest, but the one that knows when to stay silent and point you to the primary source.&rdquo;
        </blockquote>

        <h2 className="pt-4 text-xl font-bold text-gray-900">Embedding Everything</h2>

        <p>
          At the heart of any RAG system lies the embedding model. Every sentence, table cell, and diagram caption is converted into a high-dimensional vector that captures semantic meaning. When a user asks a question, that query is vectorized too, and the nearest neighbors in the embedding space are retrieved. This geometric approach to meaning is remarkably robust across languages and formats.
        </p>

        <p>
          Modern embedding models — from OpenAI&apos;s text-embedding-3 to Google&apos;s Gemini embeddings — can handle context windows in the thousands of tokens. This means entire pages of dense technical documentation can be represented as a single point in vector space, enabling semantic search at paragraph-level granularity.
        </p>

        {/* Inline image */}
        <div className="my-8 aspect-[21/9] w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200" />

        <h2 className="pt-4 text-xl font-bold text-gray-900">The Interface Layer</h2>

        <p>
          Technology is only as good as the interface that delivers it. A RAG backend sitting behind a clunky form is no better than a locked filing cabinet. The emerging pattern is conversational: a simple chat window that opens anywhere, understands intent, and returns structured answers with inline citations.
        </p>

        <ul className="ml-5 list-disc space-y-2 text-gray-700">
          <li>No training required — the system learns from your existing documents automatically.</li>
          <li>No context-switching — ask questions while reading, writing, or reviewing.</li>
          <li>No hallucination anxiety — every claim is traceable to a source.</li>
        </ul>

        <p className="pt-2">
          This is the philosophy behind Gaspy. Not a chatbot that pretends to know everything, but a lens that lets you see your own documents more clearly. The AI does not replace your judgment; it amplifies it.
        </p>

        <h2 className="pt-4 text-xl font-bold text-gray-900">What Comes Next</h2>

        <p>
          We are moving toward a world where every document, spreadsheet, and transcript is queryable in natural language. The boundary between &ldquo;searching&rdquo; and &ldquo;asking&rdquo; is dissolving. The next frontier is multimodal RAG — systems that can reason across text, images, and structured data simultaneously. A contract scanned as a PDF, its Excel appendix, and the email thread discussing it, all understood as a single coherent object.
        </p>

        <p>
          For teams that live in documents — legal, research, consulting, engineering — this is not a convenience feature. It is a competitive advantage. The ones who can surface insight faster will outpace the ones still ctrl-F&apos;ing through folders.
        </p>

        <p>
          The future of work is not about having more information. It is about asking better questions of the information you already have.
        </p>
      </div>

      {/* Author */}
      <div className="mt-10 flex items-center gap-3 border-t border-gray-100 pt-8">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Gaspy Team</p>
          <p className="text-xs text-gray-500">Building the future of document intelligence.</p>
        </div>
      </div>

      {/* Related */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Related Posts
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-3 aspect-[2/1] w-full rounded-lg bg-gray-200" />
            <p className="text-xs text-gray-400">May 28, 2026</p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              Vector Databases Explained for Engineers
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-3 aspect-[2/1] w-full rounded-lg bg-gray-200" />
            <p className="text-xs text-gray-400">May 15, 2026</p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              Chunking Strategies for Long Documents
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ChatPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-white">
      {/* Real blog content, blurred */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden blur-[2px]">
        <BlogContent />
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/60" />

      {/* Chat Panel */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="w-full max-w-[380px]"
        >
          <div className="max-h-[85vh]">
            <ChatPanel />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
