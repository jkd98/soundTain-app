import Cliente from "../models/Cliente.js";



//Función para listar clientes
const listarClientes = async (req, res, next) => {
    try {
        const clientes = await Cliente.find({});
        res.json({ msg: "OK", clientes });
    } catch (error) {
        console.log(error);
        next();
    }
}

//Función para obtener un cliente por ID
const obtenerCliente = async (req, res, next) => {
    try {
        const id = req.params.idC;
        const cliente = await Cliente.findById(id);

        res.json({ msg: "OK", cliente });
    } catch (error) {
        console.log(error);
        res.json({ msg: "No se econtro el cliente" });
        next();
    }
}

//Función para editar un cliente
const editarCliente = async (req, res, next) => {
    try {
        const id = req.params.idC;
        const cliente = await Cliente.findOne({ '_id': id });

        if (!cliente) {
            //Verificar existencia
            res.json({ msg: "No se econtro el cliente" });
            next();
        } else {
            //Si existe, actualizalo con los datos de req.body
            const clienteAct = await Cliente.findOneAndUpdate(
                { _id: id },
                req.body,
                { new: true }//para traer a la respuesta, los datos actualizados   
            );

            res.json({ msg: "OK", clienteAct });
        }

    } catch (error) {
        console.log(error);
        return res.json({ msg: "No se pudo editar el cliente" });
    }
}

//Función para eliminar un cliente
const eliminarCliente = async (req, res, next) => {
    try {
        const id = req.params.idC;
        const cliente = await Cliente.findOne({ '_id': id });

        if (!cliente) {
            //Verificar existencia
            res.json({ msg: "No se econtro el cliente" });
            next();
        } else {
            //Si existe, eliminarlo
            const clienteDel = await Cliente.findOneAndDelete({ _id: id });

            res.json({ msg: "OK", clienteDel });
        }

    } catch (error) {
        console.log(error);
        return res.json({ msg: "No se pudo eliminar el cliente" });
    }
}


export {
    listarClientes,
    obtenerCliente,
    editarCliente,
    eliminarCliente
}