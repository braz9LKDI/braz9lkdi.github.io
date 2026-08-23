---
date: '2025-12-25'
title: 'Arch Linux installation'
excerpt: 'A practical, step-by-step guide to install Arch Linux from a blank drive to a clean, bootable system.'
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

#### Why does it matter for dual-boot?

If Fast startup is enabled, Windows does not fully release its hold on the hard drives at shutdown. This causes two major problems on the Linux side:

1. Read-only partitions: Linux will refuse to mount the Windows partitions with write access to prevent data corruption. Errors like "The NTFS partition is in an unsafe state" appear instead.

2. Wi-Fi/Bluetooth issues: sometimes Windows locks hardware drivers (like the Wi-Fi card) in a specific state, making them fail to initialize correctly on the subsequent boot into Linux.

#### How to disable it

1. Boot into Windows.

2. Open **Control Panel** > **Hardware and Sound** > **Power Options**.

3. Click on **"Choose what the power buttons do"**.

4. Click the shield icon that says **"Change settings that are currently unavailable"** (requires Admin rights).

5. Under "Shutdown settings", **uncheck** the box **"Turn on fast startup (recommended)"**.

6. Click **Save changes** and fully restart the computer.

### Real-time clock alignment for dual-boot systems

Linux stores the hardware clock in UTC, whereas Windows records local time. To avoid clock drift, on Windows:

1. Create `RealTimeIsUniversal` as a 32-bit `DWORD` with a value of 1 under `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation`.

### SSH setup (remote installation)

Configuring OpenSSH in the live environment permits the entire installation to be driven from another computer via a secure shell.

1. `systemctl status sshd`.

    > If the process is not running, run it with `systemctl start sshd`.

2. `passwd`: set the root password.

3. `ip addr show`: identify the installer's IP address.

4. Run `ssh root@<installer-ip>` from the other device.

### Console legibility

Setting a larger console font with `setfont ter-132n` improves readability on Full-HD displays; select a smaller size on lower-resolution panels.

### UEFI verification

Presence of entries in `/sys/firmware/efi/efivars/` confirms a UEFI boot.

### Keyboard layout

1. List available layouts: `localectl list-keymaps`.

2. Filter with `grep`, e.g. `localectl list-keymaps | grep la-latin1`.

3. Load the layout: `loadkeys <layout>`.

## Networking

A wired connection simplifies installation.

### Detecting interfaces

`ip addr show` lists active interfaces.

### Wi-Fi connection (`iwd`)

1. Launch the "iwd" shell: `iwctl`.

