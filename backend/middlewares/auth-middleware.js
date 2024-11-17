import jwt from "jsonwebtoken"

const isAutheticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:`User not authenticated`,
                success:false,
            })
        }
        const decodeToken = await jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decodeToken){
            return res.status(401).json({
                message:`Invalid Token`,
                success:false,
            })
        }
        req.user_id = decodeToken.userId;
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}

export default isAutheticated