const {
  familyStyles,
  parentBackgrounds,
  relationStages,
  yesNoAnswers,
  stressorOptions,
  attendeeOptions,
  defaultInput,
} = require("../../utils/copilot-data");
const { generateCopilotResult } = require("../../utils/copilot-engine");

Page({
  data: {
    modeOptions: [
      { id: "prepare", label: "开始准备这次见面", desc: "我快见家长了，帮我准备到位。" },
      { id: "align", label: "和 TA 对齐口径", desc: "先统一高压问题，防止现场失配。" },
      { id: "battlePlan", label: "生成当天作战方案", desc: "直接按场景给我今天能执行的动作。" },
    ],
    familyStyles,
    parentBackgrounds,
    relationStages,
    yesNoAnswers,
    stressorOptions,
    attendeeOptions,
    form: { ...defaultInput },
  },

  setField(key, value) {
    this.setData({
      [`form.${key}`]: value,
    });
  },

  onModeTap(event) {
    this.setField("mode", event.currentTarget.dataset.value);
  },

  onPersonaChange(event) {
    this.setField("persona", event.detail.value);
  },

  onFamilyStyleChange(event) {
    this.setField("familyStyle", event.detail.value);
  },

  onParentBackgroundChange(event) {
    this.setField("parentBackground", event.detail.value);
  },

  onRelationStageChange(event) {
    this.setField("relationStage", event.detail.value);
  },

  onScheduledTimeInput(event) {
    this.setField("scheduledTime", event.detail.value);
  },

  onBudgetInput(event) {
    this.setField("budget", event.detail.value);
  },

  onChoiceFieldChange(event) {
    const key = event.currentTarget.dataset.key;
    this.setField(key, event.detail.value);
  },

  onNotesInput(event) {
    this.setField("notes", event.detail.value);
  },

  onToggleListItem(event) {
    const key = event.currentTarget.dataset.key;
    const value = event.currentTarget.dataset.value;
    const items = this.data.form[key] || [];
    const next = items.includes(value)
      ? items.filter((item) => item !== value)
      : items.concat(value);

    this.setData({
      [`form.${key}`]: next,
    });
  },

  onSubmit() {
    const result = generateCopilotResult(this.data.form);
    const encoded = encodeURIComponent(JSON.stringify(result));
    wx.navigateTo({
      url: `/pages/result/result?payload=${encoded}`,
    });
  },
});
