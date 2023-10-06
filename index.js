import { REST, Routes } from 'discord.js';

const TOKEN = process.env['token']
const CLIENT_ID = process.env['client_id']
const GUILD_ID = process.env['guild_id']

const commands = [
  {
    name: 'whoareyou',
    description: 'Replies with I\'m you but stronger.',
  },
  {
    name: 'wherearethebaddies',
    description: 'Find out where the baddies are',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}