const {
  familyStyles,
  parentBackgrounds,
  relationStages,
  yesNoAnswers,
  stressorOptions,
  attendeeOptions,
  defaultForm,
} = require("../../utils/copilot-data");
const { generateCopilotResponse } = require("../../utils/copilot-engine");

const modeOptions = [
  { id: "prepare", label: "开始准备这次见面", desc: "先把礼数、节奏和高压问题准备到位。" },
  { id: "align", label: "和 TA 对齐口径", desc: "在见面前统一婚期、房车、城市等敏感问题。" },
  { id: "battlePlan", label: "生成当天作战方案", desc: "直接拿到这次见面的五段式动作清单。" },
];

const personaOptions = [
  { id: "male", label: "男生" },
  { id: "female", label: "女生" },
];

function findIndex(list, id) {
  const index = list.findIndex((item) => item.id === id);
  return index >= 0 ? index : 0;
}

Page({
  data: {
    modeOptions,
    personaOptions,
    familyStyles,
    parentBackgrounds,
    relationStages,
    yesNoAnswers,
    stressorOptions,
    attendeeOptions,
    riskLevelText: {
      high: "高压",
      medium: "中压",
      low: "低压",
    },
    form: { ...defaultForm },
    personaIndex: 0,
    familyStyleIndex: 0,
    parentBackgroundIndex: 0,
    relationStageIndex: 0,
    alignmentIndex: 2,
    pressureIndex: 0,
    selectedAttendeesMap: {},
    selectedStressorsMap: {},
    currentModeTitle: modeOptions[0].label,
    currentModeDesc: modeOptions[0].desc,
  },

  syncModeMeta(mode) {
    const match = modeOptions.find((item) => item.id === mode) || modeOptions[0];
    this.setData({
      currentModeTitle: match.label,
      currentModeDesc: match.desc,
    });
  },

  syncSelectionMaps(form) {
    const attendees = form.attendees || [];
    const stressors = form.primaryStressors || [];
    const selectedAttendeesMap = {};
    const selectedStressorsMap = {};

    attendees.forEach((item) => {
      selectedAttendeesMap[item] = true;
    });

    stressors.forEach((item) => {
      selectedStressorsMap[item] = true;
    });

    this.setData({
      selectedAttendeesMap,
      selectedStressorsMap,
    });
  },

  setField(key, value) {
    this.setData({
      [`form.${key}`]: value,
    });
  },

  onModeChange(event) {
    const mode = event.currentTarget.dataset.id;
    this.setField("mode", mode);
    this.syncModeMeta(mode);
  },

  onPersonaChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      personaIndex: index,
      "form.persona": personaOptions[index].id,
    });
  },

  onFamilyStyleChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      familyStyleIndex: index,
      "form.familyStyle": familyStyles[index].id,
    });
  },

  onParentBackgroundChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      parentBackgroundIndex: index,
      "form.parentBackground": parentBackgrounds[index].id,
    });
  },

  onRelationStageChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      relationStageIndex: index,
      "form.relationStage": relationStages[index].id,
    });
  },

  onAlignmentChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      alignmentIndex: index,
      "form.alignmentReady": yesNoAnswers[index].id,
    });
  },

  onPressureChange(event) {
    const index = Number(event.detail.value);
    this.setData({
      pressureIndex: index,
      "form.parentPressure": yesNoAnswers[index].id,
    });
  },

  onTextInput(event) {
    const key = event.currentTarget.dataset.field;
    this.setField(key, event.detail.value);
  },

  toggleAttendee(event) {
    const value = event.currentTarget.dataset.value;
    const items = this.data.form.attendees || [];
    const next = items.includes(value)
      ? items.filter((item) => item !== value)
      : items.concat(value);
    this.setData({
      "form.attendees": next,
    });
    this.syncSelectionMaps({
      ...this.data.form,
      attendees: next,
    });
  },

  toggleStressor(event) {
    const value = event.currentTarget.dataset.value;
    const items = this.data.form.primaryStressors || [];
    const next = items.includes(value)
      ? items.filter((item) => item !== value)
      : items.concat(value);
    this.setData({
      "form.primaryStressors": next,
    });
    this.syncSelectionMaps({
      ...this.data.form,
      primaryStressors: next,
    });
  },

  generatePlan() {
    const result = generateCopilotResponse(this.data.form);
    wx.setStorageSync("copilotResult", result);
    wx.navigateTo({
      url: "/pages/result/result",
    });
  },

  onLoad() {
    this.setData({
      personaIndex: findIndex(personaOptions, this.data.form.persona),
      familyStyleIndex: findIndex(familyStyles, this.data.form.familyStyle),
      parentBackgroundIndex: findIndex(parentBackgrounds, this.data.form.parentBackground),
      relationStageIndex: findIndex(relationStages, this.data.form.relationStage),
      alignmentIndex: findIndex(yesNoAnswers, this.data.form.alignmentReady),
      pressureIndex: findIndex(yesNoAnswers, this.data.form.parentPressure),
    });
    this.syncModeMeta(this.data.form.mode);
    this.syncSelectionMaps(this.data.form);
  },
});
