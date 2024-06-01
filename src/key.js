require('dotenv').config();

const fs = require('fs');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function getServiceAccount() {
  if (!fs.existsSync(process.env.SERVICE_ACCOUNT_PATH)) {
    const [secret] = await client.accessSecretVersion({
      name: process.env.SERVICE_ACCOUNT_SECRET_VERSION_NAME,
    });
  
    fs.writeFileSync(process.env.SERVICE_ACCOUNT_PATH, secret.payload.data.toString());
  }
}

async function getJWTSecret() {
  if (!fs.existsSync(process.env.JWT_KEY_PATH)) {
    const [secret] = await client.accessSecretVersion({
      name: process.env.JWT_KEY_SECRET_VERSION_NAME,
    });
  
    fs.writeFileSync(process.env.JWT_KEY_PATH, secret.payload.data.toString());
  }
}

getServiceAccount();
getJWTSecret();