/**
 *      CSinc Cansat extension
 *      V1.34
 *      Developed by CSinc
 * 
 * 
 *      Notes (Reserved Pins):
 *      ------------------------------------------------------
 *      Pin 0   -   Analogue in - External Temperature Sensor
 *      Pin 1   -   Analogue in - External Pressure Sensor
 *      Pin 13  -   Tx              APC220
 *      Pin 14  -   Rx              APC220
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

        serial.redirect(tx, rx, BaudRate.BaudRate9600);
        setUpSerial = true;
    }

    //% block
    export function transmitViaApc220() {
        // Tx is the first parameter, and Rx the second.
        // Default Baudrate is 115,200 and is set statically.
        let tx = SerialPin.P13
        let rx = SerialPin.P14

        serial.redirect(tx, rx, BaudRate.BaudRate9600);
        setUpSerial = true;

    }

    //% block
    export function sendCansatDataV1() {

        if (setUpSerial) {
            pressureMilliBars = getExternalPressure();
            metersAboveSeaLevel = getAltitude(pressureMilliBars);
            externalTemp = getExternalTemperature();


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
                "NA_V1" + ";" +
                "NA_V1";


            serial.writeLine(dataToSend);
            showLed();
            basic.pause(100);




        }
        else {
            basic.showString("Error - Please set up transmission");

        }

    }


    //% block
    export function sendCansatDataV2() {

        if (setUpSerial) {

            pressureMilliBars = getExternalPressure();
            metersAboveSeaLevel = getAltitude(pressureMilliBars);
            externalTemp = getExternalTemperature();
            


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
            basic.pause(100);

        }
        else {
            basic.showString("Error - Please set up transmission");

        }

    }

    function getExternalPressure(){
        // Calibration based on formula in https://esero.ie/wp-content/uploads/2018/12/CanSat-UserManual-2019.pdf
        let mb = ((pins.analogReadPin(AnalogPin.P1) / 1024) + 0.095) / 0.0009;
        return mb;
    }

    function getExternalTemperature(){
        let tempAI = pins.analogReadPin(AnalogPin.P0);
        // below calculation taken from https://youtu.be/JQ8HjkRuTCY
        let temp = ((tempAI * (3.0 / 1023))*(-16.573)) + 51.702;
        return temp;
    }

    function getAltitude(pressureMilliBars: number){
        let alt = pressureMilliBars;


        return alt;

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