import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./domainData.json', 'utf-8'));

const list = Object.values(data).sort((a, b) => {
	if(!a.expire_date && !b.expire_date) {
		return 0;
	}

	if(!a.expire_date) {
		return -1;
	}

	if(!b.expire_date) {
		return 1;
	}

	return (new Date(a.expire_date)).getTime() - (new Date(b.expire_date)).getTime();
});

console.log('Domain name\t\tExpiry Date');

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
		console.log(domainDisplay + whoisData.expire_date);
	}
}

const stats = fs.statSync('./domainData.json');
console.log('\nLast data update:\t', stats.mtime.toLocaleString());