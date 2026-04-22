---
date: "2025-12-25"
title: "Arch Linux installation"
excerpt: "A practical, step-by-step guide to install Arch Linux from a blank drive to a clean, bootable system."
tags:
  - linux
  - arch-linux
  - installation
---

# Arch Linux installation

For those who have contemplated installing the reputedly "dreaded" Arch Linux but have been discouraged by its perceived difficulty, the present guide offers a practical, step-by-step path from a blank drive to a clean, bootable system.

> Reading the entire document before executing commands is strongly encouraged.

> WARNING: the information herein should be verified whenever possible, as certain steps may evolve over time. Every effort will be made to keep the guide current.

## Preinstallation considerations

### Fast startup consideration

Fast startup is a Windows feature that reduces boot time by not completely shutting down the computer. Instead, it saves the system state (kernel and drivers) to a hibernation file (`hiberfil.sys`) and puts the drive into a "read-only" locked state.

#### Why does it matters for dual-boot?

If Fast Startup is enabled, Windows does not fully release its hold on your hard drives when you shut down. This causes two major problems when you boot into Linux:

1. Read-only Partitions: Linux will refuse to mount your Windows partitions with write access to prevent data corruption. You will see errors like "The NTFS partition is in an unsafe state".

2. WiFi/Bluetooth issues: sometimes Windows locks hardware drivers (like the WiFi card) in a specific state, making them fail to initialize correctly when you subsequently boot into Linux.

#### How to disable it

1.  Boot into Windows.

2.  Open **Control Panel** > **Hardware and Sound** > **Power Options**.

3.  Click on **"Choose what the power buttons do"**.

4.  Click the shield icon that says **"Change settings that are currently unavailable"** (requires Admin rights).

5.  Under "Shutdown settings", **uncheck** the box **"Turn on fast startup (recommended)"**.

6.  Click **Save changes** and fully restart your computer

### Real time clock alignment for dual boot systems

Linux stores the hardware clock in UTC, whereas Windows records local time. To avoid clock drift, on Windows:

1. Create `RealTimeIsUniversal` as a `DWORD` of 32 bits with value 1 under `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation`.

### SSH setup (remote installation)

Configuring OpenSSH in the live environment permits the entire installation to be driven from another computer via a secure shell.

1. `systemctl status sshd`.

	> If the process is not running, run it with `systemctl start sshd`.

2. `passwd`: set the root's password.

3. `ip addr show`: identify the installer's IP address.

4. Run `ssh root@<installer IP>` from the other device.

### Console legibility

Setting a larger console font with `setfont ter-132n` improves readability on Full-HD displays; select a smaller size on lower-resolution panels.

### UEFI verification

Presence of entries in `/sys/firmware/efi/efivars/` confirms a UEFI boot.

### Keyboard layout

1. List available layouts: `localectl list-keymaps`.

2. Filter with `grep`, e.g. `localectl list-keymaps | grep la-latin1`.

3. Load the layout: `loadkeys <layout>`.

## Networking

### Detecting interfaces

`ip addr show` lists active interfaces.

### Wi-Fi connection (`iwd`)

1. Launch the "iwd" shell: `iwctl`.

