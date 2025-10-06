// Interface-like base class

class DeliveryStrategy {
  deliver(alert, user) {
    throw new Error("deliver() must be implemented");
  }
}

// In-App Strategy (MVP)
class InAppDeliveryStrategy extends DeliveryStrategy {
  deliver(alert, user) {
    // Stimulate in-app push (in real: WebSocket or poll)
    console.log(`In-App Alert delivered to ${user.name}: ${alert.title}`);
    return { success: true, channel: "In-App" };
  }
}

// Factory for extensibility
class DeliveryFactory {
  static createStrategy(type) {
    switch (type) {
      case "InApp":
        return new InAppDeliveryStrategy();

      default:
        throw new Error(`Unknown delivery type: ${type}`);
    }
  }
}

module.exports = { DeliveryFactory, DeliveryStrategy, InAppDeliveryStrategy };