2. Confirm the adapter appears with `device list`; troubleshoot via the [Arch Wiki](https://wiki.archlinux.org/title/iwd) if absent.

3. Scan and enumerate networks.

    ```text
    station <device> scan
    station <device> get-networks
    station <device> connect "<SSID>"
    ```

    > Alternatively, without entering the shell `iwctl --passphrase <passphrase> station <device> connect <SSID>`.

## Disk partitioning

### Target layout

| partition | suggested size  |   filesystem    | purpose                                                |
| :-------: | :-------------: | :-------------: | :----------------------------------------------------- |
|  `/boot`  |     500 MiB     |      FAT32      | holds bootloaders and NVRAM entries for UEFI firmware. |
|  `root`   |     50 GiB      |      ext4       | operating system files.                                |
|  `/home`  | remaining space | ext4 (optional) | user data.                                             |

### Creating partitions with `fdisk`

1. `fdisk -l`: list all disks.

2. `fdisk /dev/<device>`.

3. `g`: initialize a GPT table.

4. Create the `EFI`.

    ```text
    n       # New partition
    1       # Partition number
    <ENTER> # Accept default first sector
    +500M
    t       # Change type
    1       # 1 = EFI system
    ```

5. Create the root.

    ```text
    n
    2
         # Accept default first sector
    +50G # Size
    ```

6. Create the home.

    ```text
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

## Base system installation

1. `pacstrap -i /mnt base base-devel linux linux-headers linux-firmware git sudo networkmanager neovim`.

    Another kernel can be installed instead (like the Zen one) or even have more than one. This is useful if one breaks (which rarely happens). The packages for the Zen kernel are `linux-zen` and `linux-zen-headers`.

    > Depending on the configuration chosen (Linux, Zen, or both kernels), the settings in the "boot manager" section for systemd-boot may change.

    > Also install `network-manager-applet` if Wi-Fi will be used.

2. `genfstab -U /mnt >> /mnt/etc/fstab`.

3. `arch-chroot /mnt`.

4. Enable `networkmanager`: `systemctl enable NetworkManager`.

### Bonus (NTFS disk setup)

When a separate NTFS disk is used for general data storage, it can be incorporated as follows:

1. `mkdir /mnt/files`.

2. `pacman -S ntfs-3g`.

3. `mount /dev/<disk-partition> /mnt/files`.

> After mounting, the filesystem table must be regenerated.

The following entry illustrates a typical NTFS partition configuration in `/etc/fstab`:

```text
UUID=64A6257CA625503A /mnt/files ntfs-3g auto,exec,users,uid=1000,gid=1000,noatime 0 2
```

## Microcode

- AMD: `pacman -S amd-ucode`.

- Intel: `pacman -S intel-ucode`.

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

    > When only the user account has been created, the required privileges must be granted by adding `<username> ALL=(ALL) ALL` to `/etc/sudoers.d`.

## Boot manager

### GRUB

1. `pacman -S grub efibootmgr`.

    > When the installation is performed alongside Windows, the package `os-prober` is needed as well.

2. Open the file `/etc/default/grub`, uncomment the line with "GRUB_DISABLE_OS_PROBER" and make sure it is set to "false".

    > If the installation is **not** performed alongside Windows, this step may be omitted.

3. `grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=grub_uefi --recheck`.

4. `grub-mkconfig -o /boot/grub/grub.cfg`.

After completing these steps, exit the chroot environment with `exit`, unmount all filesystems (`umount -R /mnt`) and reboot the system with `reboot`.

> The installation medium should be removed before the system restarts.

### systemd-boot (alternative to GRUB)

1. `bootctl install`.

2. Configure the loader.

    Edit `/boot/loader/loader.conf` and replace its content with:

    ```ini
    default  arch.conf
    timeout  3
    console-mode max
    editor   no
    ```

3. `blkid -s PARTUUID -o value <root-partition>`: find the correct PARTUUID.

    > This is important for the next step.

4. Create an Arch Linux entry.

    Create `/boot/loader/entries/arch.conf`.

    > Important: determine whether the system runs on an Intel or AMD processor to load the correct microcode.

    ```ini
    title   Arch Linux
    # Uncomment the line matching the installed kernel:
    # linux   /vmlinuz-linux
    # linux   /vmlinuz-linux-zen
    # Uncomment the line matching the processor:
    # initrd  /intel-ucode.img
    # initrd  /amd-ucode.img
    # Uncomment the line matching the installed kernel:
    # initrd  /initramfs-linux.img
    # initrd  /initramfs-linux-zen.img
    options root=PARTUUID=<root-partuuid> rw
    ```

    > Replace _root-partuuid_ with the actual alphanumeric string from `blkid`.

## Minimal post installation

### Time zone

1. `timedatectl list-timezones`: list available time-zone identifiers.

    > A specific entry may be located with grep, for example: `timedatectl list-timezones | grep Bogota`.

2. `timedatectl set-timezone <time-zone>`: the desired time zone is applied (e.g., `America/Bogota`).

3. `timedatectl set-ntp true`.

### Hostname

`hostnamectl set-hostname <hostname>`.

### GPU drivers

Graphics drivers come first; hardware video acceleration is a separate package on top.

- AMD: `pacman -S mesa vulkan-radeon`.

- Intel: `pacman -S mesa vulkan-intel`.

- Nvidia: `pacman -S nvidia-open nvidia-utils`.

    > `nvidia-open` targets the `linux` kernel. For `linux-zen` or any other kernel, install `nvidia-open-dkms` instead.

    > The open modules require a Turing card (GTX 16xx / RTX 20xx) or newer. Older cards need the legacy `nvidia-580xx-dkms` and `nvidia-580xx-utils` packages from the AUR, or the nouveau driver (`mesa vulkan-nouveau`).

For hardware video acceleration, AMD needs nothing further, as `mesa` provides it. On Intel, install `intel-media-driver` for Broadwell and newer, or `libva-intel-driver` for the G45 through Coffee Lake generations.

> `pacman -S virtualbox-guest-utils` for VirtualBox.

### Audio stack

1. `pacman -S pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber`.
    - `pipewire`: the core PipeWire daemon (audio/video routing engine that replaces PulseAudio/JACK in modern Linux setups).

    - `pipewire-alsa`: ALSA compatibility layer so apps that output via ALSA can route audio through PipeWire.

    - `pipewire-pulse`: PulseAudio compatibility server so PulseAudio apps (most desktop apps) work transparently with PipeWire.

    - `pipewire-jack`: JACK compatibility layer so pro-audio/JACK apps can work with PipeWire without a separate JACK server.

    - `wireplumber`: the PipeWire session/policy manager (handles automatic device routing, default devices, Bluetooth profile switching, etc.).

2. `systemctl --global enable pipewire pipewire-pulse wireplumber`.

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

    > `makepkg` refuses to run as root, so this step belongs to the regular user account after rebooting.

### Display manager

1. `pacman -S ly`.

2. `systemctl disable getty@tty2.service`.

3. `systemctl enable ly@tty2.service`.

> The config file is `/etc/ly/config.ini`.

## OS keyring

In a full desktop environment like GNOME or KDE, a "keyring" (a secure vault for passwords and credentials) is set up automatically. However, in a minimal setup (like Hyprland, Sway, or i3), this bridge is missing. Without it, applications like VS Code, Git, or web browsers ask for credentials every single time they are opened.

`gnome-keyring` acts as this vault and integrates with the login process, so it unlocks automatically once the system password is entered.

1. Install the keyring and a GUI manager (`seahorse`) to inspect keys later if needed: `pacman -S gnome-keyring seahorse`.

2. Configure PAM to unlock the keyring on login. Since `ly` is the display manager here, edit `/etc/pam.d/ly`:

    ```text
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

3. Finally, ensure the daemon starts with the window manager: `gnome-keyring-daemon --start --components=secrets`.

A minimal Arch installation has now been completed. The subsequent task involves selecting either a desktop environment or a window manager. Installing any desktop environment should present no difficulties, because the corresponding packages include all components required for a complete user experience.

### Bonus (a few `pacman` tweaks)

A short `pacman` configuration section is also available in my [WSL Arch installation guide](https://braz9lkdi.github.io/blog/posts/how_to_install_Arch_Linux_in_WSL.html#configure-pacman-conf), covering small quality-of-life improvements such as `ILoveCandy`, `VerbosePkgLists` and `ParallelDownloads`.

It may be a useful reference for readers who want a slightly nicer package management experience, or for those introducing Arch Linux to someone who is still not ready to commit to the full installation ritual.
