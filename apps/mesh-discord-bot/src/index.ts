import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits, Events } from "discord.js";
import { registerSlashCommands } from "./discord/registerSlashCommand";
import { askAI } from "./services/apiService";
import { splitMessages } from "./utils/splitMessages";


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})


client.once(Events.ClientReady, async () => {
    await registerSlashCommands([
        {
            name: "ask-mesh-ai",
            description: "MeshAI helps to answer user's query related to MeshJS",
            options: [{
                name: "query",
                description: "Please ask your question",
                type: 3,
                required: true
            }]
        }
    ])
});


client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === "ask-mesh-ai") {
        await interaction.deferReply();
        const question = interaction.options.getString("query");

        console.log("Before calling askAI function");
        const response = await askAI(question as string);
        console.log(response.answer);
        
        const messages = splitMessages(response.answer);
        await interaction.editReply({ content: messages[0] });
        for(let i=1; i < messages.length; i++) {
            await interaction.followUp({ content: messages[i] });
        }
    }
})

client.login(process.env.DISCORD_TOKEN);