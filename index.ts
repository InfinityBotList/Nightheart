import fastify from 'fastify'
import { registerFont } from 'canvas'
import { Canvas, loadImage } from 'canvas-constructor/cairo';

registerFont('static/Montserrat-Bold.ttf', { 
    family: 'montserrat', 
    weight: 'bold'
})

interface User {
    id: string
    username: string
    disc: string
    avatar: string
    status: string
}

interface TeamOwner {
    id: string
    name: string
    avatar: string
}

interface PartialBotObject {
    user: User
    owner?: User
    team_owner?: TeamOwner
    servers: number
    shards: number
    votes: number
    short: string
    type: string
    library: string
}

type Size = "large" | "small"

function formatNumbers(n: number): string {
    if (n < 1e3) return n.toString()
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
    return n.toString()
}

function getOwner(botObj: PartialBotObject): User {
    if (botObj.owner) return botObj.owner
    if (botObj.team_owner) {
        return {
            id: botObj.team_owner.id,
            username: botObj.team_owner.name,
            disc: '0000',
            avatar: botObj.team_owner.avatar,
            status: "online"
        }
    }

    throw new Error('No owner found')
}

interface KV {
    [key: string]: string
}

const themes: KV = {
	"violet": "#8b5cec",
	"blue": "#3b82f6",
	"rose": "#ef4444",
	"amber": "#f59e0b",
	"emerald": "#10b981",
	"summer": "#e35335",
	"default": "#472782"
}

const bgs: KV = {
	"dark": "#000000",
	"light": "#16151d",
	"default": "#271B41"
}

// Server code
const app = fastify({
    logger: true,
    ignoreTrailingSlash: true,
    keepAliveTimeout: 5
})

const paths = ['/bot/:id', '/bots/:id']

