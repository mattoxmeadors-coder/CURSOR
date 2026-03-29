"use client";

import { useMemo, useState } from "react";

import {
  familyStyles,
  parentBackgrounds,
  relationStages,
  yesNoAnswers,
} from "@/lib/content";
import { defaultCopilotInput } from "@/lib/defaults";
import type { CopilotInput, CopilotResponse } from "@/lib/types";

type Mode = CopilotInput["mode"];

const modeDescriptions: Record<Mode, string> = {
  prepare: "我快见家长了，帮我准备到位。",
  align: "我和 TA 先统一口径，防止现场掉链子。",
  battlePlan: "基于这次场景，直接给我当天可执行作战方案。",
};

const stressorOptions = [
  "怕冷场",
  "怕被问收入/房车",
  "怕婚期话题",
  "怕不会聊天",
  "怕礼数拿捏不准",
  "怕和 TA 配合不好",
  "怕饭桌场景失手",
  "怕长辈太强势",
];

const riskTone: Record<"high" | "medium" | "low", string> = {
  high: "高压",
  medium: "中压",
  low: "低压",
};

function toggleItem<T extends string>(items: T[], value: T) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

export function CopilotForm() {
  const [input, setInput] = useState<CopilotInput>(defaultCopilotInput);
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentModeLabel = useMemo(
    () => modeDescriptions[input.mode],
    [input.mode],
  );

  async function submit() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("生成失败，请稍后重试。");
      }

      const payload = (await response.json()) as CopilotResponse;
      setResult(payload);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "请求异常，请稍后再试。";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="copilot-shell">
      <section className="panel hero-panel">
        <div className="eyebrow">AI Family Visit Copilot</div>
        <h1>第一次见家长，不是拼会不会来事，而是先稳住分寸。</h1>
        <p className="hero-copy">
          这是一个 AI-first 的家庭互动场景操作系统。你只需要告诉系统你这次要面对什么
          家庭、最怕什么场景、你和伴侣哪里可能失配，它会自动给出风险画像、当天作战方
          案、协同建议，以及后续社媒与私域内容可复用的结构化结果。
        </p>
        <div className="hero-badges">
          <span>动态诊断</span>
          <span>情侣协同</span>
          <span>当天作战卡</span>
          <span>社媒内容包</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>三个极简入口，后面接的是完整顶配能力</h2>
          <p>{currentModeLabel}</p>
        </div>

        <div className="segmented">
          {(["prepare", "align", "battlePlan"] as Mode[]).map((mode) => (
            <button
              key={mode}
              className={input.mode === mode ? "segment active" : "segment"}
              onClick={() => setInput((current) => ({ ...current, mode }))}
              type="button"
            >
              {mode === "prepare" && "开始准备这次见面"}
              {mode === "align" && "和 TA 对齐口径"}
              {mode === "battlePlan" && "生成当天作战方案"}
            </button>
          ))}
        </div>

        <div className="form-grid">
          <label>
            <span>你的身份</span>
            <select
              value={input.persona}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  persona: event.target.value as CopilotInput["persona"],
                }))
              }
            >
              <option value="male">男生</option>
              <option value="female">女生</option>
            </select>
          </label>

          <label>
            <span>对方家庭待客风格</span>
            <select
              value={input.familyStyle}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  familyStyle: event.target.value as CopilotInput["familyStyle"],
                }))
              }
            >
              {familyStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>父母背景</span>
            <select
              value={input.parentBackground}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  parentBackground:
                    event.target.value as CopilotInput["parentBackground"],
                }))
              }
            >
              {parentBackgrounds.map((background) => (
                <option key={background.id} value={background.id}>
                  {background.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>见面性质</span>
            <select
              value={input.relationStage}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  relationStage:
                    event.target.value as CopilotInput["relationStage"],
                }))
              }
            >
              {relationStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>计划哪天见面</span>
            <input
              type="text"
              placeholder="例如：下周六晚饭、五一假期"
              value={input.scheduledTime}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  scheduledTime: event.target.value,
                }))
              }
            />
          </label>

          <label>
            <span>预算（礼物/准备）</span>
            <input
              type="text"
              placeholder="例如：300-500"
              value={input.budget}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  budget: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className="question-block">
          <span className="block-title">这次在场的人</span>
          <div className="chip-grid">
            {[
              "只有对方父母",
              "有祖辈",
              "有成年兄弟姐妹",
              "有未成年孩子",
              "可能有亲戚",
              "可能有邻居或父母朋友",
            ].map((member) => (
              <button
                type="button"
                key={member}
                className={
                  input.attendees.includes(member) ? "chip active" : "chip"
                }
                onClick={() =>
                  setInput((current) => ({
                    ...current,
                    attendees: toggleItem(current.attendees, member),
                  }))
                }
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        <div className="question-block">
          <span className="block-title">你最担心什么</span>
          <div className="chip-grid">
            {stressorOptions.map((stressor) => (
              <button
                type="button"
                key={stressor}
                className={
                  input.primaryStressors.includes(stressor)
                    ? "chip active"
                    : "chip"
                }
                onClick={() =>
                  setInput((current) => ({
                    ...current,
                    primaryStressors: toggleItem(
                      current.primaryStressors,
                      stressor,
                    ),
                  }))
                }
              >
                {stressor}
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid dual-grid">
          <label>
            <span>你和 TA 是否已统一婚期/房车等口径</span>
            <select
              value={input.alignmentReady}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  alignmentReady:
                    event.target.value as CopilotInput["alignmentReady"],
                }))
              }
            >
              {yesNoAnswers.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>对方家庭是否偏强势</span>
            <select
              value={input.parentPressure}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  parentPressure:
                    event.target.value as CopilotInput["parentPressure"],
                }))
              }
            >
              {yesNoAnswers.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="long-field">
          <span>你对这次见面的补充描述</span>
          <textarea
            rows={5}
            placeholder="例如：她妈妈讲话很直接，可能会问工作和以后在哪个城市定居；我不太会喝酒；这次应该还有爷爷在。"
            value={input.notes}
            onChange={(event) =>
              setInput((current) => ({ ...current, notes: event.target.value }))
            }
          />
        </label>

        <div className="actions">
          <button
            className="primary-button"
            type="button"
            disabled={isLoading}
            onClick={submit}
          >
            {isLoading ? "AI 正在编排方案..." : "生成我的顶配方案"}
          </button>
          <p className="hint">
            输出内容包含：风险画像、当天作战卡、情侣协同建议、礼物建议、社媒内容包。
          </p>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>

      {result ? (
        <section className="result-stack">
          <article className="panel">
            <div className="section-title">
              <h2>{result.heroTitle}</h2>
              <p>{result.heroSummary}</p>
            </div>
            <div className="risk-line">
              <span className={`risk-pill ${result.riskLevel}`}>
                {riskTone[result.riskLevel]}
              </span>
              <span>总体画像：{result.personaLabel}</span>
            </div>
            <ul className="metric-list">
              {result.topRisks.map((risk) => (
                <li key={risk.title}>
                  <strong>{risk.title}</strong>
                  <span>{risk.reason}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <div className="section-title">
              <h2>当天作战方案</h2>
              <p>不是泛建议，而是按这次场景拆成具体动作。</p>
            </div>
            <div className="plan-grid">
              {result.battlePlan.map((item) => (
                <div className="plan-card" key={item.phase}>
                  <h3>{item.phase}</h3>
                  <ul>
                    {item.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-title">
              <h2>情侣协同与口径建议</h2>
              <p>顶配系统不只看你自己，也看你和 TA 的失配风险。</p>
            </div>
            <div className="alignment-box">
              <div>
                <h3>协同判断</h3>
                <p>{result.alignmentSummary}</p>
              </div>
              <ul className="bullet-list">
                {result.alignmentActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel">
            <div className="section-title">
              <h2>礼物与准备建议</h2>
              <p>把预算、家庭风格和场景一并考虑，不做死板推荐。</p>
            </div>
            <div className="gift-box">
              <p className="gift-title">{result.giftPlan.title}</p>
              <p>{result.giftPlan.summary}</p>
              <ul className="bullet-list">
                {result.giftPlan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="panel">
            <div className="section-title">
              <h2>社媒/私域自动化内容包</h2>
              <p>这部分是为后续自动化运营准备的结构化结果，不是额外摆设。</p>
            </div>
            <div className="content-pack-grid">
              <div className="pack-card">
                <h3>短视频标题</h3>
                <ul className="bullet-list">
                  {result.contentPack.shortVideoHooks.map((hook) => (
                    <li key={hook}>{hook}</li>
                  ))}
                </ul>
              </div>
              <div className="pack-card">
                <h3>图文选题</h3>
                <ul className="bullet-list">
                  {result.contentPack.socialPosts.map((post) => (
                    <li key={post}>{post}</li>
                  ))}
                </ul>
              </div>
              <div className="pack-card">
                <h3>私域首条消息</h3>
                <p>{result.contentPack.privateDomainOpen}</p>
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="panel empty-state">
          <h2>系统会输出什么</h2>
          <div className="plan-grid">
            <div className="plan-card">
              <h3>准备诊断</h3>
              <p>测你最容易翻车的行为模式，而不是只给礼仪常识题。</p>
            </div>
            <div className="plan-card">
              <h3>情侣协同</h3>
              <p>识别你和 TA 是否口径不一致、谁该开场、谁该补位。</p>
            </div>
            <div className="plan-card">
              <h3>当天作战卡</h3>
              <p>按见面前、进门、饭桌、敏感问题、收尾五段式输出动作。</p>
            </div>
            <div className="plan-card">
              <h3>运营内容包</h3>
              <p>自动派生短视频选题、图文标题和私域开场话术。</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
