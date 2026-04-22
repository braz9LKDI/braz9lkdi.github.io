---
date: "2025-06-13"
title: "Basic Visual Studio Code configuration"
excerpt: "Practical Visual Studio Code settings and tweaks to improve productivity and comfort."
tags:
  - vscode
  - editor
  - configuration
  - tips
---

# Basic Visual Studio Code configuration

VS Code ranks among the most popular text editors due to its ease of use and extensive community support (themes, extensions, tutorials). The following configurations, applied via `settings.json`, have proven particularly useful. GUI configuration remains an option.

## `setting.json`

- `terminal.integrated.enablePersistentSessions`: determines whether integrated terminal sessions persist across editor restarts.

	> `false`.

- `workbench.statusBar.visible`: controls the visibility of the status bar at the bottom of the editor.

	> `false`.

- `workbench.sideBar.location`: specifies the sidebar's position.

	> Preferred value: `"right"` to avoid content shift when toggling.

- `workbench.editor.showTabs`: defines tab display mode for open files.

	> `"single"` (only the active file’s name is shown).

- `workbench.startupEditor`: sets the startup view upon opening VS Code.

	> `"none"` (restores the previous session).

- `workbench.list.smoothScrolling`: enables smooth scrolling in sidebar lists.

	> `true`.

- `workbench.tree.enableStickyScroll`: enables “sticky scroll” in the file explorer, keeping directory context visible while scrolling.

	> `true`.

- `editor.scrollbar.vertical`: controls the vertical scrollbar's behavior.

	> `"auto"`.

- `editor.cursorBlinking`: defines the cursor's blinking animation.

	> `"expand"`.

- `editor.cursorSmoothCaretAnimation`: enables smooth cursor movement.

	> `true`.

- `editor.linkedEditing`: synchronizes editing of matching HTML/XML tags.

	> `true`.

- `editor.detectIndentation`: determines whether indentation settings adapt to the file.

	> `false`.

- `editor.inlayHints.enabled`: toggles inlay hints (refer to GUI by searching "inlay hints").

	> `"on"`.

- `editor.bracketPairColorization.enabled`: enables colorization of matching brackets, braces, and parentheses.

	> `true`.

- `editor.guides.bracketPairs`: specifies which bracket pairs to highlight.

	> `"active"` (highlights only the pair at the cursor).

- `editor.minimap.enabled`: toggles the code minimap.

	> `false`.

- `editor.glyphMargin`: controls visibility of the glyph margin (for breakpoints, linting, etc.).

	> `false`.

- `editor.overviewRulerBorder`: toggles the border of the overview ruler (scrollbar area).

	> `false`.

- `editor.hideCursorInOverviewRuler`: toggles marking of the cursor position within the overview ruler.

	> `true`.

- `editor.wordWrap`: defines word-wrap behavior.

	`"off"`.

- `editor.insertSpaces`: determines whether pressing Tab inserts spaces.

	> `false`.

- `editor.stickyScroll.enabled`: enables sticky scroll within the editor (keeps context lines fixed at the top).

	> `true`.

- `files.autoSave`: controls automatic file saving.

	> `"onFocusChange"`.

- `security.workspace.trust.untrustedFiles`: defines handling of untrusted files in a workspace.

	> `"open"` (automatically opens untrusted files in the same window).

- `explorer.confirmDragAndDrop`: toggles confirmation dialog for drag‑and‑drop operations in the explorer.

	> `false`.

- `explorer.confirmDelete`: toggles confirmation dialog for file deletions in the explorer.

	> `false`.

- `files.trimTrailingWhitespace`: removes trailing whitespace on save.

	> `true`.

- `editor.formatOnPaste`: formats pasted content automatically.

	> `true`.

> For a personal `settings.json` example, refer to this [Gist](https://gist.github.com/Br4z/618bd822c9277c24bd4e5c63df216e02).
