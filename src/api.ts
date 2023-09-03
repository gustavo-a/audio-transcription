import axios from 'axios'
import OpenAI from 'openai'

const apiKey = process.env.API_KEY

export default new OpenAI({
  apiKey: apiKey
})
