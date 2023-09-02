import axios from 'axios'

const apiKey = process.env.API_KEY
const apiURL = 'https://api.openai.com/v1'

export default axios.create({
  baseURL: apiURL,
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
})
