/**
 *      CSinc Cansat extension
 *      V1.1
 *      Developed by CSinc
 * 
 * 
 *      Notes (Reserved Pins):
 *      ------------------------------------------------------
 *      Pin 0   -   Analogue in - External Temperature Sensor
 *      Pin 1   -   Analogue in - External Pressure Sensor
 *      Pin 12  -   Tx              APC220
 *      Pin 13  -   Rx              APC220
 *      ------------------------------------------------------
 */

//% color="#000000" weight=100
namespace CanSat {

    // Variable to validate if the user has selected the serial pins for
    // transmission
    // Options:
    //      Rx and Tx can be used and pinned for the APC220
    //      For initional testing, USB can be used.
    let setUpSerial = false;

    // Variables for external sensor values - to be returned.
    let externalTemp = -1;
    let pressureMilliBars = -1;
    let metersAboveSeaLevel = -1;

    // Local variables
    let sendingDot = 1;


    //% block
    export function transmitViaUsb() {
        // Tx is the first parameter, and Rx the second.
        // Default Baudrate is 115,200 and is set statically.
        let tx = SerialPin.USB_TX;
        let rx = SerialPin.USB_RX;

        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        setUpSerial = true;
    }

    //% block
    export function transmitViaApc220() {
        // Tx is the first parameter, and Rx the second.
        // Default Baudrate is 115,200 and is set statically.
        let tx = SerialPin.P12
        let rx = SerialPin.P13

        serial.redirect(tx, rx, BaudRate.BaudRate115200);
        setUpSerial = true;

    }

    //% block
    export function sendCansatData() {

        if (setUpSerial) {
            //pressureMilliBars = (pins.analogReadPin(AnalogPin.P0) / 1024) + 0.095) / 0.0009;

            // KQ more to do
            pressureMilliBars = pins.analogReadPin(AnalogPin.P1);
            externalTemp = pins.analogReadPin(AnalogPin.P0);
            metersAboveSeaLevel = -1;


            let dataToSend: string = externalTemp + ";" +
                pressureMilliBars + ";" +
                metersAboveSeaLevel + ";" +
                input.temperature() + ";" +
                input.acceleration(Dimension.X) + ";" +
                input.acceleration(Dimension.Y) + ";" +
                input.acceleration(Dimension.Z) + ";" +
                input.acceleration(Dimension.Strength) + ";" +
                input.lightLevel() + ";" +
                input.rotation(Rotation.Pitch) + ";" +
                input.rotation(Rotation.Roll) + ";" +
                input.magneticForce(Dimension.Strength) + ";" +
                input.logoIsPressed() + ";" +
                input.soundLevel();


            serial.writeLine(dataToSend);
            showLed();
            basic.pause(500);


        }
        else {
            basic.showString("Error - Please set up transmission");

        }

    }

    function showLed() {
        if (sendingDot == 1) {
            basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        # . . . .
                        `
            );
        }
        if (sendingDot == 2) {
            basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        . # . . .
                        `
            );
        }
        if (sendingDot == 3) {
            basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        . . # . .
                        `
            );
        }
        if (sendingDot == 4) {
            basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . # .
                        `
            );
        }
        if (sendingDot == 5) {
            basic.showLeds(`
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . .
                        . . . . #
                        `
            );
        }


        sendingDot += 1;
        if (sendingDot > 5) {
            sendingDot = 1;
        }



    }



}