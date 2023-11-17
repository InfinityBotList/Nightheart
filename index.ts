import fastify from 'fastify'
import { registerFont } from 'canvas'
import { Canvas, loadImage } from 'canvas-constructor/cairo'
import { Bot, SEO, Team, Vanity } from './generated/popplio/types';
import { apiUrl, bgs, cdnUrl, extraDataPositionMap, themes } from './consts';
import { resolveAssetMetadataToPath } from './assetmgmt';

type Size = 'large' | 'small'

registerFont('static/Montserrat-Bold.ttf', {
    family: 'montserrat',
    weight: 'bold'
})

function formatNumbers(n: number): string {
    if (n < 1e3) return n.toString()
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
    return n.toString()
}

const slice = (s: string, maxLength: number = 21): string => {
    return s.length > maxLength ? s.slice(0, maxLength-3) + "..." : s
}

/**
 * Represents extra data of a widget entity
 */
interface ExtraData {
    name: string;
    value: string | number;
    format: (imageSize: string) => string;
}

/**
 * Represents the internal abstraction of a widget entity
 */
interface WidgetEntityData {
    id: string;
    platformName: string // Until we decide on a final name for the list
    name: string;
    displayName: string;
    ownerName: string;
    ownerDisplayName: string;
    avatar: string;
    short: string;
    type: string;
    extraData: ExtraData[];
}  

// Server code
const app = fastify({
    logger: true,
    ignoreTrailingSlash: true,
    keepAliveTimeout: 5
})

const paths = ['/bot/:id', '/bots/:id', "/servers/:id", "/server/:id"]

paths.forEach(url => {
    app.get<{
        Params: { id: string }
        Querystring: { theme?: string; accent?: string; size?: Size }
    }>(url, async (req, reply) => {
        let theme = themes['default']
        let bg = bgs['default']
        if (req.query.accent && themes[req.query.accent]) {
            theme = themes[req.query.accent]
        }
        if (req.query.theme && bgs[req.query.theme]) {
            bg = bgs[req.query.theme]
        }

        let codeRes = await fetch(`${apiUrl}/vanity/${req.params.id}`)

        if (!codeRes.ok) {
            let text = await codeRes.text()
            reply.header("Content-Type", "application/json")
            reply.code(codeRes.status).send(text)
            return
        }

        let code: Vanity = await codeRes.json()

        let data: WidgetEntityData | undefined

        switch (code.target_type) {
            case "bot":
                // Fetch bot
                let botReq = await fetch(`https://spider.infinitybots.gg/bots/${req.params.id}`)
            
                if (!botReq.ok) {
                    let json = await botReq.json()
                    reply.code(botReq.status).send(json)
                    return
                }
            
                let bot: Bot = await botReq.json()
            
                if(!bot.user) {
                    reply.status(500).send({
                        message:
                            'Something broke: Invalid bot object was returned',
                        error: true
                    })
                    return
                }

                let ownerName: string = "Unknown"
                let ownerDisplayName: string = "Unknown"

                if (bot.owner) {
                    ownerName = bot.owner.username
                    ownerDisplayName = bot.owner.display_name || bot.owner.username
                } else if (bot.team_owner) {
                    ownerName = bot.team_owner.name
                    ownerDisplayName = bot.team_owner.name
                }

                let userStatus: string = bot.user.status

                data = {
                    id: bot.bot_id,
                    platformName: 'Infinity Bots',
                    name: bot.user.username,
                    displayName: bot.user.username,
                    ownerName,
                    ownerDisplayName,
                    avatar: bot.user.avatar,
                    short: bot.short,
                    type: bot.type,
                    extraData: [
                        {
                            name: "Servers",
                            value: bot.servers,
                            format: () => `${formatNumbers(bot.servers)} SERVERS`
                        },
                        {
                            name: "Shards",
                            value: bot.shards,
                            format: () => `${formatNumbers(bot.shards)} SHARDS`
                        },
                        {
                            name: "Status",
                            value: userStatus,
                            format: () => userStatus.toUpperCase()
                        },
                        {
                            name: "Votes",
                            value: bot.votes,
                            format: () => `${formatNumbers(bot.votes)} VOTES`
                        },
                        {
                            name: "Owner Name",
                            value: ownerName,
                            format: () => ownerName
                        },
                        {
                            name: "Library",
                            value: bot.library,
                            format: () => bot.library
                        }
                    ],
                }
                break;
            default:
                reply.status(500).send({
                    message:
                        `This target type (${code.target_type}) is not supported`,
                    vanityRecieved: code,
                })
                return
        }

        if(!data) {
            reply.status(500).send({
                message:
                    `Internal error: Target type registered (${code.target_type}) but no data was set in handler`,
                error: true
            })
            return
        }
        
        let avatarUrl = decodeURIComponent(data.avatar);
    
        let avatar = await loadImage(avatarUrl)
        let icon = await loadImage(`${cdnUrl}/core/full_logo.webp`)
    
        let size = req.query.size || 'large';
        if(!extraDataPositionMap[size]) {
            reply.status(500).send({
                message: `Internal error: Invalid size specified (${size})`,
            })
            return
        }

        let sizeData = extraDataPositionMap[size]

        let image: Canvas = new Canvas(sizeData.size[0], sizeData.size[1])
            .setColor(bg)
            .printRoundedRectangle(0, 0, sizeData.size[0], sizeData.size[1], 10)
            .setTextAlign('left')
            .setTextFont('28px montserrat')
            .setColor(theme);

        image = sizeData.init(image) // Add size-specific data

        image
            .setColor('#fff')
            .setTextSize(12)
            .printText(data.platformName, 30, 230)
            .printText('infinitybots.gg', 300, 230)
            .setTextSize(15);
        
        let currXIndex = 0
        let currY = sizeData.posMap[1][0] // [end][start]
        let yOffset = sizeData.posMap[1][1] // [end][offset]

        for(let i = 0; i < data.extraData.length; i++) {
            image.printText(data.extraData[i].format(size), sizeData.posMap[0][currXIndex], currY)

            if(currXIndex < sizeData.posMap[0].length - 1) {
                currXIndex++
            } else {
                currXIndex = 0
                currY += yOffset
            }
        }

        image
            .setTextSize(17)
            .printWrappedText(slice(data.short), 20, 60, 350)
            .setTextSize(20)
            .printText(
                slice(data.displayName, 25),
                40,
                25
            );

        image = sizeData.addIcons(avatar, icon, image) // Add the icons
            
        image.setTextFont('10px montserrat')
            .printText(`${data.type.toUpperCase()} ${code.target_type.toUpperCase()}`, 310, 20)
        
        let imgBuf = await image.toBufferAsync()
    
        reply.type('image/png')
    
        reply.send(imgBuf)
    })    
})

app.addHook('preHandler', (req, reply, done) => {
    reply.header('X-Powered-By', 'Infinity Development')
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    done()
})

app.setNotFoundHandler({}, function (request, reply) {
    reply.status(404).send({
        message:
            'You seem lost, you may need to reference our widget docs here: https://docs.botlist.site/resources/widgets',
    })
})

app.setErrorHandler(function (error, request, reply) {
    if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
        // Log error
        this.log.error(error)
        // Send error response
        reply
            .status(500)
            .send({ message: 'Something broke: Invalid status code was attempted to be sent' })
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
