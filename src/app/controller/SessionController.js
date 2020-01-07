const { User } = require('../models');

class SessionController {
	async insert(req, res) {
		const { email, password } = req.body;

		// busca o usuário pelo email(é uma uniquekey no banco)
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({
				message: 'User not found'
			});
		}

		if (!(await user.checkPassword(password))) {
			return res.status(401).json({
				message: 'Invalid password'
			});
		}

		//
		return res.json({ user, token: user.generateToken() });
	}
}


module.exports = new SessionController();