---
date: "2026-03-25"
title: "How to install Arch Linux in WSL"
excerpt: "A practical, step-by-step guide to install Arch Linux in WSL."
tags:
  - linux
  - arch-linux
  - installation
---

# How to install Arch Linux in WSL

[A previous post](https:///blog/posts/Arch_Linux_installation.html) covered the full bare-metal Arch Linux installation. This version takes the shorter route: Arch Linux now provides an official WSL image and Microsoft's current WSL flow installs Linux distributions directly from Windows, with new installs using WSL 2 by default. Complete software liberation has not yet occurred, Windows is still the landlord, but this is still a very respectable first step toward the ceremonial title of **"Arch Linux user"**.

Because this is WSL, the usual bare-metal chores like booting an ISO, partitioning disks, installing a boot loader and generally negotiating with firmware, are not part of the process here. [The earlier guide](https:///blog/posts/Arch_Linux_installation.html) remains the reference for that full installation path; this one focuses only on the WSL variant.

## What is needed first?

Install WSL with the following command:

```ps1
wsl --install
```

> Distributions installed through that flow use WSL 2 by default. Arch's official WSL image is intended for WSL 2, not WSL 1.

If WSL is already installed, updating it first is still a good idea:

```ps1
wsl --update
```

## Install Arch Linux

Once WSL is available, Arch Linux can be installed directly from PowerShell using the official image:

```ps1
wsl --install archlinux
```

If the installation stalls at 0.0%, Microsoft recommends retrying with the web-download option:wsw

```ps1
wsl --install --web-download -d archlinux
```

After installation, Arch can be launched from the Start menu or from PowerShell with:

```ps1
wsl -d archlinux
```

The installed version can be checked with:

```ps1
wsl --list --verbose
```

Arch should appear there as a WSL 2 distribution.

## First boot

On the current Arch WSL setup, the initial configuration is handled before a non-root default user is defined, so the first round of setup is most naturally performed from that administrative session. A root password should be set before the default user is changed, so recovery remains easy if the user configuration ever goes sideways.

```bash
passwd
```

## Update the system and improve mirrors

Even inside WSL, Arch remains Arch. The first job is therefore a full system upgrade, along with a few useful packages for day-to-day life. The mirror refresh and user-setup flow below follows the same general approach as the earlier Arch installation guide, adapted for WSL.

```bash
pacman -Syu --needed sudo git base-devel reflector nvim
```

> Yes, you will install Neovim, what did you expect? you are a "Arch Linux user" now.

Once that completes, the mirror list can be refreshed for faster downloads:

```bash
cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
reflector --verbose --latest 20 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
pacman -Syyu
```

> That second sync is not strictly dramatic, but it does ensure the newly selected mirrors are used immediately.

## Create a regular user

Living forever as `root` is efficient in the same way juggling knives is efficient: technically possible, rarely advisable. A normal user should therefore be created, added to the wheel group and granted sudo access.

```bash
useradd -m -G wheel <username>
passwd <username>
EDITOR=nvim visudo
```

Inside `visudo`, the line that grants sudo privileges to the `wheel` group should be uncommented.

### Time zone

1. `timedatectl list-timezones`: list available time-zone identifiers.

	> A specific entry may be located with grep, for example: `timedatectl list-timezones | grep Bogota`.

2. `timedatectl set-timezone <time zone>`: the desired time zone is applied (e.g., `America/Bogota`).

3. `timedatectl set-ntp true`.

## Locales and console

1. Uncomment `en_US.UTF-8` in `/etc/locale.gen`, then run `locale-gen`.

2. Create `/etc/locale.conf` containing `LANG=en_US.UTF-8`.

3. Add `KEYMAP=us` in `/etc/vconsole.conf`.

## Configure `/etc/wsl.conf`

ArchWiki recommends setting the default WSL user in `/etc/wsl.conf` after the account has been created.

A minimal wsl.conf for that purpose looks like this:

```ini
[user]
default=<username>
```

It can also be written in one shot:

```bash
cat > /etc/wsl.conf <<EOF
[user]
default=<username>
EOF
```

## Restart WSL cleanly

After `wsl.conf` is changed, the distribution should be closed and WSL should be restarted from PowerShell so the new settings are applied.

First, leave the Arch session:

```bash
exit
```

Then, in PowerShell:

```bash
wsl --shutdown
wsl -d archlinux
```

If everything is configured correctly, the next session should open as the newly created user rather than `root`.

## Recommendations

For better performance, Linux-side projects should be kept inside the Linux filesystem, such as `/home/<username>/`projects, rather than under `/mnt/c`. Microsoft recommends using the Linux filesystem for Linux tools because file operations are faster there.

## Configure `/etc/wsl.conf`

A more complete `wsl.conf` can be used to make Arch on WSL feel a little less like a guest and a little more like a proper home. In the example below, systemd is enabled, the regular account is made the default login, Windows drives are mounted with Linux metadata support and Windows path entries are kept out of the shell environment.

```ini
[boot]
systemd=true

[user]
default=<username>

[automount]
enabled=true
options="metadata,umask=022"

[interop]
appendWindowsPath=false
```

This configuration is especially nice for day-to-day use. The shell environment stays tidier, file ownership on mounted Windows drives becomes more predictable and the regular user account is used automatically instead of dropping into root every time.

## Configure `/etc/pacman.conf` {#configure-pacman-conf}

A few small tweaks in `/etc/pacman.conf` can make `pacman` feel a little nicer in day-to-day use. Faster downloads can be enabled, package lists can be made easier to read and one completely unnecessary but spiritually important option can also be added: `ILoveCandy`.

A sensible configuration under the `[options]` section looks like this:

```ini
Color
VerbosePkgLists
ParallelDownloads = 5
ILoveCandy
CheckSpace
# NoProgressBar
```

This keeps `pacman` readable, enables concurrent downloads and adds a quick disk-space check before installations.

---

That is the whole process. No USB installer was needed and no partition table was touched. Windows is still technically in charge, so total freedom remains a future milestone, but an important symbolic threshold has now been crossed: Arch Linux is running, `pacman` is ready, the mirrors are sane and the badge of "Arch Linux user" has been earned, at least provisionally.

For the full native installation path, [the earlier bare-metal guide](https:///blog/posts/Arch_Linux_installation.html) remains the companion piece to this one.
