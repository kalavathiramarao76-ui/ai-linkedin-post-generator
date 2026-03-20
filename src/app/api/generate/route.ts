import { NextRequest } from "next/server";
import { API_CONFIG } from "@/lib/constants";
import { getGeneratePrompt, getHookPrompt, getHashtagPrompt, getTonePrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { topic, style, type, content, tone } = body;

    if (!topic && !content) {
      return new Response(
        JSON.stringify({ error: "Topic or content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let systemPrompt: string;
    let userMessage: string;

    switch (type) {
      case "hooks":
        systemPrompt = getHookPrompt();
        userMessage = `Generate 10 attention-grabbing LinkedIn opening hooks about: ${topic}`;
        break;
      case "hashtags":
        systemPrompt = getHashtagPrompt();
        userMessage = `Suggest hashtags for this LinkedIn post:\n\n${content || topic}`;
        break;
      case "tone":
        systemPrompt = getTonePrompt(tone || "professional");
        userMessage = `Rewrite this LinkedIn post in a ${tone || "professional"} tone:\n\n${content}`;
        break;
      default:
        systemPrompt = getGeneratePrompt(style || "thought-leadership");
        userMessage = `Write a LinkedIn post about: ${topic}`;
        break;
    }

    const response = await fetch(API_CONFIG.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
