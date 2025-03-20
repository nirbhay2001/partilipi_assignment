const orderUpdateStatus = require("../producer/orderStatusUpdateProducer");

const orderUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!id || !order_status) {
      return res.status(400).json({ error: "Id and order status are necessary" });
    }

    const result = await orderUpdateStatus(id, order_status);

    res.status(200).json({ message: "order status updated successfully" });
  } catch (error) {
    console.error("updating order status error:", error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = orderUpdate ;
