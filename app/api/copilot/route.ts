import { NextResponse } from "next/server";

import { defaultInput } from "@/lib/defaults";
import { buildBattlePlan, buildSocialContentPack, evaluatePreparation } from "@/lib/engine";
import type { CopilotInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CopilotInput>;
    const input: CopilotInput = {
      ...defaultInput,
      ...payload,
      attendees: payload.attendees ?? defaultInput.attendees,
      painPoints: payload.painPoints ?? defaultInput.painPoints,
      customContext: payload.customContext ?? defaultInput.customContext,
    };

    const evaluation = evaluatePreparation(input);
    const battlePlan = buildBattlePlan(input, evaluation);
    const contentPack = buildSocialContentPack(input, evaluation, battlePlan);

    return NextResponse.json({
      input,
      evaluation,
      battlePlan,
      contentPack,
    });
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
