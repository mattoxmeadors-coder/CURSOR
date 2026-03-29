import { NextResponse } from "next/server";

import { defaultCopilotInput } from "@/lib/defaults";
import { generateCopilotResponse } from "@/lib/engine";
import type { CopilotInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CopilotInput>;
    const input: CopilotInput = {
      ...defaultCopilotInput,
      ...payload,
      attendees: payload.attendees ?? defaultCopilotInput.attendees,
      primaryStressors:
        payload.primaryStressors ?? defaultCopilotInput.primaryStressors,
      notes: payload.notes ?? defaultCopilotInput.notes,
    };

    return NextResponse.json(generateCopilotResponse(input));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
