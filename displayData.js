import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./domainData.json', 'utf-8'));

const list = Object.values(data).sort((a, b) => {
	if(a.WhoisRecord.domainAvailability === 'AVAILABLE' && b.WhoisRecord.domainAvailability !== 'AVAILABLE') {
		return -1;
	}

	if(b.WhoisRecord.domainAvailability === 'AVAILABLE' && a.WhoisRecord.domainAvailability !== 'AVAILABLE') {
		return 1;
	}

	return (new Date(a.WhoisRecord.registryData.expiresDate)).getTime() - (new Date(b.WhoisRecord.registryData.expiresDate)).getTime();
});

console.log('Domain name\t\tStatus\t\tExpiry Date');

for(const whoisData of list) {
	let domainDisplay = whoisData.domainName;
	if(whoisData.domainName.length < 8) {
		domainDisplay += '\t\t\t';
	} else if(whoisData.domainName.length < 16) {
		domainDisplay += '\t\t';
	} else {
		domainDisplay += '\t';
	}

	if(whoisData.error && whoisData.error.message) {
		console.log(domainDisplay + whoisData.error.message);
	} else {
		console.log(domainDisplay + whoisData.WhoisRecord.domainAvailability + '\t' + (whoisData.WhoisRecord.registryData.expiresDate || ''));
	}
}

const stats = fs.statSync('./domainData.json');
console.log('\nLast data update:\t', stats.mtime.toLocaleString());