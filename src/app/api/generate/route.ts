import { NextRequest } from "next/server";
import { API_CONFIG } from "@/lib/constants";
import { getGeneratePrompt, getHookPrompt, getHashtagPrompt, getTonePrompt } from "@/lib/prompts";
import { checkAndIncrementUsage, isAuthenticated } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    const authed = await isAuthenticated(ip);

    if (!authed) {
      const { allowed, count, remaining } = await checkAndIncrementUsage(ip);
      if (!allowed) {
        return new Response(
          JSON.stringify({
            error: "FREE_LIMIT_REACHED",
            message: `Free trial complete. You've used ${count} of 3 free generations. Sign in with Google to continue.`,
            count,
            remaining: 0,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const body = await request.json();
    const { topic, style, type, content, tone, language } = body;

    if (!topic && !content) {
      return new Response(
        JSON.stringify({ error: "Topic or content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build language instruction
    const langInstruction = language && language !== "en"
      ? `\n\nIMPORTANT: Write this LinkedIn post entirely in ${getLanguageName(language)}. The entire output must be in ${getLanguageName(language)}.`
      : "";

    let systemPrompt: string;
    let userMessage: string;

    switch (type) {
      case "hooks":
        systemPrompt = getHookPrompt() + langInstruction;
        userMessage = `Generate 10 attention-grabbing LinkedIn opening hooks about: ${topic}`;
        break;
      case "hashtags":
        systemPrompt = getHashtagPrompt() + langInstruction;
        userMessage = `Suggest hashtags for this LinkedIn post:\n\n${content || topic}`;
        break;
      case "tone":
        systemPrompt = getTonePrompt(tone || "professional") + langInstruction;
        userMessage = `Rewrite this LinkedIn post in a ${tone || "professional"} tone:\n\n${content}`;
        break;
      default:
        systemPrompt = getGeneratePrompt(style || "thought-leadership") + langInstruction;
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

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    hi: "Hindi",
    ja: "Japanese",
    zh: "Chinese",
    ar: "Arabic",
    ko: "Korean",
  };
  return names[code] || "English";
}
