const Notification = require('../models/notificationModel');

const trackEmailRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (notification) {
      notification.read = true;
      await notification.save();
    } else {
      console.log('notification is not found');
    }
    res.status(200).send('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" />');
  } catch (error) {
    console.error('marking notification error:', error);
    res.status(500).send('Error');
  }
};

const getNotificationDetails = async(req,res)=>{
  try{
    const {id} = req.params;
    if(!id){
      return res.status(400).json({message:'user id is must necessary'})
    }
    const notifications = await Notification.find({userId:id,read:false})
    if(!notifications.length){
      return res.status(404).json({message:'no unread notification available in database'})
    }
    res.status(200).json(notifications)
    
  }catch(error){
    res.status(500).json({message:'internal server error'})
  }

};

module.exports = { trackEmailRead,getNotificationDetails };
