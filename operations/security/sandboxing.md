# Sandboxing generated execution

A sandbox restricts what executed code can access and consume. For agents, the relevant capabilities include filesystem reads and writes, network destinations, subprocesses, credentials, CPU, memory, execution time, and persistence between runs.

Choose isolation according to the workload and threat model. A container, operating-system sandbox, virtual machine, and remote execution service have different boundaries. [Docker's security documentation](https://docs.docker.com/engine/security/) explains why namespaces, capabilities, daemon access, and host configuration matter; a container label alone does not describe the complete isolation policy.

For a code-review task, mount only the intended repository, provide a temporary writable workspace, restrict outbound access to required services, and avoid mounting host credential stores or the container-management socket. Bound compute and artifact sizes so a mistaken program cannot consume unlimited resources.

Generated code can be syntactically valid and still execute unwanted behavior. Apply controls at execution, not only at generation. Review artifact handling too: a result file can contain unsafe markup or private data even if the process stayed inside the sandbox.

Keep provider data retention separate from execution isolation. A tightly restricted runtime does not determine where prompts or traces are stored. Record cleanup and persistence rules, and test representative escape boundaries, secret access, network restrictions, and resource limits appropriate to the deployed platform.
