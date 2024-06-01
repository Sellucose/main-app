require('dotenv').config()

const fs = require('fs')
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager')

const client = new SecretManagerServiceClient()

async function getSecret() {
  if (!fs.existsSync(process.env.SERVICE_ACCOUNT_PATH)) {
    const [secret] = await client.accessSecretVersion({
      name: process.env.SERVICE_ACCOUNT_SECRET_VERSION_NAME,
    })
  
    fs.writeFileSync(process.env.SERVICE_ACCOUNT_PATH, secret.payload.data.toString())
  }
}

getSecret()