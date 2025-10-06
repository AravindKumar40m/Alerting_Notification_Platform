const cron = require("node-cron");
const Alert = require("../models/AlertModel");
const NotificationDelivery = require("../models/NotificationDelivery");
// const userAlertPreferences = require("../models/userAlertPreferences");
const VisibilityResolver = require("./VisibilityResolver");
// DeliveryFactory is exported from DeliveryStrategy.js
const DeliveryFactory = require("./DeliveryStrategy").DeliveryFactory;
const { AlertStateManager } = require("./AlertStateManager");

class RemainderScheduler {
  static start() {
    cron.schedule("0 */2 * * *", async () => {
      const now = new Date();
      const isActiveAlerts = await Alert.find({
        isActive: true,
        startTime: { $lte: now },
        expiryTime: { $gte: now },
        isRemainderEnable: true,
      });

      for (const alert of isActiveAlerts) {
        const targetUserIds = await VisibilityResolver.resolveTargets(
          alert.visibility
        );
        const Strategy = DeliveryFactory.createStrategy(alert.deliveryType);

        for (const userId of targetUserIds) {
          const state = await AlertStateManager.getState(userId, alert._id);
          if (state.isDueForRemainder()) {
            const delivery = await new NotificationDelivery({
              alert: alert._id,
              user: userId,
            }).save();
            Strategy.deliver(alert, { _id: userId });
            console.log(
              `Remainder delivered for Alert ${alert.title} to User ${userId}`
            );
          }
        }
      }
    });
  }
}

module.exports = RemainderScheduler;
