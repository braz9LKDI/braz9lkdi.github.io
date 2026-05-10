---
date: "2026-04-21"
title: "How to run C# projects in Visual Studio Code"
excerpt: "How to open, build and run many C# projects in VS Code using the .NET SDK and C# Dev Kit, with practical expectations for larger solutions."
tags:
    - csharp
    - dotnet
    - vscode
---

# how to run C# projects in Visual Studio Code

Most C# projects that tend to be found in the wild are created with Visual Studio in mind. Even so, many of them can still be opened, built and run from Visual Studio Code without much drama.

The basic setup is small:

1. Install the [.NET SDK](https://dotnet.microsoft.com/en-us/download).

    > In Arch Linux, the package is `dotnet-sdk`.

2. Install the ["C# Dev Kit" VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit).

Once that is done, a solution or project can usually be opened in VS Code and handled from there. The extension provides the comfortable point-and-click route, while the .NET CLI remains available for anyone who prefers the terminal and a little self-inflicted configuration.

## Disclaimer

For small or straightforward applications, VS Code usually gets the job done. Editing is fast, the .NET CLI is reliable and the extension tooling covers the common workflow well enough.

As solutions grow, things tend to get less charming. More projects, more dependencies, more build steps and more debugging profiles usually mean more configuration. At that point, full Visual Studio can stop feeling excessive and start feeling practical. Sometimes the famous bloat is not a flaw, but the exact amount of machinery a complicated solution expects.

## More dotnet notes

The VS Code side is the interesting part for this post, but the .NET CLI details deserve their own place. Notes for project creation, solutions, references, restore, build, run, test, publish and package management live in my [Obsidian vault](https://github.com/braz9LKDI/gray_vault/blob/main/01-areas/systems_engineering/programming_languages/C_sharp/dotnet_cli.md) along with more information about C#.
