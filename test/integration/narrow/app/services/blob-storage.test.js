const config = require('../../../../../app/config/blob-storage')
const { BlobServiceClient } = require('@azure/storage-blob')
describe('BlobStorage - uploadFile()', () => {
	jest.mock('@azure/identity')
	const mockUpload = jest.fn().mockImplementation(() => {
		return Promise.resolve()
	})
	const mockGetBlockBlobClient = jest.fn().mockImplementation(() => {
		return {
			upload: mockUpload,
		}
	})
	const getContainerClientSpy = jest.fn().mockImplementation(() => {
		return {
			getBlockBlobClient: mockGetBlockBlobClient,
		}
	})
	const fromConnectionStringSpy = jest.spyOn(BlobServiceClient, 'fromConnectionString').mockImplementation(() => {
		return {
			getContainerClient: getContainerClientSpy,
		}
	})
	

	afterEach(() => {
		jest.clearAllMocks()
	})

	test('uploadFile() - creating a client WITHOUT useConnectionStr', async () => {
		config.useConnectionStr = false
		const mockUpload = jest.fn();
		const mockGetContainerClientSpy = jest.fn();
		const mockGetBlockBlobClientSpy = jest.fn().mockImplementation(() => {
			console.log('here: ', 'A7AAAAAAAAAAAAAAAA 2');
			return {
				upload: mockUpload,
			}
		})
		jest.mock('@azure/storage-blob', () => {
			return {
				BlobServiceClient: jest.fn().mockImplementation(() => {
					return {
						getContainerClient: jest.fn().mockImplementation(() => {
							console.log('here: ', 'A7AAAAAAAAAAAAAAAA from GetBlock');
							return {
								getBlockBlobClient: mockGetBlockBlobClientSpy,
								getContainerClient: mockGetContainerClientSpy
							}
						}),
					}
				}
				),
			}
		})

		const mockBuff = 'whatever'
		const mockFilename = 'whatever.jpg'

		const storage = require('../../../../../app/services/blob-storage')
		await storage.uploadFile(mockBuff, mockFilename)

		expect(fromConnectionStringSpy).toHaveBeenCalledTimes(0)
		expect(mockGetBlockBlobClientSpy).toHaveBeenCalledWith(mockFilename)
		expect(mockUpload).toHaveBeenCalledWith(mockBuff, mockBuff.byteLength)
	})


	test('uploadFile() - creating a client with useConnectionStr', async () => {
		const mockBuff = 'whatever'
		const mockFilename = 'whatever.jpg'

		const storage = require('../../../../../app/services/blob-storage')
		await storage.uploadFile(mockBuff, mockFilename)

		expect(fromConnectionStringSpy).toHaveBeenCalledWith(config.connectionStr)
		expect(getContainerClientSpy).toHaveBeenCalledWith(config.containerName)
		expect(mockGetBlockBlobClient).toHaveBeenCalledWith(mockFilename)
		expect(mockUpload).toHaveBeenCalledWith(mockBuff, mockBuff.byteLength)
	})

})