2. Confirm the adapter appears with `device list`; troubleshoot via the [Arch Wiki](https://wiki.archlinux.org/title/iwd) if absent.

3. Scan and enumerate networks.

	```
	station <device> scan
	station <device> get-networks
	station <device> connect "<SSID>"
	```

	> Alternatively, using `iwctl`: `iwctl --passphrase <passphrase> station <device> connect <SSID>`

A wired connection simplifies installation.

## Disk partitioning

### Target layout

| partition |    suggested size    |   filesystem    | purpose                                                |
|:---------:|:--------------------:|:---------------:|:------------------------------------------------------ |
|  `/efi`   |       500 MiB        |      FAT32      | holds bootloaders and NVRAM entries for UEFI firmware. |
|  `root`   | $\geq 40 \text{GiB}$ |      ext4       | operating system files.                                |
|  `/home`  |   remaining space    | ext4 (optional) | user data.                                             |

### Creating partitions with `fdisk`

1. `fdisk -l`: list all disks.

2. `fdisk /dev/<device>`.

3. `g`: initialize a GPT table.

4. Create the `EFI`.

	```
	n       # New partition
	1       # Partition number
	<ENTER> # Accept default first sector
	+500M
	t 1     # Change type
	```

5. Create the `/`.

	```
	n
	2
	     # Accept default first sector
	+50G # Size
	```

6. Create `/home`.

	```
	n
	3
	  # Accept defaults to use remaining space
	```

	> No special type change is required; the default Linux filesystem code is correct.

7. `w`: write changes and quit.

### Formatting partitions

1. `mkfs.fat -F32 /dev/<EFI>`.

2. `mkfs.ext4 /dev/<root>`.

3. `mkfs.ext4 /dev/<home>`.

### Mounting for installation

1. `mount /dev/<root> /mnt`.

2. `mkdir -p /mnt/boot`.

3. `mount /dev/<EFI> /mnt/boot`.

4. `mkdir /mnt/home`.

5. `mount /dev/<home> /mnt/home`.

## Optimizing mirrors

1. `cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak`.

2. `reflector --verbose --latest 10 --protocol https --sort rate --save /etc/pacman.d/mirrorlist`.

## Filesystem table

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### Bonus (filesystem table)

When a separate NTFS disk is used for general data storage, it can be incorporated as follows:

1. `mkdir /mnt/files`.

2. `pacman -S ntfs-3g`.

3. `mount /dev/<disk partition> /mnt/files`.

> After mounting, the filesystem table must be regenerated.

The following entry illustrates a typical NTFS partition configuration in `/etc/fstab`:

```
UUID=64A6257CA625503A /home/braz/files ntfs-3g auto,exec,users,uid=1000,gid=1000,noatime 0 2
```

## Base system installation

1. `pacstrap -i /mnt base base-devel linux linux-headers linux-firmware git sudo networkmanager`.

	Another kernel can be installed instead (like the Zen one) or even have more than one. This is useful if one breaks (which rarely happens). The packages for the Zen kernel are `linux-zen` and `linux-zen-headers`.

	> Depending on the configuration you have chosen (Linux, Zen, or both kernels), the settings in the "boot manager" section for systemd-boot may change.

	> Also install `network-manager-applet` if you are going to use WiFi.

2. `arch-chroot /mnt`.

3. Enable `networkmanager`: `systemctl enable NetworkManager`.

## Microcode

`pacman -S amd-ucode` for AMD processors or `intel-ucode` for Intel processors.

## Locales and console

1. Uncomment `en_US.UTF-8` in `/etc/locale.gen`, then run `locale-gen`.

2. Create `/etc/locale.conf` containing `LANG=en_US.UTF-8`.

3. Add `KEYMAP=us` in `/etc/vconsole.conf`.

## User accounts

1. `passwd`: set the root password.

2. `useradd -m -g users -G wheel <username>`.

	> In certain administrative scenarios, an account may be created without assignment to any supplementary groups (`useradd -m <username>`); however, separate configuration within `/etc/sudoers.d` is required to grant the necessary privileges.

3. `passwd <username>`.

4. `EDITOR=nvim visudo` and uncomment "%wheel ALL=(ALL) ALL".

	> When only the user account has been created, the required privileges must be granted by adding `<username> ALL=(ALL) ALL` to `sudoers.d`.

## Boot manager

### GRUB

1. `pacman -S grub efibootmgr`.

	> When the installation is performed alongside Windows, the package `os-prober` is installed as well.

2. Open the file `/etc/default/grub`, uncomment the line with "GRUB_DISABLE_OS_PROBER" and set it to "false".

	> If the installation is **not** performed alongside Windows, this step may be omitted.

3. `grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck`.

4. `grub-mkconfig -o /boot/grub/grub.cfg`.

After completing these steps, exit the chroot environment with `exit`, unmount all filesystems (`umount -a` or `umount -lR /mnt`) and reboot the system with `reboot`.

> The installation medium should be removed before the system restarts.

### systemd-boot (alternative to GRUB)

1. `bootctl install`.

2. Configure the loader.

	Edit `/boot/loader/loader.conf` and replace its content with:

	```
	default  arch.conf
	timeout  3
	console-mode max
	editor   no
	```

3. `blkid -s PARTUUID -o value <root partition>`: finding the correct PARTUUID.

	> This is important for the next step.

4. Create Arch Linux entry.

	Create `/boot/loader/entries/arch.conf`.

	> Important: determine if the system runs on an Intel or AMD processor to load the correct microcode.

	```
	title   Arch Linux
	# Uncomment the line matching your kernel:
	# linux   /vmlinuz-linux
	# linux   /vmlinuz-linux-zen
	# Uncomment the line matching your processor:
	# initrd  /intel-ucode.img
	# initrd  /amd-ucode.img
	# Uncomment the line matching your kernel:
	# initrd  /initramfs-linux.img
	# initrd  /initramfs-linux-zen.img
	options root=PARTUUID=YOUR_ROOT_PARTUUID rw
	```

	> Replace `YOUR_ROOT_PARTUUID` with the actual alphanumerical string from `blkid`.

## Minimal post installation

### Time zone

1. `timedatectl list-timezones`: list available time-zone identifiers.

	> A specific entry may be located with grep, for example: `timedatectl list-timezones | grep Bogota`.

2. `timedatectl set-timezone <time zone>`: the desired time zone is applied (e.g., `America/Bogota`).

3. `timedatectl set-ntp true`.

### Hostname

`hostnamectl set-hostname <hostname>`.

### GPU drivers

For the GPU drivers use `pacman -S nvidia nvidia-utils nvidia-settings` for Nvidia, `mesa libva-mesa-driver` for AMD (add `vulkan-radeon` if you have a modern card) or Intel of GMA 4500 up to Coffee Lake architectures, `intel-media-driver` for Intel of Broadwell and newer architectures.

> `pacman -S virtualbox-guest-utils` for VirtualBox.

### Audio stack

1. `pacman -S pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber`.

	- `pipewire`: the core PipeWire daemon (audio/video routing engine that replaces PulseAudio/JACK in modern Linux setups).

	- `pipewire-alsa`: ALSA compatibility layer so apps that output via ALSA can route audio through PipeWire.

	- `pipewire-pulse`: PulseAudio compatibility server so PulseAudio apps (most desktop apps) work transparently with PipeWire.

	- `pipewire-jack`: JACK compatibility layer so pro-audio/JACK apps can work with PipeWire without a separate JACK server.

	- `wireplumber`: the PipeWire session/policy manager (handles automatic device routing, default devices, Bluetooth profile switching, etc.).

2. `systemctl --user enable --now pipewire pipewire-pulse wireplumber`.

### Bluetooth

1. `pacman -S bluez bluez-utils blueman`.

	- `bluez`: the Linux Bluetooth protocol stack (the core system component for Bluetooth).

	- `bluez-utils`: user-space tools like `bluetoothctl` and utilities needed to manage devices/pairing.

	- `blueman`: a GTK Bluetooth manager (tray app + GUI) that makes pairing and switching devices easier.

2. `systemctl enable bluetooth.service`.

### AUR helper (yay)

1. `git clone https://aur.archlinux.org/yay-bin.git`.

2. `cd yay-bin`.

3. `makepkg -si`.

### Display manager

1. `pacman -S ly`.

2. `systemctl disable getty@tty2.service`.

3. `systemctl enable ly@tty2.service`.

> The config file is `/etc/ly/config.ini`.

## OS keyring

In a full Desktop Environment like GNOME or KDE, a "keyring" (a secure vault for passwords and credentials) is set up automatically. However, in a minimal setup (like Hyprland, Sway, or i3), this bridge is missing. Without it, applications like VS Code, Git, or web browsers will ask for your credentials every single time you open them.

We use `gnome-keyring` to act as this vault and integrate it with the login process so it unlocks automatically when you enter your system password.

1. Install the keyring and a GUI manager (`seahorse`) to inspect keys later if needed: `pacman -S gnome-keyring seahorse`.

2. Configure PAM to unlock the keyring on login. Since we are using `ly`, edit `/etc/pam.d/ly`::

	```
	#%PAM-1.0
	.
	.
	.
	# Add this line AFTER "auth include system-login"
	auth    optional pam_gnome_keyring.so
	.
	.
	.
	# Add this line at the END of the session section
	session optional pam_gnome_keyring.so auto_start
	```

3. Finally, ensure the daemon starts with your window manager: `gnome-keyring-daemon --start --components=secrets`.

A minimal Arch installation has now been completed. The subsequent task involves selecting either a desktop environment or a window manager. Installing any desktop environment should present no difficulties, because the corresponding packages include all components required for a complete user experience.

### Bonus (a few `pacman` tweaks)

A short `pacman` configuration section is also available in my [WSL Arch installation guide](https:///blog/posts/how_to_install_Arch_Linux_in_WSL.html#configure-pacman-conf), covering small quality-of-life improvements such as `ILoveCandy`, `VerbosePkgLists` and `ParallelDownloads`.

It may be a useful reference for readers who want a slightly nicer package management experience, or for those introducing Arch Linux to someone who is still not ready to commit to the full installation ritual.