paths.forEach(url => {
    app.get<
        { 
            Params: { id: string },
            Querystring: { theme?: string, accent?: string, size?: Size }
        }
    >(url, async (req, reply) => {
        let theme = themes["default"];
        let bg = bgs["default"];
        if(req.query.accent && themes[req.query.accent]) {
            theme = themes[req.query.accent];
        }
        if(req.query.theme && bgs[req.query.theme]) {
            bg = bgs[req.query.theme];
        }

        // Fetch bot
        let spider = await fetch(`https://spider.infinitybots.gg/bots/${req.params.id}`);
        
        if(!spider.ok) {
            let json = await spider.json()
            reply.code(spider.status).send(json)
            return
        }    

        let bot: PartialBotObject = await spider.json()

        let bot_avatar = decodeURIComponent(bot.user.avatar)
        .replace('.png', '.png?size=512')
        .replace('.webp', '.png?size=512');

        let avatar = await loadImage(bot_avatar);
        let icon = await loadImage('https://cdn.infinitybots.xyz/images/core/InfinityNewTrans.png');

        let image: Canvas;

        if(!req.query.size || (req.query.size != "large" && req.query.size != "small")) {
            image = new Canvas(400, 180)
            .setColor(bg)
            .printRoundedRectangle(0, 0, 400, 180, 10)
            .setTextAlign('left')
            .setTextFont('28px montserrat')
            .setColor(theme)
            .printRoundedRectangle(0, 155, 400, 25, 5)
            .printRoundedRectangle(0, 0, 400, 40, 10)
            .printRoundedRectangle(10, 120, 185, 25, 10)
            .printRoundedRectangle(207, 120, 185, 25, 10)
            .printRoundedRectangle(10, 90, 185, 25, 10)
            .printRoundedRectangle(207, 90, 185, 25, 10)
            .setColor('#fff')
            .setTextSize(12)
            .printText('Infinity Bot List', 30, 170)
            .printText('infinitybots.gg', 300, 170)
            .setTextSize(15)
            .printText(
            `${bot.servers === 0 ? 'N/A' : formatNumbers(bot.servers)} SERVERS`,
            20,
            137,
            )
            .printText(
            `${bot.shards === 0 ? 'N/A' : formatNumbers(bot.shards)} SHARDS`,
            217,
            137,
            )
            .printText(`${bot.user.status.toUpperCase()}`, 20, 107)
            .printText(
            `${bot.votes === 0 ? 0 : formatNumbers(bot.votes)} VOTES`,
            217,
            107,
            )
            .setTextSize(17)
            .printWrappedText(
            bot.short.length > 42 ? bot.short.slice(0, 42) + '...' : bot.short,
            20,
            60,
            350,
            //15,
            )
            .setTextSize(20)
            .printText(bot.user.username.length > 25 ? bot.user.username.slice(0, 25) + '...' : bot.user.username,40,25,)
            .printCircularImage(avatar, 20, 20, 15)
            .printCircularImage(icon, 20, 167, 10)
            .setTextFont('10px montserrat').printText(bot.type.toUpperCase() + " BOT", 310, 20);
        } else {
            switch (req.query.size) {
                case "large":
                    let botOwner = getOwner(bot)

                    image = new Canvas(400, 240)
                    .setColor(bg)
                    .printRoundedRectangle(0, 0, 400, 240, 10)
                    .setTextAlign('left')
                    .setTextFont('28px montserrat')
                    .setColor(theme)
                    .printRoundedRectangle(0, 215, 400, 25, 5)
                    .printRoundedRectangle(0, 0, 400, 40, 10)
                    .printRoundedRectangle(10, 180, 185, 25, 10)
                    .printRoundedRectangle(207, 180, 185, 25, 10)
                    .printRoundedRectangle(10, 150, 185, 25, 10)
                    .printRoundedRectangle(207, 150, 185, 25, 10)
                    .printRoundedRectangle(10, 120, 185, 25, 10)
                    .printRoundedRectangle(207, 120, 185, 25, 10)
                    .setColor('#fff')
                    .setTextSize(12)
                    .printText('Infinity Bot List', 30, 230)
                    .printText('infinitybots.gg', 300, 230)
                    .setTextSize(15)
                    .printText(
                    `${bot.servers === 0 ? 'N/A' : formatNumbers(bot.servers)} SERVERS`,
                    20,
                    197,
                    )
                    .printText(
                    `${bot.shards === 0 ? 'N/A' : formatNumbers(bot.shards)} SHARDS`,
                    217,
                    197,
                    )
                    .printText(`${bot.user.status.toUpperCase()}`, 20, 167)
                    .printText(
                    `${bot.votes === 0 ? 0 : formatNumbers(bot.votes)} VOTES`,
                    217,
                    167,
                    )
                    .printText(`${botOwner.username.length > 12 ? botOwner.username.slice(0, 12) + '...' : botOwner.username}#${botOwner.disc}`,20,137,)
                    .printText(`${bot.library}`, 217, 137)
                    .setTextSize(17)
                    .printWrappedText(bot.short.length > 75 ? bot.short.slice(0, 75) + '...' : bot.short, 20, 60, 350)
                    .setTextSize(20)
                    .printText(bot.user.username.length > 25 ? bot.user.username.slice(0, 25) + '...' : bot.user.username,40,25,)
                    .printCircularImage(avatar, 20, 20, 15)
                    .printCircularImage(icon, 20, 227, 10)
                    .setTextFont('10px montserrat').printText(bot.type.toUpperCase() + " BOT", 310, 20); 
                case "small":    
                    image = new Canvas(400, 140)
                    .setColor(bg)
                    .printRoundedRectangle(0, 0, 400, 150, 10)
                    .setTextAlign('left')
                    .setTextFont('28px montserrat')
                    .setColor(theme)
                    .printRoundedRectangle(0, 115, 400, 25, 5)
                    .printRoundedRectangle(0, 0, 400, 40, 10)
                    .printRoundedRectangle(10, 50, 185, 25, 10)
                    .printRoundedRectangle(207, 50, 185, 25, 10)
                    .printRoundedRectangle(10, 80, 185, 25, 10)
                    .printRoundedRectangle(207, 80, 185, 25, 10)
                    .setColor('#fff')
                    .setTextSize(12)
                    .printText('Infinity Bot List', 30, 130)
                    .printText('infinitybots.gg', 300, 130)
                    .setTextSize(15)
                    .printText(
                    `${bot.servers === 0 ? 'N/A' : formatNumbers(bot.servers)} SERVERS`,
                    20,
                    67,
                    )
                    .printText(
                    `${bot.shards === 0 ? 'N/A' : formatNumbers(bot.shards)} SHARDS`,
                    217,
                    67,
                    )
                    .printText(`${bot.user.status.toUpperCase()}`, 20, 97)
                    .printText(
                    `${bot.votes === 0 ? 0 : formatNumbers(bot.votes)} VOTES`,
                    217,
                    97,
                    )
                    .setTextSize(20)
                    .printText(bot.user.username.length > 25 ? bot.user.username.slice(0, 25) + '...' : bot.user.username,40,25,)
                    .printCircularImage(avatar, 20, 20, 15)
                    .printCircularImage(icon, 20, 127, 10)
                    .setTextFont('10px montserrat').printText(bot.type.toUpperCase() + " BOT", 310, 20);       
            }
        }

        let imgBuf = await image.toBufferAsync()

        reply.type("image/png");

        reply.send(imgBuf)
    })
})

app.addHook('preHandler', (req, reply, done) => {
    reply.header('X-Powered-By', 'Infinity Development')
    done()
})

app.setNotFoundHandler({}, function (request, reply) {
    reply
        .status(404)
        .send({
            message:
                'You seem lost, you may need to reference our widget docs here: https://docs.botlist.site/resources/widgets',
            error: false
        })
})

app.setErrorHandler(function (error, request, reply) {
    if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error)
        // Send error response
        reply
            .status(500)
            .send({ message: 'Something broke: Invalid status code was attempted to be sent', error: false })
    } else {
        // fastify will use parent error handler to handle this
        reply.send(error)
    }
})

// Start server
let port = 3000
if (process.env.PORT) {
    port = parseInt(process.env.PORT)

    if (!port) {
        console.error('Invalid port specified, using default port 3000')
        process.exit(1)
    }

    console.info(`Using port ${port}`)
} else {
    console.warn('No port specified, using default port 3000')
}

app.listen({ port: port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})
