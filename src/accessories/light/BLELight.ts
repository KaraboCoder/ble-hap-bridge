import noble, { Characteristic } from "@abandonware/noble";

class BLELight {
  private ledCharacteristic: Characteristic | null;
  public peripheralAddress: string;
  public serviceUUID: string;
  public characteristicUUID: string;

  constructor(
    _peripheralAddress: string,
    _serviceUUID: string,
    _characteristicUUID: string
  ) {
    /*
     * Connect to bluetoth
     */

    this.ledCharacteristic = null;
    this.peripheralAddress = _peripheralAddress;
    this.serviceUUID = _serviceUUID;
    this.characteristicUUID = _characteristicUUID;

    noble.on("stateChange", async (state) => {
      if (state === "poweredOn") {
        await noble.startScanningAsync();
      }
    });

    noble.on("scanStart", () => {
      console.log("Scanning...");
    });

    noble.on("discover", async (peripheral) => {
      console.log(peripheral.address);
      if (peripheral.address === this.peripheralAddress) {
        await noble.stopScanningAsync();
        await peripheral.connectAsync();
        console.log(
          `Connected to ${peripheral.address} (${peripheral.advertisement.localName})`
        );
        console.log("Discovering services...");
        const services = await peripheral.discoverServicesAsync();
        console.log(services);
        for (const service of services) {
          if (service.uuid.toLowerCase() === this.serviceUUID.toLowerCase()) {
            console.log("service discovered");
            console.log("Discovering characteristics...");

            const characteristics =
              await service.discoverCharacteristicsAsync();
            if (
              characteristics.length &&
              characteristics[0].uuid.toLowerCase() ===
                this.characteristicUUID.toLowerCase()
            ) {
              this.ledCharacteristic = characteristics[0];
              console.log(
                "Characteristic discovered: ",
                characteristics[0].uuid
              );
            }
          }
        }
      }
    });
  }

  public async getLED(): Promise<boolean> {
    console.log(this.ledCharacteristic);
    if (this.ledCharacteristic) {
      const state = (await this.ledCharacteristic.readAsync())[0]
        ? true
        : false;
      return state;
    }
    console.error("Could not read LED state from Bluetooth device.");
    return false;
  }

  public async setLED(value: boolean) {
    let v = Buffer.alloc(1);
    v.writeInt8(value ? 1 : 0, 0);
    console.log(this.ledCharacteristic);
    if (this.ledCharacteristic)
      await this.ledCharacteristic.writeAsync(v, false);
    else console.error("Could not set LED state on Bluetooth device.");
  }
}

export default BLELight;
