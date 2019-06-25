const rProperties = /\.properties$/;
const parseurl = require("parseurl");

module.exports = function({resources, options}) {
	let replacement = "pony"
	if (options.configuration.mood) {
		replacement = `${options.configuration.mood} ${replacement}`;
	}
	return function (req, res, next) {
		const pathname = parseurl(req).pathname;
		if (!rProperties.test(pathname)) {
			next();
			return;
		}
		resources.all.byPath(pathname).then(function(resource) {
			if (!resource) { // Not found
				next();
				return;
			}

			resource.getBuffer().then((content) => {
				const ponianizedContent = content.toString().replace(/=[^=]*$/gm, `=${replacement}`);
				res.end(ponianizedContent);
			});
		}).catch((err) => {
			next(err);
		});
	}
};
