const {startSchedular} = require('../producer/taskSchedularProducer')


const productSchedule = async(req,res)=>{
    try{
        const {id} = req.params
        const {email} = req.body
        
        if(!id || !email){
            return res.status(400).json({error:"missing required parameters: id or email"})
        }
        await startSchedular(id,email)
        return res.status(200).json({message:"task scheduled successfully"})
    }catch(error){
        console.error("error in scheduling task:",error)
        return res.status(500).join({error:"internal server error"})
    }
};

module.exports = {productSchedule}