---
date: '2025-06-11'
title: 'Connection to GitHub via SSH'
excerpt: 'How to generate an SSH key, add it to GitHub and test authentication for secure repository access.'
tags:
    - git
    - github
    - ssh
    - version-control
---

# Connection to GitHub via SSH

1. Generate a key.

    ```bash
    ssh-keygen -t ed25519 -C <your-email>
    ```

    > `ssh-keygen` is a utility from the "openssh" package; if the command is not found, the package is likely not installed.

    > `ed25519` is specified in preference to the default RSA algorithm; the keys are shorter, faster to verify and considered at least as secure.

    > The `-C` flag attaches a comment to the public key. An email address is the conventional choice, as it makes the key easy to identify later.

    Running this command prompts for the save location (default: `/home/<username>/.ssh/id_ed25519`) and for a passphrase (serving as the key's password).

    > The passphrase will be required later.

    Upon completion, two files will be created: the private key (no extension) and the public key (`.pub`).

2. Add the key to GitHub.
    1. Navigate to Settings.

    2. Select SSH and GPG keys.

    3. Click New SSH key:
        1. Enter a descriptive title.

        2. Choose "Authentication key" as the type.

        3. Paste the contents of the `.pub` into the "Key" field.

    4. Add SSH key.

3. Test the connection.
    1. `ssh -T git@github.com`.

    2. At the prompt "Are you sure you want to continue connecting (yes/no/[fingerprint])?", write "yes".

    A successful setup will display: "Hi USERNAME! You've successfully authenticated, but GitHub does not provide shell access".

    > If this message does not appear, the usual causes are a public key that was not pasted in full, the wrong key type selected on GitHub, or overly permissive permissions on `~/.ssh` and its contents.

4. Load the key into the agent.

    Without an agent, the passphrase is requested on every repository interaction. `ssh-agent` holds the decrypted key in memory so that it is entered only once:

    ```bash
    eval "$(ssh-agent -s)"
    ssh-add ~/.ssh/id_ed25519
    ```

    > The agent does not survive a reboot. Adding both commands to the shell's startup file, or enabling a user service, avoids repeating them manually.

5. Point repositories at SSH.

    Generating a key does not change how existing repositories communicate with GitHub: a repository cloned over HTTPS continues to use HTTPS, passphrase or not. The remote must be updated explicitly:

    ```bash
    git remote set-url origin git@github.com:<username>/<repository>.git
    ```

    New repositories can be cloned over SSH from the start:

    ```bash
    git clone git@github.com:<username>/<repository>.git
    ```

    > `git remote -v` displays the URLs currently in use, which is the quickest way to confirm the change.
