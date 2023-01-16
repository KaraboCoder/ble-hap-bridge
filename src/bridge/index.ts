import { Bridge, Characteristic, Service, uuid } from "hap-nodejs";

const bridge = new Bridge("BLE-Bridge", uuid.generate("hap.bridge.blebridge"));

bridge
  .getService(Service.AccessoryInformation)
  ?.setCharacteristic(Characteristic.Manufacturer, "KaraboCoder")
  .setCharacteristic(Characteristic.Model, "Bridge V1")
  .setCharacteristic(Characteristic.SerialNumber, "0001")
  .setCharacteristic(Characteristic.SoftwareRevision, "0.1");

bridge.on("identify", (paired, callback) => {
  console.log("Homekit paird: ", paired);
  callback();
});

bridge.on("paired", () => {
  console.log("Bridge is paired");
});

bridge.on("unpaired", () => {
  console.log("Bridge is unpaired");
});

bridge.on("listening", () => {
  console.log("Bridge is listening...");
});

bridge.on("advertised", () => {
  console.log("Bridge is advertised");
});

export default bridge;
