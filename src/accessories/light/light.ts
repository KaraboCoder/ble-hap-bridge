import {
  Accessory,
  Characteristic,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAPStatus,
  Service,
  uuid,
} from "hap-nodejs";

import BLELight from "./BLELight";

const accessoryUuid = uuid.generate("hap.accessory.light.led");
const accessory = new Accessory("Arduino LED", accessoryUuid);
const ledDevice = new BLELight(
  "99:a1:05:0c:7d:c6",
  "19b10000e8f2537e4f6cd104768a1214",
  "19b10000e8f2537e4f6cd104768a1214"
);

const lightService = new Service.Lightbulb("Arduino Led");

let currentLightState = false;

const onCharacteristic = lightService.getCharacteristic(Characteristic.On)!;

onCharacteristic.on(
  CharacteristicEventTypes.GET,
  (callback: CharacteristicGetCallback) => {
    ledDevice
      .getLED()
      .then((state) => {
        currentLightState = state;
        console.log(
          "Queried current LED state: " +
            currentLightState +
            " " +
            new Date().toLocaleString()
        );
        callback(HAPStatus.SUCCESS, currentLightState);
      })
      .catch((error) => {
        console.log("Error while trying to read state of LED device. ", error);
        callback({
          name: "Error",
          message: "Could not read the state of the bluetooth device",
        });
      });
  }
);

onCharacteristic.on(
  CharacteristicEventTypes.SET,
  (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
    ledDevice
      .setLED(value as boolean)
      .then(() => {
        console.log(
          "Setting LED state to: " + value + " " + new Date().toLocaleString()
        );
        currentLightState = value as boolean;
        callback(HAPStatus.SUCCESS);
      })
      .catch((error) => {
        console.log(
          "Error while trying to update the state of LED device. ",
          error
        );
        callback({
          name: "Error",
          message: "Could not update the state of the bluetooth device",
        });
      });
  }
);

accessory.addService(lightService);

export default accessory;
