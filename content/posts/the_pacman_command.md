---
date: "2025-08-31"
title: "The pacman command"
excerpt: "A concise guide to using the `pacman` package manager on Arch Linux: refreshing databases, searching packages, managing installed software and keeping the system tidy without summoning dependency chaos"
tags:
  - linux
  - arch-linux
  - pacman
  - package-manager
sources:
  - author: Learn Linux TV
    url: https://www.youtube.com/watch?v=HD7jJEh4ZaM
    language: English
---

# The pacman command

`pacman` is the package manager used by Arch Linux and its derivatives. It is responsible for installing, upgrading, querying and removing packages, as well as maintaining the local package database.

The syntax may look terse at first glance, but that is part of the charm. Or the threat.

## Refreshing the Package Database

The package database can be refreshed with the following command:

```bash
pacman -Sy
```

- `S`: sync operations with the package repositories.

- `y`: refresh the package databases.

A forced refresh can be performed with:

```bash
pacman -Syy
```

- The second `y` forces all package databases to be downloaded again, even if they appear to be up to date.

> A forced refresh is not usually required. It is generally reserved for cases in which the local database is suspected to be stale or inconsistent.

> Refreshing the database without performing a full upgrade should not become a habit. On Arch Linux, partial upgrades are unsupported.

## The mirror list

When `pacman` performs an operation that requires synchronization, such as installing or upgrading packages, it contacts the servers listed in:

```bash
/etc/pacman.d/mirrorlist
```

These servers are tried from top to bottom.

If downloads are unusually slow, the mirror list should be regenerated or reordered so that faster and more reliable mirrors are placed near the top.

## Managing packages

### Installing packages

A package can be installed with:

```bash
pacman -S <package_name>
```

- `S`: sync and install a package from the repositories.

Any required dependencies are resolved and installed automatically. Multiple packages may be installed in a single command by separating their names with spaces.

### Installing a local package file

A local package file can be installed with:

```bash
pacman -U <package_file>
```

- `U`: upgrade or install a local package file.

This is commonly used for manually downloaded package archives.

### Removing packages

A package can be removed with:

```bash
pacman -R <package_name>
```

- `R`: remove a package.

A package and its unused dependencies can be removed with:

```bash
pacman -Rs <package_name>
```

A more thorough removal, including configuration files and dependencies no longer required, can be performed with:

```bash
pacman -Rns <package_name>
```

- `n`: remove backup configuration files.

- `s`: remove dependencies that are no longer needed.

> `pacman -Rns` is often the practical choice when a package is no longer wanted at all.

## Searching for packages

### Searching the repositories

If the exact package name is not known, the repositories can be searched with:

```bash
pacman -Ss <keyword>
```

- `S`: search in sync databases.

- `s`: perform a search.

This searches remote repositories, not just locally installed packages.

### Searching installed packages

Installed packages can be searched with:

```bash
pacman -Qs <keyword>
```

- `Q`: query the local package database.

- `s`: search installed packages.

This is useful when only the installed software should be searched.

### Checking whether a package is installed

To check whether a specific package is installed:

```bash
pacman -Q <package_name>
```

If the package is installed, its name and version are shown.

## Querying package information

### Viewing information about an installed package

Detailed information about an installed package can be displayed with:

```bash
pacman -Qi <package_name>
```

- `i`: show package information.

### Viewing information about a package in the repositories

Information about a package available in the repositories can be displayed with:

```bash
pacman -Si <package_name>
```

This is useful when a package has not yet been installed.

### Listing files installed by a package

The files installed by a package can be listed with:

```bash
pacman -Ql <package_name>
```

- `l`: list files owned by the package.

### Finding which package owns a file

To determine which installed package owns a file:

```bash
pacman -Qo <file_path>
```

Example:

```bash
pacman -Qo /usr/bin/git
```

This is especially handy when a mysterious binary appears and its origin needs to be identified.

## System maintenance

### Performing a full system upgrade

A full system upgrade can be performed with:

```bash
pacman -Syu
```

- `S`: sync with repositories.

- `y`: refresh package databases.

- `u`: upgrade all out-of-date packages.

This command synchronizes the package databases and upgrades all packages for which newer versions are available.

> On Arch Linux, this is the standard way to update the system. A full upgrade is preferred over selective upgrades.

### Downloading packages without installing them

Packages can be downloaded into the cache without being installed:

```bash
pacman -Sw <package_name>
```

- `w`: download packages but do not install them.

### Finding orphan packages

Orphan packages are dependencies that were installed automatically but are no longer required by any installed package.

They can be listed with:

```bash
pacman -Qdt
```

- `Q`: query the local package database.

- `d`: limit results to dependencies.

- `t`: limit results to packages no longer required.

These packages can be removed with:

```bash
pacman -Rns $(pacman -Qdtq)
```

- `q`: show only package names.

> A quick review before removal is wise. Not every orphan is truly unloved.

### Cleaning the package cache

Old cached package files can accumulate over time. The cache can be cleaned with:

```bash
pacman -Sc
```

- `c`: remove cached packages that are no longer installed and old package versions that are no longer needed.

A more aggressive cleanup can be performed with:

```bash
pacman -Scc
```

This removes all cached package files.

> `pacman -Scc` is effective, but it also removes the safety net of locally cached packages. In other words, it is tidy and slightly dramatic.

## Summary

The most commonly used `pacman` operations include:

- `pacman -S <package>`: install a package.

- `pacman -U <file>`: install a local package file.

- `pacman -Rns <package>`: remove a package with unused dependencies and configuration files.

- `pacman -Ss <keyword>`: search repositories.

- `pacman -Qs <keyword>`: search installed packages.

- `pacman -Q <package>`: check whether a package is installed.

- `pacman -Qi <package>`: show information about an installed package.

- `pacman -Ql <package>`: list files installed by a package.

- `pacman -Qo <file>`: find which package owns a file.

- `pacman -Syu`: perform a full system upgrade.

- `pacman -Qdt`: list orphan packages.

- `pacman -Sc`: clean the package cache.


Used carefully, `pacman` is fast, predictable and refreshingly honest. When it complains, it is usually doing so for a reason.
