import { RouteOptions } from 'fastify'
import nodemailer from 'nodemailer'
import * as path from 'path'

export function createSendEmailHandler(src: string): RouteOptions {
	let configPath = path.join(src, 'config.js')
	let config = require(configPath)
	let transporter = nodemailer.createTransport(config.default?.smtp)

	return {
		method: 'POST',
		url: '/api/email/send',
		handler: async (req, reply) => {
			let body = req.body as {
				to: string,
				html: string,
				subject: string,
			}

			let info = await transporter.sendMail({
			    from: config.default?.email?.from ?? '',
			    to: body.to,
			    subject: body.subject,
			    html: body.html,
			});

			return info
		}
	}
}