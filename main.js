const {Client, GatewayIntentBits} = require("discord.js")
const Notion = require("@notionhq/client")

const notion = new Notion.Client({auth: process.env.NOTION_KEY})
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
const NOTION_DATABASE_ID = process.env.NOTION_DB

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on("messageCreate", async message => {
    if (message.author.bot) return
    console.log(message)
    if(message.content === "!notion") {
        const url = await addItem(message.channel.name)
        if(url) {
            message.channel.send("Notionのページを作成しました！ \n" + url)
        } else {
            message.channel.send("Notionのページを作成できませんでした。")
        }
    }
})

client.on("channelCreate", async (channel) => {
    if (channel.type === 0) {
        console.log("Text Channel Created.", channel.name)
        const url = await addItem(channel.name)
        if(url) {
            channel.send("Notionのページを作成しました！ \n" + url)
        } else {
            channel.send("Notionのページを作成できませんでした。")
        }
    }
})


const addItem = async (text) => {
    try {
        const response = await notion.pages.create({
            parent: {database_id: NOTION_DATABASE_ID},
            properties: {
                title: {
                    title: [{"text": {"content": text}}]
                }
            },
        })
        return response.url
    } catch (error) {
        console.error(error.body)
        return null
    }
}

client.login(process.env.DISCORD_TOKEN);
