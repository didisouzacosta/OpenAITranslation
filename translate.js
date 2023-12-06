const fs = require('fs')
const OpenAI = require("openai")
const ProgressBars = require('@zhangfuxing/multi-progress')

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY })
const workouts = require('./workouts.json')
const bars = new ProgressBars({
    title: 'Traduções',
    complete: '*',
    incomplete: '.',
    display: ' [:bar] :text :percent :time :completed/:total'
})

let total = 0
let toDoCound = 0
let completed = 0

const log = (message) => bars.console(`---> ${message}`)

const wait = ms => new Promise(r => setTimeout(r, ms));

const progressUpdate = () => {
    bars.render([
        { completed: toDoCound, total, text: 'ToDo' },
        { completed, total, text: 'Completed' }
    ])
}

const createTranslationsFolder = () => {
    const dir = `${__dirname}/translations`

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
        log(`Translatioons folder created: ${dir}.`)
    }

    return dir
}

const merge = ({ path, data }) => {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '[]')
    }

    const json = JSON.parse(data)
    const writedData = require(path)
    
    writedData.push(json)
    
    const dataString = JSON.stringify(writedData)

    fs.writeFileSync(path, dataString)
}

const translate = async ({ index, json, language }) => {
    const dir = createTranslationsFolder()
    const path = `${dir}/${language.acronym}.json`
    const userContent = JSON.stringify(json)

    toDoCound += 1

    progressUpdate()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                "role": "system",
                "content": `The user will provide a JSON with an array of objects containing keys and values. It's necessary for the value of each key to be translated from English to ${language.name}. For example, the input: [{ "sex": "Male" }, {"job": "programmer"}] should yield an output of ${language.example}. For the key "instructions," a literal translation should be created for each item without line breaks. Keys of type array should remain as arrays, even if they contain only a single value. If any key contains an invalid value, it should become null. The structure of the JSON must always be valid.`
            },
            {
                "role": "user",
                "content": userContent
            }
        ],
        model: "gpt-3.5-turbo",
    })

    const data = completion.choices[0].message.content

    if (data) {
        try {
            merge({ path, data })
            completed += 1
            progressUpdate()
        } catch(err) {
            log(`It was not possible merge index: ${index}. Error: ${err}`)
        }
    }
}

async function main() {
    const language = { acronym: 'ptBR', name: 'português', example: '[{ "sex": "masculino" }, {"job": "programador"}]' }
    const start = 0
    const data = workouts

    total = data.length

    await wait(1000)

    for (let index = start; index < data.length; index++) {
        const json = data[index];
        translate({ index, json, language })
        await wait(600)
    }
}

main()