import { defineCommand, runMain } from "citty";
import { fetchCommand } from "./commands/fetch";
import { listCommand } from "./commands/list";

const main = defineCommand({
  meta: {
    name: "blueprint-cli",
    version: "1.0.0",
    description: "Modular Developer-AI Process Blueprint CLI Demonstration",
  },
  subCommands: {
    fetch: fetchCommand,
    list: listCommand,
  },
});

runMain(main);
