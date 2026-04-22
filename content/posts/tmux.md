---
date: "2025-06-11"
title: "Tmux"
excerpt: "Overview of tmux, the terminal multiplexer that enables panes, windows, and sessions for efficient terminal workflows."
tags:
  - tmux
  - terminal
  - productivity
---

# Tmux

tmux is a terminal multiplexer for UNIX-like systems, similar to GNU Screen or Byobu, which enables splitting a single console into multiple panes or creating independent sessions within the same terminal. In practical terms, tmux allows multiple virtual terminals to operate within one window.

> Detailed documentation is available in the [OpenBSD manual](https://man.openbsd.org/OpenBSD-current/man1/tmux.1).

> Much of the information here is drawn from the [Learn Linux TV playlist](https://www.youtube.com/playlist?list=PLT98CRl2KxKGiyV1u6wHDV8VwcQdzfuKe).

## Sessions

A session in tmux comprises a collection of windows and panes. Each session represents an isolated workspace for a specific set of tasks or projects. Multiple sessions can run concurrently, and sessions may be detached and reattached as needed.

## Windows

Within a session, multiple windows may be created. Each window provides an independent view containing its own set of panes. Windows facilitate organization of distinct tasks or contexts within the same session.

## Panes

Panes divide a single window into multiple regions, each capable of hosting a separate terminal or application. Panes enable simultaneous monitoring of a process in one pane while interacting with another, without switching windows.

## Installation

Installation steps vary by distribution; refer to the [official tmux installation guide](https://github.com/tmux/tmux/wiki/Installing)) for system-specific instructions. In general, executing: `<package-manager> install tmux`.

## Commands

- `tmux new -s <name>`: create a new session named "name".

- `tmux list-sessions` or `tmux ls`: list all active sessions..

- `tmux attach` or `tmux a`: attach to the most recently used session.

- `tmux a -t <session name>`: attach to a specific session.

- `tmux kill-session -t <session number>`: terminate the specified session.

## Shortcuts

All shortcuts assume the default prefix `CTRL + b` (modifiable in configuration).

- `d`: detach from the current session.

- `s` (session): list all sessions.

- `$`: rename the current session.

	> `tmux rename-session`.

- `(` / `)`: switch to previous / next session.

- `c` (create): create a new window.

	> `tmux new-window`.

- `n` / `p`: move to next / previous window.

- `,`: rename the current window.

	> `tmux rename-window <new name>`.

- `<number>`: switch directly to window by number (starting at 0).

- `&`: close the current window.

- `%`: split pane vertically.

- `"`: split pane horizontally.

- `q`: display pane numbers.

- `q<panel number>`: switch to specified pane.

- `z`: toggle zoom for the active pane.

	> The same to unzoom.

- `!`: promote a pane to its own window.

- `<ARROW>`: navigate between panes

- `CTRL + b + <ARROW>`: resize panes.

- `x`: close the active pane.

- `:`: enter tmux command prompt.

- `:setw synchronize-panes`: synchronize input across all panes.

> A comprehensive [tmux cheat sheet](https://tmuxcheatsheet.com) is also available.

## Configuration

A user-specific configuration file can be created at `~/.tmux.conf`. Temporary, non-persistent options may be tested directly within the tmux command prompt before being added to the configuration file.

> Customization examples from Learn Linux TV can be found in this [configuration guide](https://www.learnlinux.tv/learn-tmux-part-5-how-to-customize-tmux-and-make-it-your-own).
