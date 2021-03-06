const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || '';
    
    let bearerToken;
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' });
    } else {
        bearerToken = authToken.slice(7, authToken.length);
    }

    try {
        const payload = AuthService.verifyJWT(bearerToken);

        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub
        )
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized request' });
                }
                req.user = user;
                next();
            })
            .catch(error => {
                console.error(error);
                next(error);
            });

    } catch(error) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
}

// Admin privileges are required for some routes
function verifyAdminPrivileges(req, res, next) {
    if (!req.user.admin) {
        return res.status(401).json({
            error: 'This account does not have admin privileges',
        }); 
    }

    next();
}

module.exports = {
    requireAuth,
    verifyAdminPrivileges,
};
