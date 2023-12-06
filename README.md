# JSON translation using AI (OpenAI)

Tradução de dados em formato JSON utilizando a API da OpenAI onde enviamos uma estrutura json com os dados em `inglês` e pedimos a tradução dos valores da estrutura para qualquer idioma.

## Como funciona?

1. Primeiro crie sua conta na OpenAI: https://openai.com/
1. Em seguida crie um token
1. Crie um arquivo `.env` e inclua a key `OPEN_AI_KEY` com o valor do token gerado anteriormente
1. Modifique a linha `92` de acordo com a linguagem que seja necessária
1. O arquivo `workouts.json` segue de exemplo como estrutura a ser traduzida, então o modifique da maneira que for melhor para seu caso de uso.
1. Para executar o projeto, basta executar o comando `npm run start`.
