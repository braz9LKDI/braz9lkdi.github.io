---
date: "2026-01-07"
title: "Hyprland setup"
excerpt: "A practical, step-by-step guide to install Arch Linux from a blank drive to a clean, bootable system."
tags:
    - linux
    - arch-linux
---

# Hyprland setup

This guide builds upon the foundation established in my ["Arch Linux installation"](https://braz9lkdi.github.io/blog/posts/Arch_Linux_installation.html) post. Assuming you have completed those steps, you should now have a clean base system. Below, we will cover the essential packages required to transform that minimal base into a fully functional Hyprland desktop environment.

> Disclaimer: software packages update frequently, which may alter the configuration process. I aim to maintain the accuracy of this guide, similar to my previous Arch Linux post.

This customization relies on numerous configuration files. I will include essential, short snippets within this post; however, for extensive configurations, I will refer you to the full source code in my dotfiles. If configuration files are not required, I will not include them in the corresponding section.

## Colors

To ensure visual consistency across the entire system, I utilize centralized "color files" that are sourced by individual applications. This setup relies on the following files:

- Hyprland: `~/.config/hypr/colors.conf`.

- Waybar: `~/.config/waybar/colors.css`.

- Kitty: `~/.config/kitty/colors.conf`.

- Scripts: `~/.scripts/colors_and_helpers`.

    > Note: the scripts file is only necessary if you plan to write custom scripts and want them to inherit your system's color palette.

You can find the specific color codes I use by checking these files in my [**dotfiles**](https://github.com/Br4z/gray_files) which are based in the [Apprentice theme](https://github.com/Br4z/gray_files/blob/main/colorscheme/colorschemes.md).

## System and core

### Screen lock manager

A screen lock manager is a security utility that prevents unauthorized access to your session. It locks the display when you leave your computer or trigger it manually, requiring a password or authentication to resume your work.

- Package: `hyprlock`.

- [Documentation](https://wiki.hypr.land/Hypr-Ecosystem/hyprlock).

- [Example configuration file](https://github.com/hyprwm/hyprlock/blob/main/assets/example.conf).

- Configuration file: [`~/.config/hypr/hyprlock.conf`](https://github.com/Br4z/gray_files/blob/main/hyprland/hyprlock.conf).

    > Note: if you plan to use my configuration, ensure you update the monitor and path variables to match your system.

### Idle manager

An idle manager is a background daemon that monitors input activity. Its primary purpose is to save energy and secure the system by triggering events, such as turning off the screen, locking the session, or suspending the computer, after a specific period of inactivity.

- Package: `hypridle`.

- [Documentation](https://wiki.hypr.land/Hypr-Ecosystem/hypridle).

- [Example configuration file](https://github.com/hyprwm/hypridle/blob/main/assets/example.conf).

- Configuration file: `~/.config/hypr/hypridle.conf`.

    ```ini
    general {
        lock_cmd = pidof hyprlock || hyprlock
        before_sleep_cmd = loginctl lock-session   # Lock before suspend.
        after_sleep_cmd = hyprctl dispatch dpms on
    }

    listener {
        timeout = 300                          # 5 min
        on-timeout = hyprctl dispatch dpms off # Screen off
        on-resume = hyprctl dispatch dpms on   # Screen on
    }

    listener {
        timeout = 900                  # 15 min
        on-timeout = systemctl suspend # Suspend pc
    }
    ```

    If you are a laptop user, you might want to add brightness settings to these rules to dim the screen before turning it off completely.

## Desktop environment

### Bar

The status bar is the central information hub of your desktop. It displays essential system details such as the time, battery life, workspace status, and active applications, acting as the primary interface for system monitoring.

- Package: `waybar`.

- [Documentation](https://github.com/Alexays/Waybar/wiki).

- [Example configuration file](https://github.com/Alexays/Waybar/blob/master/resources/config.jsonc).

- Configuration file: [`~/.config/waybar/config.jsonc`](https://github.com/Br4z/gray_files/blob/main/waybar/config.jsonc) for functionality and [`~/.config/waybar/style.css`](https://github.com/Br4z/gray_files/blob/main/waybar/style.css) for appearance.

    You will need to change `"hwmon-path"` in the `"temperature"` module to correctly display your CPU temperature.

### Application launcher

An application launcher serves as your digital menu. It provides a quick and searchable interface to open programs, run commands, or switch between windows without navigating through complex submenus.

- Package: `hyprlauncher`.

- [Documentation](https://wiki.hypr.land/Hypr-Ecosystem/hyprlauncher).

- Configuration file: `~/.config/hypr/hyprlauncher.conf`.

    > Personally, I use the default configuration. However, if you want to customize the colors, you will need to modify the global [`hyprtoolkit`](https://wiki.hypr.land/Hypr-Ecosystem/hyprtoolkit/) theme configuration at `~/.config/hypr/hyprtoolkit.conf`.

### Notification manager

The notification manager handles system and application alerts. It displays pop-up messages for events like incoming emails, music changes, or system errors, ensuring you stay informed without interrupting your workflow.

- Package: `mako`.

- [Documentation](https://github.com/emersion/mako/wiki).

- [Example configuration file](https://github.com/emersion/mako/wiki/Example-configuration).

- Configuration file: `~/.config/mako/config`.

    ```ini
    sort=-time
    layer=overlay
    background-color=#1C1C1C
    width=300
    height=110
    border-size=2
    border-color=#BCBCBC
    border-radius=5
    icons=0
    max-icon-size=64
    default-timeout=5000
    ignore-timeout=1
    font=CaskaydiaMono Nerd Font Mono 14

    [urgency=low]
    border-color=#5F875F

    [urgency=normal]
    border-color=#6C6C6C

    [urgency=high]
    border-color=#AF5F5F
    default-timeout=0

    [category=mpd]
    default-timeout=2000
    group-by=category
    ```

## Screenshot

- Packages:
    - `grim`: grab images from a Wayland compositor (the actual screenshot tool).

    - `slurp`: select a region in a Wayland compositor (provides the geometry for grim).

    - `swappy`: a Wayland-native snapshot editing tool (for drawing arrows, blurring text, etc.).
        - Configuration file: `~/.config/swappy/config`.

            ```ini
            [Default]
            save_dir=$HOME/pictures/screenshots
            save_filename_format=swappy-%Y%m%d-%H%M%S.png
            show_panel=true
            line_size=5
            text_size=20
            text_font=CaskaydiaMono Nerd Font
            paint_mode=brush
            early_exit=false
            fill_shape=false
            ```

            > Make sure `save_dir` exists.

I use the following keybindings in my hyprland.conf to chain these tools together:

```ini
# Capture region -> edit -> save/copy
bind = $mainMod SHIFT, S, exec, grim -g "$(slurp)" - | swappy -f -

# Capture full screen -> edit -> save/copy
bind = , Print, exec, grim - | swappy -f -

# Capture region -> clipboard only
bind = $mainMod, Print, exec, grim -g "$(slurp)" - | wl-copy && notify-send "Screenshot" "Copied to clipboard"
```

> Honorable mention: [`grimblast-git`](https://github.com/hyprwm/contrib/tree/main/grimblast).

## Wallpaper

- Package: `hyprpaper`.

- [Documentation](https://wiki.hypr.land/Hypr-Ecosystem/hyprpaper).

- Configuration file: `~/.config/hypr/hyprpaper.conf`.

    ```ini
    wallpaper {
        monitor = DP-3
        path = /mnt/files/pictures/wallpapers/Cailee_Spaeny.jpg
        fit_mode = cover
    }
    ```

    You will need to change the monitor name (`monitor`) and the path to your image file (`path`).

## Theming and appearance

Hyprland is a compositor, not a full desktop environment, so "system theming" is mostly about wiring together a few separate layers (GTK, Qt, icons, cursors, and fonts). In this section, I will outline the small set of tools I use to keep those layers consistent, without hand-editing a bunch of config files.

I create my GTK and Qt themes using `themix-full-git`.

### GTK manager

In a standalone window manager like Hyprland, applications do not automatically share a unified theme. A GTK manager is essential for defining the visual style (colors, borders, widgets) of your applications. It allows you to apply themes, icon sets, cursors, and fonts globally, ensuring consistency between your file manager, web browser, and system tools.

- Package: `nwg-look`.

Since it is a graphical tool designed specifically to generate the necessary settings files for you, you do not need to worry about editing configuration files manually, but you do need to worry about where you store your themes:

- User: `~/.local/share/themes`.

- System: `/usr/share/themes`.

### Qt6 manager

Qt applications (like Dolphin, OBS Studio, or VLC) do not naturally inherit the Hyprland look. This engine acts as a bridge, allowing Qt6 applications to read your specific color schemes and cursor settings without needing a separate GUI tool like `qt6ct`.

- Package: `hyprqt6engine`.

- [Documentation](https://wiki.hypr.land/Hypr-Ecosystem/hyprqt6engine).

- Configuration file: `~/.config/hypr/hyprqt6engine.conf`.

### Font manager

Managing typefaces on Linux can sometimes be cumbersome via the command line. A font manager provides a visual interface to preview, install, and organize your system fonts. It allows you to disable unused fonts to speed up application loading times and compare different typefaces side-by-side.

- package: `font-manager`.

## Productivity

### Terminal

The terminal emulator is the command-line interface for your desktop environment. It acts as the window through which you interact with the system shell, allowing you to execute commands, run text-based applications, and manage files. A modern terminal emulator typically offers features like hardware acceleration, tabbed browsing, and extensive customization options to improve workflow efficiency.

- package: `kitty`.

- [Documentation](https://sw.kovidgoyal.net/kitty/).

- Example configuration file: you can generate it with the shortcut `CTRL + SHIFT + F2` while inside the application.

    > Since the default configuration file is heavily commented, it effectively serves as its own documentation.

- Configuration file: [`~/.config/kitty/kitty.conf`](https://github.com/Br4z/gray_files/blob/main/kitty/kitty.conf).

### Text editor

- package: `mousepad`.

If you want to back up your settings (which are stored in the `dconf` database), you can export them with this command:

```bash
dconf dump /org/xfce/mousepad/ > mousepad-backup.conf
```

To restore them later:

```bash
dconf load /org/xfce/mousepad/ < mousepad-backup.conf
```

> I am planning to write a post about `nvim` (a text editor for terminals), in case you are interested in using it, so stay tuned.

### Document viewer

- package: `zathura` (and `zathura-pdf-mupdf` for PDF support).

- [Documentation](https://pwmt.org/projects/zathura/documentation/).

- Configuration file: [`~/.config/zathura/zathurarc`](https://github.com/Br4z/gray_files/tree/main/zathura/zathurarc).

    > My configuration file only applies visual theming; all keybindings remain at their default settings.

### File explorer

- Packages:
    - `thunar`: main package.

    - `thunar-volman`: manages automatic mounting of removable devices.

    - `gvfs`: provides virtual filesystem support (trash bin, network shares, mounting).

    - `tumbler`: generates image thumbnails.

    - `ffmpegthumbnailer`: generates video thumbnails.

    - `thunar-archive-plugin`: allows you to create and extract archives (requires `Xarchiver`).

If you want to back up your settings or theme adjustments, you can find the configuration files in `~/.config/xfce4/xfconf/xfce-perchannel-xml/`.

## Media

### Audio manager

An audio manager provides a graphical interface to control volume levels, select audio devices, and manage audio streams across applications. It acts as the bridge between your applications and the sound system, allowing you to route audio, adjust per-application volumes, and switch between speakers, headphones, or external devices seamlessly.

- Package: `pwvucontrol`.

### Video player

- Package: `mpv`.

- [Documentation](https://mpv.io/manual/stable/).

- [Example configuration file](https://github.com/mpv-player/mpv/blob/master/etc/mpv.conf).

- Configuration file: [`~/.config/mpv/mpv.conf`](https://github.com/Br4z/gray_files/tree/main/mpv/mpv.conf).

### Image viewer

- Package: `nsxiv`.

- Configuration file: `~/.config/nsxiv/`.

### Music server

A music server is a background daemon that manages your music library and streams audio to connected clients. It separates the music source (library management) from the playback interface, allowing you to control playback from different devices or applications while maintaining a centralized music collection.

- Package: `mpd`.

- [Documentation](https://mpd.readthedocs.io/en/stable).

- Configuration file: [`~/.config/mpd/mpd.conf`](https://github.com/Br4z/gray_files/tree/main/mpd/mpd.conf).

### Music player

A music player client connects to your music server and provides the user interface for playback control, playlist management, and library browsing. By using a dedicated client, you gain flexibility—different clients can offer different workflows while all connecting to the same music source.

- Package: `rmpc`.

- [Documentation](https://rmpc.mierak.dev/next/overview).

- Configuration file: [`~/.config/rmpc/rmpc.conf`](https://github.com/Br4z/gray_files/tree/main/rmpc/rmpc.conf).
