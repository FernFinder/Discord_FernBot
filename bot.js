import { Client, GatewayIntentBits } from 'discord.js';
import { OpenAI } from 'openai';

const TOKEN = process.env['token']

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'whoareyou') {
    await interaction.reply('I\'m you but stronger.');
  } else if (interaction.commandName === 'wherearethebaddies') {
    await interaction.reply('You\'re looking at one.');
  }
});

const IGNORE_PREFIX = "!";
const CHANNELS = ['1161857326521778198'];

const openAI = new OpenAI({
  apiKey: process.env['openai']
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(IGNORE_PREFIX)) return;
  if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;
  
  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 5000);

  let conversation = [];
  
  conversation.push({
    role: 'system',
    content: 'You are a friendly chatbot.',
  });

  let prevMessages = await message.channel.messages.fetch({ limit: 10 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
    if (msg.author.bot && msg.author.id !== client.user.id) return;
    if (msg.content.startsWith(IGNORE_PREFIX)) return;
  
    const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    
    if (msg.author.id === client.user.id) {
      conversation.push({
        role: 'assistant',
        name: username,
        content: msg.content,
      });
  
      return;
    }

    conversation.push({
      role: 'user',
      name: username,
      content: msg.content,
    });
})
  
  
  const response = await openAI.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    })
    .catch((error) => console.error('OpenAI Error:\n', error));

  clearInterval(sendTypingInterval);

  if(!response){
    message.reply("I'm having trouble with OpenAI API, try again in a bit.")
    return;
  }

  const responseMessage = response.choices[0].message.content;
  const chunkSizeLimit = 2000;

  for(let i = 0; i < responseMessage.length; i += chunkSizeLimit){
      const chunk = responseMessage.substring(i, i + chunkSizeLimit)

      await message.reply(chunk);
  }

});

client.login(TOKEN);