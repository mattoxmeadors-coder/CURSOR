import { CopilotForm } from "@/components/copilot-form";
import {
  familyStyles,
  knowledgeCards,
  operationsBlueprint,
  socialAutomation,
} from "@/lib/content";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">AI FAMILY VISIT COPILOT</div>
          <h1>第一次见家长，不靠硬撑，靠系统作战。</h1>
          <p className="hero-text">
            我已经按总工程师模式直接给你搭好顶配底座：前台三个入口，后台一整套诊断、协同、
            作战、复盘、社媒自动化引擎。你现在打开就能生成方案，后续只需要继续扩展模型与数据。
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#copilot">
              开始准备这次见面
            </a>
            <a className="secondary-link" href="#operating-system">
              查看系统能力图
            </a>
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <strong>3 个前台入口</strong>
              <span>准备 / 对齐 / 作战</span>
            </div>
            <div className="metric-card">
              <strong>7 层后台能力</strong>
              <span>诊断、追问、计划、协同、演练、礼物、生命周期</span>
            </div>
            <div className="metric-card">
              <strong>自动化链路</strong>
              <span>结果页 → 内容包 → 社媒脚本 → 私域跟进</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-label">当前前台入口</div>
          <ul className="entry-list">
            <li>开始准备这次见面</li>
            <li>和 TA 对齐口径</li>
            <li>生成我的当天作战方案</li>
          </ul>
          <div className="panel-note">
            后台不会让用户自己选 SKU，而是由 Copilot 自动路由到最适合的结果路径。
          </div>
        </div>
      </section>

      <section id="copilot" className="section-grid">
        <div className="section-heading">
          <div className="eyebrow">UNIFIED COPILOT</div>
          <h2>一个超级入口，驱动整套顶配系统</h2>
          <p>
            先用结构化规则跑出稳定结果，再继续把真实大模型接进来做动态追问、模拟演练和个性化增强。
          </p>
        </div>
        <CopilotForm />
      </section>

      <section id="operating-system" className="stack-section">
        <div className="section-heading">
          <div className="eyebrow">OPERATING SYSTEM</div>
          <h2>后台能力一次性顶配，不做低配版本思维</h2>
        </div>
        <div className="stack-grid">
          {operationsBlueprint.map((item) => (
            <article key={item.title} className="stack-card">
              <span className="stack-index">{item.id}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="knowledge-section">
        <div className="section-heading">
          <div className="eyebrow">KNOWLEDGE LAYER</div>
          <h2>规则知识卡先接住用户，个性化建议再往下打</h2>
        </div>
        <div className="knowledge-grid">
          {knowledgeCards.map((card) => (
            <article key={card.title} className="knowledge-card">
              <h3>{card.title}</h3>
              <ul>
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="family-section">
        <div className="section-heading">
          <div className="eyebrow">FAMILY STYLES</div>
          <h2>不做刻板标签，做待客风格识别</h2>
        </div>
        <div className="family-grid">
          {familyStyles.map((style) => (
            <article key={style.key} className="family-card">
              <h3>{style.label}</h3>
              <p>{style.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="automation-section">
        <div className="section-heading">
          <div className="eyebrow">AUTOMATION LAYER</div>
          <h2>社媒和私域不后置，而是跟产品内核同构</h2>
          <p>
            同一份风险画像和高危场景，可以自动派生为内容选题、短视频脚本、评论区回复和私域首条消息。
          </p>
        </div>
        <div className="automation-grid">
          {socialAutomation.map((item) => (
            <article key={item.title} className="automation-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
