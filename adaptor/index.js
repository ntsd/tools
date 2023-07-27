import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

/** @type {import('.').default} */
export default function (insideAdapter, pages = 'build') {
	return {
		name: 'custom-adaptor',
		async adapt(builder) {
			if (insideAdapter) {
				await insideAdapter.adapt(builder);
			}
			const routesPath = builder.config.kit.files.routes;

			builder.prerendered.pages.forEach(async (page, key) => {
				const headerPath = path.join(routesPath, key, 'header.html');
				const htmlPath = path.join(pages, page.file);
				builder.log(`Rendering preload header ${key} to ${htmlPath}`);

				let preloadHead = '';

				try {
					preloadHead = readFileSync(headerPath).toString();
				} catch (err) {
					if (err.code === 'ENOENT') {
						builder.log.warn(`Not found preload header at ${headerPath} will replace with empty`);
					} else {
						throw err;
					}
				}

				let html = readFileSync(htmlPath).toString();
				html = html.replace(/%preload\.head%/g, preloadHead);
				await writeFileSync(htmlPath, html);
			});
		}
	};
}
