# Prompts: integrate a test case

Copy one block into Cursor Agent chat. Replace `{…}` placeholders, or use the **Filled example** in each file.

| File | When to use |
|------|-------------|
| [01-detailed-spec.md](./01-detailed-spec.md) | You already know steps, data, and assertions (locators optional). |
| [02-plan-then-build.md](./02-plan-then-build.md) | Agent explores with **browser MCP**, writes a **plan only**; you approve; then it implements. |
| [03-mcp-explore-and-integrate.md](./03-mcp-explore-and-integrate.md) | Agent explores with MCP, short plan, then **implements in one pass**. |

Agent skill: `.cursor/skills/integrate-test-case/SKILL.md`

## Prerequisites for prompts 2 and 3

Enable a **browser MCP** in Cursor (Playwright or equivalent navigate/snapshot tools). Without it, the agent should stop (prompt 2) or fall back to existing POMs (prompt 3) and say MCP was unavailable.

## Quick tip

Open the prompt file → scroll to **Filled example** → copy the fenced block → tweak → paste into Agent.
