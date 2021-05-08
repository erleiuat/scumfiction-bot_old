require('dotenv').config()
const Discord = require('discord.js')
const disiClient = new Discord.Client()

disiClient.on('ready', () => {

    console.log(`\nLogged in as ${disiClient.user.tag}!\n`)

    const channel = disiClient.channels.cache.find(channel => channel.id === '837341635452600360')

    /*
    const embed = new Discord.MessageEmbed({
        'title': 'title ~~(did you know you can have markdown here too?)~~',
        'description': 'this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown. ```\nyes, even code blocks```',
        'url': 'https://discordapp.com',
        'color': 9995397,
        'timestamp': '2021-05-07T10:34:53.774Z',
        'footer': {
            'icon_url': 'https://cdn.discordapp.com/embed/avatars/0.png',
            'text': 'footer text'
        },
        'thumbnail': {
            'url': 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        'image': {
            'url': 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        'author': {
            'name': 'author name',
            'url': 'https://discordapp.com',
            'icon_url': 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        'fields': [{
                'name': '🤔',
                'value': 'some of these properties have certain limits...'
            },
            {
                'name': '😱',
                'value': 'try exceeding some of them!'
            },
            {
                'name': '🙄',
                'value': 'an informative error should show up, and this view will remain as-is until all issues are fixed'
            },
            {
                'name': '<:thonkang:219069250692841473>',
                'value': 'these last two',
                'inline': true
            },
            {
                'name': '<:thonkang:219069250692841473>',
                'value': 'are inline fields',
                'inline': true
            }
        ]
    });
    */


    const embed = new Discord.MessageEmbed({
        'color': '000000',
        'fields': [
            {
                'name': 'Killer',
                'value': 'Chris P. Bacon',
                'inline': true
            },
            {
                'name': 'Victim',
                'value': 'Chris P. Bacon',
                'inline': true
            },
            {
                'name': 'Weapon',
                'value': 'BP_Weapon_BlackHawk_Crossbow_C [Projectile]'
            },
            {
                'name': 'Distance',
                'value': '1 Meters'
            }
        ],
        'footer': {
            'text': '29.04.2021 - 03:14:19'
        }

    });


    channel.send(embed);

});

disiClient.login(process.env.botToken);