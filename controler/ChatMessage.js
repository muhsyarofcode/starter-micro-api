import Chat from "../models/ChatModel.js"

export const sendMessage = async(req,res) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const message = req.body.message
        const photo = req.body.photo
        await Chat.create({
            email: email,
            name: name,
            message: message,
            photo: photo
        })
        res.json({msg:"message"})
    } catch (error) {
        res.status(404).json({msg:"failed send massage"})
    }
}

export const receiveMessage = async (req,res) => {
    const history = await Chat.findAll({
        attributes: ['name','email','message','createdAt','photo']
    })
    res.json(history)
}