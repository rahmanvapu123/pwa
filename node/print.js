const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const electron = typeof process !== 'undefined' && process.versions && !!process.versions.electron;

let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'printer:Send To OneNote 2013',//enter the printer name
    driver: require(electron ? 'electron-printer' : 'printer')
});
async function printReceipt() {
    try {
        // Check if printer is connected
        let isConnected = await printer.isPrinterConnected();
        if (!isConnected) {
            throw new Error("Printer is not connected or unavailable.");
        }

        printer.alignCenter();
        printer.println("Hello, Thermal Printer!");
        printer.cut();

        let executed = await printer.execute();
        console.log("Print successful:", executed);
    } catch (error) {
        console.error("Printing failed:", error.message);
    }
}

printReceipt();
