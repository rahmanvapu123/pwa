const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "printer:Your_Printer_Name"
});

async function printReceipt() {
    printer.alignCenter();
    printer.println("Hello, Thermal Printer!");
    printer.cut();
    let executed = await printer.execute();
    console.log("Print successful:", executed);
}

printReceipt();
