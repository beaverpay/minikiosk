//미들웨어에 사용자 파라미터를 쓰기 위한 구조
function isPositiveNum(param)
{
    return (req, res, next) => {
        let error;
        const checkValue = req.params[param];
        
        if(isNaN(checkValue)){
            error = new Error('Bad Request : 매장 아이디는 숫자여야 합니다.');
            error.status = 400;
            throw error;
        }
        else if(checkValue <= 0){
            error = new Error('Bad Request : 매장 아이디는 0 또는 음수일 수 없습니다.');
            error.status = 400;
            throw error;
        }
        else{
            next();
        }
    }
}

module.exports = isPositiveNum;