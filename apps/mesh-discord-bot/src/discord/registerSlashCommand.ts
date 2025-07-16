import { REST, Routes } from "discord.js";
import { Command } from "../utils/types";

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN as string);
const clientId = process.env.CLIENT_ID as string;

if(!clientId) {
    throw new Error("CLIENT_ID must be defined in .env")
}

export async function registerSlashCommands(commands: Command[]) {
    try {
        const existingCommands = await rest.get(
            Routes.applicationCommands(clientId)
        );

        const commandsToRegister = [];

        for(const command of commands) {
            const match = (existingCommands as Command[]).find(c => c.name === command.name);
            if(!match || JSON.stringify(match.description) !== JSON.stringify(command.description) || JSON.stringify(match.options) !== JSON.stringify(command.options)) {
                commandsToRegister.push(command);
            }
        }

        if(commandsToRegister.length === 0) return;

        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Successfully registered command/s");
    } catch(error) {
        console.error("Error while registering the command/s: ", error);
    }
}