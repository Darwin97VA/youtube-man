const ppt = require('puppeteer')

module.exports = async () => {
	const browser = await ppt.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
		]
	})
	const page = await browser.newPage();
	await page.goto('https://www.youtube.com')
	return async text => {
		await page.type('input#search', text)
		await Promise.all([
			page.click('button#search-icon-legacy'),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		])
		return await page.evaluate(text => {
			const resultsElements = [...document.querySelectorAll('#contents ytd-video-renderer')]
			return resultsElements.map(res => {
				var result = null
				try {
				const { href, innerText } = res.querySelector('a#video-title')
				const channel = res.querySelector('#channel-name a')
				const meta = res.querySelectorAll('#metadata-line>span')
				result = {
					time: res.querySelector('span.ytd-thumbnail-overlay-time-status-renderer').innerText.trim(),
					url: href,
					title: innerText,
					channelName: channel.innerText,
					channelUrl: channel.href,
					views: meta[0].innerText.split(' ')[0],
					ago: meta[1].innerText.slice(0, -4),
					description: res.querySelector('#description-text').innerText
				}
				} catch(e) {
				result = e
				}
				return result
			}).filter(el=>el)
		}, text)
	}
}
