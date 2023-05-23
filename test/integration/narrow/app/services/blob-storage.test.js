const config = require('../../../../../app/config/blob-storage')

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
	const mockFromConnectionStringSpy = jest.fn().mockImplementation(() => {
		return {
			getContainerClient: getContainerClientSpy,
		}
	})


	const mockGetContainerClientSpy = jest.fn();
	const mockGetBlockBlobClientSpy = jest.fn().mockImplementation(() => {
		return {
			upload: mockUpload,
		}
	})

	const mockBlobServiceClient = jest.fn().mockImplementation(() => {
		return {
			fromConnectionString: mockFromConnectionStringSpy,
			getContainerClient: jest.fn().mockImplementation(() => {
				return {
					getBlockBlobClient: mockGetBlockBlobClientSpy,
					getContainerClient: mockGetContainerClientSpy
				}
			}),
		}
	});

	jest.mock('@azure/storage-blob', () => {
		const originalModule = jest.requireActual('@azure/storage-blob')
		return {
			__esModule: true,
			...originalModule,
			BlobServiceClient: mockBlobServiceClient,
			fromConnectionString: mockFromConnectionStringSpy,
		}
	})


	afterEach(() => {
		jest.clearAllMocks()
	})
	test.todo('Fix and unskip this test!')
	test.skip('uploadFile() - creating a client with useConnectionStr', async () => {
		const mockBuff = 'useConnectionStr'
		const mockFilename = 'whatever.jpg'

		const storage = require('../../../../../app/services/blob-storage')
		await storage.uploadFile(mockBuff, mockFilename)

		expect(mockFromConnectionStringSpy).toHaveBeenCalledWith(config.connectionStr)
		expect(getContainerClientSpy).toHaveBeenCalledWith(config.containerName)
		expect(mockGetBlockBlobClient).toHaveBeenCalledWith(mockFilename)
		expect(mockUpload).toHaveBeenCalledWith(mockBuff, mockBuff.byteLength)
	})

	test('uploadFile() - creating a client WITHOUT useConnectionStr', async () => {
		config.useConnectionStr = false

		const mockBuff = 'without-useConnectionStr'
		const mockFilename = 'whatever.jpg'

		const storage = require('../../../../../app/services/blob-storage')
		await storage.uploadFile(mockBuff, mockFilename)

		expect(mockFromConnectionStringSpy).toHaveBeenCalledTimes(0)
		expect(mockBlobServiceClient).toHaveBeenCalledTimes(1)
		expect(mockGetBlockBlobClientSpy).toHaveBeenCalledWith(mockFilename)
		expect(mockUpload).toHaveBeenCalledWith(mockBuff, mockBuff.byteLength)
	})
})
