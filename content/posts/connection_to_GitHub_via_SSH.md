---
date: "2025-06-11"
title: "Connection to GitHub via SSH"
excerpt: "How to generate an SSH key, add it to GitHub, and test authentication for secure repository access."
tags:
  - git
  - github
  - ssh
  - version-control
---

# Connection to GitHub via SSH

1. Generate a key.

	```bash
	ssh-keygen
	```

	> `ssh-keygen` is a utility from the "openssh" package; if the command is not found, the package is likely not installed.

	> By default, the RSA algorithm is used.

	> It is recommended to include a comment with the associated email address for easy identification.

	Running this command prompts for the save location (default: `/home/<user>/.ssh/`) and for a passphrase (serving as the key's password).

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

	2. At the prompt "Are you sure you want to continue connecting (yes/no)?", write "yes".

	A successful setup will display: "Hi USERNAME! You've successfully authenticated, but GitHub does not provide shell access".

	> If this message does not appear, the key has not been added correctly.

	> Entering the passphrase will be required for each repository interaction.
