const apn = require('apn');

const sendNotification = (alert, badge, sound, deviceToken) => {
  const { apnProvider, bundleId } = require('../server');
  const notification = new apn.Notification();
  notification.topic = bundleId;
  notification.alert = alert;
  notification.badge = badge;
  notification.sound = sound;
  apnProvider.send(notification, deviceToken).then(result => console.log(result));
};

module.exports = sendNotification;
