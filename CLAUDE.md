# CLAUDE.md

## Workflow

- **Almost always get the plan validated before you start coding.** Before you create, edit or delete any file, present a short plan: what you will change, which files you will touch, and the approach you will take. Then wait for my explicit approval. Do not write any code until I have validated the plan.
- If the plan has to change a lot while you are implementing it, stop and ask me to validate the new plan before you go on.
- You don't need to validate review changes since you've already presented the plan in the review report.
- You don't need to validate the plan when it's minor changes I asked for.
- Reading files, searching the codebase and running read-only commands to build the plan is fine without asking.
- **Always review your code before saying it's done**, look for duplicated code or components and make sure files and directories are named following the existing convention.
- **Always make you code as simple as possible, as long as it respects the best practices and existing infrastructure**
- **Match the solution to the size of the problem.** A small visual adjustment (spacing, alignment, a few pixels) gets a small CSS change: a padding, a margin or a height. No measurement scripts, no values computed from font metrics, no Sass variables or extra wrappers created just for it.
- **Prefer plain values I can adjust by eye** (e.g. `padding-top: 2px`) over calculated ones, unless the value really needs to adapt to something.
- **If a fix needs a long comment to justify it, look for a simpler one first.**
- **For pixel-level tweaks, propose the simple change and let me check it in the browser**, instead of trying to prove it is exact.
- **If I'm asking for design updates, please ask before creating an artefact**. Sometimes it's ok to edit code directly in the page, and even to duplicate a block to allow for several suggestions. Just ask what I prefer.
