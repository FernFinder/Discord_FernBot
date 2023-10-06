import { Client, GatewayIntentBits } from 'discord.js';

const TOKEN = process.env['token']

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'whoareyou') {
    await interaction.reply('I\'m you but stronger.');
  }else if(interaction.commandName === 'wherearethebaddies') {
    await interaction.reply('You\'re looking at one.');
  }
});

client.login(TOKEN);