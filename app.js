import fs from 'fs';

import { API_KEY, domainList } from './config.js';

const output = {};

async function getWhoisData(domainName) {
	try {
		const res = await fetch(`https://api.ip2whois.com/v2?key=${API_KEY}&domain=${domainName}&format=json`);

		//console.log('res', res);

		if(res.ok) {
			const json = await res.json();

			//console.log('json', json);

			output[domainName] = {
				domainName,
				...json,
			};
		} else {
			output[domainName] = {
				domainName,
				error: {
					message: res.statusText,
				}
			};
		}
	} catch(e) {
		output[domainName] = {
			domainName,
			error: {
				name: e.name,
				message: e.message,
			}
		};
	}
}

(async () => {
	for(const domain of domainList) {
		console.log('Fetching data for', domain);
		await getWhoisData(domain);
		console.log('Data for', domain, 'fetched !');
	}

	fs.writeFileSync('domainData.json', JSON.stringify(output));
})();