import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	ListObjectsV2Command,
	_Object
} from '@aws-sdk/client-s3'

const s3 = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY!,
		secretAccessKey: process.env.AWS_SECRET_KEY!
	}
})

export const getAllFiles = async () => {
	let continuationToken: string | undefined = undefined
	let files: _Object[] = []

	do {
		const res = await s3.send(
			new ListObjectsV2Command({
				Bucket: process.env.AWS_BUCKET_NAME!,
				ContinuationToken: continuationToken
			})
		)

		const contents = res.Contents ?? []
		files.push(...contents)
		continuationToken = res.NextContinuationToken
	} while (continuationToken)

	const result = files.map(file => ({
		title: file.Key!.split('/').pop()!,
		createdAt: file.LastModified,
		url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.Key}`
	}))

	return result
}

export const uploadFile = async (file: Buffer, fileName: string) => {
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME!,
		Key: fileName,
		Body: file,
		ContentType: 'image/jpeg'
	})

	await s3.send(command)
	return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
}

export const deleteFile = async (fileName: string) => {
	fileName = fileName.split(
		`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`
	)[1]

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME!,
		Key: fileName
	}

	try {
		const command = new DeleteObjectCommand(params)
		await s3.send(command)
	} catch (err) {
		console.error('Error deleting file from S3:', err)
		throw new Error('Error deleting file')
	}
}
