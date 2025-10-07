const userAlertPreferences = require("../models/userAlertPreference");

class AlertState {
  constructor(preference) {
    this.preference = preference;
  }

  markRead() {
    throw new Error("markRead must be implemented");
  }
  snoose() {
    throw new Error("snoose must be implemented");
  }
  isDueForRemainder() {
    throw new Error("isDueForRemainder must be implemented");
  }
}

class UnreadState extends AlertState {
  markRead() {
    this.preference.status = "read";
    this.preference.save();
    return "read";
  }
  snoose() {
    const endofDay = new Date();
    endofDay.setHours(23, 59, 59, 999);
    this.preference.status = "snoozed";
    this.preference.snoozeUntil = endofDay;
    this.preference.save();
    return "snoozed";
  }
  isDueForRemainder() {
    return true;
  }
}

class ReadState extends AlertState {
  markRead() {
    return "read";
  }
  snoose() {
    return new Error("Cannot snooze a read alert");
  }
  isDueForRemainder() {
    return false;
  }
}

class SnoozedState extends AlertState {
  markRead() {
    this.preference.status = "read";
    this.preference.snoozeUntil = null;
    this.preference.save();
    return "read";
  }
  snoose() {
    const now = new Date();
    if (!this.preference.snoozeUntil || this.preference.snoozeUntil < now) {
      const endofDay = new Date();
      endofDay.setHours(23, 59, 59, 999);
      this.preference.snoozeUntil = endofDay;
    }
    this.preference.save();
    return "snoozed";
  }
  isDueForRemainder() {
    const now = new Date();
    return !this.preference.snoozedUntil || this.preference.snoozedUntil < now;
  }
}

class AlertStateManager {
  static async getState(userId, alertId) {
    let pref = await userAlertPreferences.findOne({
      user: userId,
      alert: alertId,
    });
    if (!pref) {
      pref = new userAlertPreferences({
        user: userId,
        alert: alertId,
        status: "unread",
      });
      await pref.save();
    }
    switch (pref.status) {
      case "read":
        return new ReadState(pref);
      case "snoozed":
        return new SnoozedState(pref);
      default:
        return new UnreadState(pref);
    }
  }
}

module.exports = { AlertStateManager };
