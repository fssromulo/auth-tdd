const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: 'Token not provided' });
	}

	// 'Bearer <token aqui>'
	// Usa a desestruturação de array para pegar a segunda parte do SPLIT
	const [, token] = authHeader.split(' ');

	try {
		const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);

		req.userId = decoded.id;
	} catch (error) {
		return res.status(401).json({ message: 'Token not valid' });
	}

	return next();
}