const cron = require("node-cron");
const Alert = require("../models/AlertModel");
const NotificationDelivery = require("../models/NotificationDelivery");
const VisibilityResolver = require("./VisibilityResolver");
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
      }).populate("visibility.target");

      for (const alert of isActiveAlerts) {
        const targetUserIds = await VisibilityResolver.resolveTargets(
          alert.visibility
        );
        const Strategy = DeliveryFactory.createStrategy(alert.deliveryType);

        for (const userId of targetUserIds) {
          const state = await AlertStateManager.getState(userId, alert._id);
          if (state.isDueForRemainder()) {
            await new NotificationDelivery({
              alert: alert._id,
              user: userId,
            }).save();
            // Fetch user for deliver
            const user = { _id: userId, name: "User" }; // Stub; populate in prod
            strategy.deliver(alert, user);
            console.log(`Reminder delivered for ${alert.title} to ${userId}`);
          }
        }
      }
    });
  }
}

module.exports = RemainderScheduler;
