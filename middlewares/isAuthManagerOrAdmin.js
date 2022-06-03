function isAuthManagerOrAdmin(req, res, next) {
    const user = req.user;
    if (user.id === parseInt(req.params.menu_store_id) || user.role === 'admin'){
        next();
    }else{
        const error = new Error('Forbidden : 권한이 없습니다.');
        error.status = 403
        throw error;
    }
}

module.exports = isAuthManagerOrAdmin;