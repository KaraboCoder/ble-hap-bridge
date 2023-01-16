import { Categories } from "hap-nodejs";

import bridge from "./bridge";
import lightAccessory from "./accessories/light/light";

/*
 * Add Accessories
 */
bridge.addBridgedAccessory(lightAccessory);

/*
 * Publish bridge
 */
bridge.publish({
  username: "AD:A0:AD:A0:AD:A0",
  port: 60000,
  pincode: "100-11-100",
  category: Categories.BRIDGE,
});
