const protect = (req, res, next) => {
    if(req.oidc.isAuthenticated()){
        next();
    }else{
        res.status(401).json({message: "Not Authroized"});
    }
};

export default protect;