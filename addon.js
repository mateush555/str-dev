const { addonBuilder } = require('stremio-addon-sdk')
const axios = require('axios')
const cheerio = require('cheerio')
const auth = require('./auth')
const config = require('./config')

const manifest = {
    id: 'org.deviltorrents',
    version: '1.0.0',
    name: 'Devil Torrents',
    description: 'Streams from devil-torrents.pl',
    resources: ['stream'],
    types: ['movie'],
    catalogs: []
}

const builder = new addonBuilder(manifest)

async function getStreamData(imdbId) {
    if (!auth.isLoggedIn()) {
        await auth.login()
    }

    const response = await axios.get(`${config.baseUrl}/search/${imdbId}`, {
        headers: {
            'Cookie': auth.getCookies(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    })

    // Tu dodamy parsowanie strony i wyciąganie linków do torrentów
    const $ = cheerio.load(response.data)
    const streams = []
    
    // Przykładowe parsowanie (trzeba dostosować do struktury strony)
    $('.torrent-row').each((i, elem) => {
        streams.push({
            title: $(elem).find('.title').text(),
            url: $(elem).find('.magnet-link').attr('href'),
            type: 'torrent'
        })
    })

    return streams
}

builder.defineStreamHandler(async ({ type, id }) => {
    if (type !== 'movie') return { streams: [] }
    
    try {
        const streams = await getStreamData(id)
        return { streams }
    } catch (e) {
        console.error(e)
        return { streams: [] }
    }
})

module.exports = builder.getInterface()
