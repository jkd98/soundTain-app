import jwt from "jsonwebtoken"
import Cliente from "../models/Cliente.js"

const checkAuth = async (req, res, next) => {
    const { _tkn } = req.cookies;

    if (!_tkn) {
        const error = new Error("JWToken no válido");
        return res.status(401).json({ msg: error.message });
    }

    try {
        const decoded = jwt.verify(_tkn, process.env.JWT_SECRET);
        const cliente = await Cliente
            .findById({ _id: decoded.id })
            .select("-pass -confirmado -token -createdAt -updatedAt -__v");

        if (!cliente) {
            return res.json({ msg: "No se ha autenticado" });
        }else {
            req.usuario = cliente;
            //console.log(cliente);
            return next(); // avanza al sig middleware
        }
    } catch (error) {
        console.log(error);
        
        res.json({ msg: "No se ha autenticado" });
    }
}

export default checkAuth;