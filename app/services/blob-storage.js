const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config/blob-storage')
let blobServiceClient

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccountName}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const blobContainerClient = blobServiceClient.getContainerClient(config.containerName)

async function uploadFile (buffer, filename) {
  const blockBlobClient = blobContainerClient.getBlockBlobClient(filename)
  await blockBlobClient.upload(buffer, buffer.byteLength)
  console.log('Blob was uploaded successfully')
}

module.exports = { uploadFile }
