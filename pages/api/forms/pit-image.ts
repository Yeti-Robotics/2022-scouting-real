import PitImage from '@/models/PitImage';
import Formidable from 'formidable-serverless';
import { NextApiHandler, NextConfig } from 'next';
import fs from 'fs';

export const config: NextConfig = {
	api: {
		bodyParser: false,
	},
};

const handler: NextApiHandler = async (req, res) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		if (!req.query.formId)
			return res.status(400).json({ message: 'No form id recieved for image.' });
		const images = new Formidable.IncomingForm({ multiples: true, keepExtensions: true });

		images
			.on('file', (name: string, file: { path: string }) => {
				const data = fs.readFileSync(file.path);
				const image = new PitImage({ data, formId: req.query.formId });
				image.save();
			})
			.on('aborted', () => {
				reject(res.status(500).send('Aborted'));
			})
			.on('end', () => {
				resolve(res.status(200).send('done'));
			});

		await images.parse(req);
	});
};

export default handler;
