const ProduceIdForDetailsFetching = require("../producer/fetchingProductHistoryProducer")
const productRecommendation = async(req,res)=>{
    try {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({ error: "id and  are necessary" });
        }
       await ProduceIdForDetailsFetching(id)
        res.status(200).json({ message: "id produce for fetching recommendation product send successfully" });
      } catch (error) {
        console.error(`not send recommendation product for this ${id}:`, error);
        res.status(500).json({ error: "internal server error" });
      }
};

module.exports = {productRecommendation}