const axios = require('axios').default;
const jsdom = require('jsdom');
const { Telegraf } = require('telegraf');

const { queryGenerator } = require('./queryGenerator');

const { JSDOM } = jsdom;

const bot = new Telegraf(process.env.BOT_TOKEN);

const fetchMobiles = async (maxPrice) => {
	const query = `https://www.smartprix.com/mobiles/${queryGenerator(maxPrice)}`;

	const { data } = await axios.get(query);

	const dom = new JSDOM(data);
	const res = dom.window.document.querySelectorAll('.list-content .f-mobiles');
	const output = [...res].map((node) => {
		const score = node.querySelector('.score-val').textContent;
		const title = node.querySelector('.info a').textContent;
		const link = node.querySelector('.info a').getAttribute('href');
		const img = node
			.querySelector('.list-content img')
			.getAttribute('src')
			.replace('-w103-h125', '');
		return { score, title, link, img };
	});

	return output || [];
};

bot.start((ctx) => {
	console.log(ctx.message.text);
	ctx.reply(
		'Welcome to Get me My best phone bot! Send the Max price of mobile and I will send you top 10 best phone you should buy'
	);
});

bot.hears(/^\d{4,6}$/gm, async (ctx) => {
	ctx.reply('Fetching... Please wait...');
	const mobiles = await fetchMobiles(ctx.message.text);
	mobiles.forEach((mobile, index) => {
		ctx.replyWithPhoto(
			{
				url: mobile.img,
			},
			{
				parse_mode: 'markdown',
				caption: `Specification Score : ${mobile.score} \n[${
					mobile.title
				}](${encodeURI(
					`https://www.amazon.in/s?k=${mobile.title}&linkCode=ll2&tag=immayurpanc08-21&linkId=393ea55f8e9f9254d512c598039f46c0&language=en_IN&ref_=as_li_ss_tl`
				)})`,
			}
		);
	});
});

bot.launch();
