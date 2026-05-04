---
date: "2025-06-11"
title: "Compile and run C++ programs"
excerpt: "Guide to compile and run C++ programs on Windows and Linux using GCC and other tools."
tags:
    - c++
    - programming
    - compilers
---

# Compile and run C++ programs

## Compilador

Both Windows and Linux environments will utilize the GCC compilers provided by the GNU Compiler Collection; the source differs by platform.

- Windows.

    The development kit [**w64devkit**](https://github.com/skeeto/w64devkit/releases) (via MinGW-w64) is employed.

    > Download the ZIP file named `w64devkit-<version>.zip`.

- Linux.

    Most distributions include GCC by default. If unavailable, install the "gcc" package using the system's package manager.

## Setup on Windows

After downloading and extracting **w64devkit**, add its binaries to the system PATH:

> Avoid moving or deleting files once this configuration is complete.

1. Open "Edit the system environment variables".

2. Append the `bin` directory of w64devkit (e.g., `C:\...\w64devkit\bin`) to the Path variable.

> Alternatively, you could run `setx /m PATH "...\w64devkit\bin;%PATH%"`.

## Running programs

The **Code Runner** extension for VS Code is recommended. Configuration entries in the `settings.json` file follow.

> For non-VS Code environments, equivalent shell commands are provided.

### Windows

#### Single file (Windows)

```json
"code-runner.executorMap": {
        "cpp": "echo Executing... && cd $dir && g++ \"$fileName\" -o main && .\\main.exe && rm .\\main.exe"
    }
```

- `echo Executing...`: displays a status message.

- `cd $dir`: navigates to the file's directory.

- `g++ \"$fileName\" -o main`: compiles into an executable named "main".

- `.\\main.exe` runs the executable.

- `rm .\\main.exe` removes the executable.

#### Multiple files (Windows)

```json
"code-runner.customCommand": "echo Executing... && cd $dir && g++ (Get-ChildItem -recurse *.cpp) -o main && .\\main.exe && rm .\\main.exe"
```

Recursively gathers all `.cpp` via `Get-ChildItem -recurse *.cpp` before compilation. Projects should reside in dedicated folders without spaces in their names to avoid execution errors.

### Linux

Shell commands differ due to path conventions and absence of PowerShell's `Get-ChildItem`.

#### Single file (Linux)

```bash
g++ main.cpp -o main && ./main && rm ./main
```

Replace `main.cpp` with the actual source filename if different.

#### Multiple files (Linux)

```bash
find . -name "*.cpp" -type f -print0 | xargs -0 g++ -o main && ./main && rm ./main
```

> For large and complex projects, [**CMake**](https://cmake.org) remains the recommended build system.

## Bonus

A PowerShell function to automate this can be found in this [repository](https://github.com/braz9LKDI/gray_files/blob/main/PowerShell/utilities.ps1).
