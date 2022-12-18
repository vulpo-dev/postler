import { RouteOptions } from "fastify";
import nodemailer from "nodemailer";
import * as path from "path";

export function createSendEmailHandler(src: string): RouteOptions {
	return {
		method: "POST",
		url: "/api/email/send",
		handler: async (req, _reply) => {
			let configPath = path.join(src, "config.js");
			let config = require(configPath);
			let transporter = nodemailer.createTransport(config.default?.smtp);

			let body = req.body as {
				to: string;
				html: string;
				subject: string;
			};

			let info = await transporter.sendMail({
				from: config.default?.email?.from ?? "",
				to: body.to,
				subject: body.subject,
				html: body.html,
			});

			return info;
		},
	};
}

const REQUIRED_CONFIG_KEYS = [
	"smtp.host",
	"smtp.port",
	"smtp.secure",
	"smtp.auth.user",
	"smtp.auth.pass",
	"email.from",
];

export function createHasEmailConfigHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/email/has_config",
		handler: async () => {
			let configPath = path.join(src, "config.js");
			let config = require(configPath);
			let conf = config.default ?? {};

			if (conf.smtp === undefined || conf.email === undefined) {
				return { hasConfig: false };
			}

			let hasConfig = REQUIRED_CONFIG_KEYS.map((key) => {
				let keyPath = key.split(".");
				return keyPath.reduce((acc, key) => {
					if (acc === undefined) {
						return undefined;
					}

					if (acc[key] === undefined) {
						return undefined;
					}

					return acc[key];
				}, conf);
			}).every((value) => value !== undefined);

			return { hasConfig };
		},
	};
}
