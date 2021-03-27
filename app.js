import fetch from 'node-fetch';
import fs from 'fs';

const API_KEY = '';

const domainList = [
	'example.tld',
	'example.com',
	'example.net',
	'example.fr',
	'example.org',
];

const output = {};

async function getWhoisData(domainName) {
	try {
		const res = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_KEY}&domainName=${domainName}&outputFormat=json&da=2`);

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