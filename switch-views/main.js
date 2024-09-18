/*
Написан ручками на основе плагина obsidian-refresh-preview с помощью автора плагина
*/

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) =>
  __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => RefreshPreviewPlugin,
});
module.exports = __toCommonJS(main_exports);

// src/RefreshPreviewPlugin.ts
var import_obsidian = require("obsidian");
var RefreshPreviewPlugin = class extends import_obsidian.Plugin {
  onload() {
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
    this.addCommand({
      id: "switch-views",
      name: "Switch-views",
      checkCallback: this.refreshPreview.bind(this),
    });
    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.addRefreshPreviewButton();
      })
    );
    this.registerDomEvent(document, "click", (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.matches(".switch-button")
      ) {
        this.refreshPreview(false);
      }
    });
    this.register(this.removeRefreshPreviewButton.bind(this));
  }
  onLayoutReady() {
    this.addRefreshPreviewButton();
  }
  refreshPreview(checking) {
    const view = this.app.workspace.getActiveViewOfType(
      import_obsidian.MarkdownView
    );
    if (view?.getMode() !== "source") {
      return false;
    }
      if (!checking) {
        (async () => {
          const viewstate = app.workspace.activeLeaf.getViewState();
          if (viewstate != null) {
            if (viewstate.state.source == true) {
              await app.workspace.activeLeaf.setViewState({
                type: "markdown",
                state: { mode: "source", source: false },
              });
            } else if (viewstate.state.source == false) {
              await app.workspace.activeLeaf.setViewState({
                type: "markdown",
                state: { mode: "source", source: true },
              });
            }
          }
        })();
      }
      return true;
    }
    addRefreshPreviewButton() {
    const view = this.app.workspace.getActiveViewOfType(
      import_obsidian.MarkdownView
    );
    if (!view) {
      return;
    }
    if (view.getMode() !== "source") {
      this.removeRefreshPreviewButtonFromView(view);
      return;
    }
    const actionsContainer = this.getActionsContainer(view);
    if (!actionsContainer) {
      return;
    }
    let refreshPreviewButton = this.getRefreshPreviewButton(actionsContainer);
    if (refreshPreviewButton) {
      return;
    }
    refreshPreviewButton = createEl("button", {
      cls: "switch-button clickable-icon view-action",
    });
    (0, import_obsidian.setIcon)(refreshPreviewButton, "file-edit");
    (0, import_obsidian.setTooltip)(refreshPreviewButton, "Switch-views");
    actionsContainer.prepend(refreshPreviewButton);
  }
  getRefreshPreviewButton(actionsContainer) {
    return actionsContainer.querySelector(".switch-button");
  }
  removeRefreshPreviewButton() {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      this.removeRefreshPreviewButtonFromView(leaf.view);
    }
  }
  getActionsContainer(view) {
    return view.containerEl.querySelector(".view-header .view-actions");
  }
  removeRefreshPreviewButtonFromView(view) {
    const actionsContainer = this.getActionsContainer(view);
    if (!actionsContainer) {
      return;
    }
    const refreshPreviewButton = this.getRefreshPreviewButton(actionsContainer);
    if (refreshPreviewButton) {
      actionsContainer.removeChild(refreshPreviewButton);
    }
  }
};
