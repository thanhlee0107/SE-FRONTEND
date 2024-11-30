const dbPrinting = require("./dbPrinting");
const modulePrinter = require("../printer_management/printer.model");
const dbFile = require("../file/dbFile");
const userService = require("../user/user.model");
const printerService = require("../printer_management/printer.model");
// Lưu trữ hàng đợi công việc cho từng máy in
const printerQueues = {};

async function simulatePrintTask(IDPrinter, task) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Máy in ${IDPrinter}: Đang in tài liệu "${task.IDFile}" với số lượng ${task.Amount}, kích thước ${task.Size} và màu ${task.Color}`
      );
      resolve();
    }, 5000); // Giả lập thời gian in là 5 giây cho mỗi công việc
  });
}

async function processPrinterQueue(IDPrinter) {
  if (!printerQueues[IDPrinter]) {
    printerQueues[IDPrinter] = []; // Khởi tạo hàng đợi nếu chưa tồn tại
  }
  // tạm thời sẽ để là vòng lặp vô tận, khi có table printMachine để biết được máy này đang bật hay đang tắt thì sẽ tính tiếp
  let printers = await modulePrinter.getAllPrinters();

  let activePrinters = printers.filter(
    (printer) => printer.Status === "online"
  );

  let mapPrinter = new Map(
    activePrinters.map((printer) => [printer.ID, printer])
  );

  while (true && (mapPrinter.has(IDPrinter)||printerQueues[IDPrinter].length>0)) {
    if (printerQueues[IDPrinter].length > 0) {
      const task = printerQueues[IDPrinter].shift(); // Lấy công việc đầu tiên trong hàng đợi
      console.log(`Máy in ${IDPrinter}: Bắt đầu in - ${task.IDFile}`);
      await simulatePrintTask(IDPrinter, task); // Giả lập công việc in
      await dbPrinting.updatePrintStatus(
        task.IDFile,
        IDPrinter,
        task.Amount,
        task.Date,
        "Completed"
      );
      await printerService.updateprintwaiting(IDPrinter, -1); // cập nhật lại hàng đợi của máy in
    } else {
      console.log(`Máy in ${IDPrinter}: Không có công việc, chờ...`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Chờ 20 giây trước khi kiểm tra lại hàng đợi
    }

    printers = await modulePrinter.getAllPrinters();
    activePrinters = printers.filter((printer) => printer.Status === "online");
    mapPrinter = new Map(
      activePrinters.map((printer) => [printer.ID, printer])
    );
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// khởi tạo giả lập máy in cho từng máy
let prevPrinter = [];
exports.startPrinters = async () => {
  while (true) {
    const printers = await modulePrinter.getAllPrinters();

    const activePrinters = printers.filter(
      (printer) => printer.Status === "online"
    ); // Assuming 'enabled' is a property
    const numPrinters = activePrinters.length;

    const prevPrinterMap = new Map(
      prevPrinter.map((printer) => [printer.ID, printer])
    );

    for (let i = 0; i < numPrinters; ++i) {
      if (prevPrinter.length > 0) {
        if (prevPrinterMap.has(activePrinters[i].ID)) continue;
      }
      processPrinterQueue(activePrinters[i].ID);
    }

    await delay(5000);
    prevPrinter = activePrinters;
  }
};

// Hàm thêm công việc in vào hàng đợi của một máy in
const addPrinterJob = async (IDUser, IDFile, req) => {
  try {
    const { IDPrinter, Amount, Size, Color } = req;

    const printDate = new Date();
    task = {
      IDUser: IDUser,
      IDFile: IDFile,
      Amount: Amount,
      Date: printDate,
      Size: Size,
      Color: Color,
    };
    if (!printerQueues[IDPrinter]) {
      printerQueues[IDPrinter] = []; // Khởi tạo hàng đợi nếu chưa tồn tại
    }
    printerQueues[IDPrinter].push(task);

    await dbPrinting.insertPrintStatus(
      IDFile,
      IDPrinter,
      Amount,
      printDate,
      "Waiting"
    );

    console.log(
      `Yêu cầu in "${task}" đã được thêm vào hàng đợi của máy in ${IDPrinter}`
    );
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu in:", error.message);
    throw new Error(error);
  }
};

exports.handlePrintingRequest = async (MSSV,IDUser, req) => {
  try {
    const { IDPrinter, Name, Type, Amount, Size, Color } = req;

    // Kiểm tra thông tin đầu vào
    if (!IDPrinter || !Name || !Type || !Amount || !Size || !Color) {
      console.error("Thiếu thông tin, không thể thêm công việc vào hàng đợi.");
      throw new Error(
        "Thiếu thông tin, không thể thêm công việc vào hàng đợi."
      );
    }
    //Chỗ này sẽ bổ sung sau các hàm check điều kiện xem coi tài khoản của người dùng có đủ giấy có size và số lượng theo yêu cầu hay không;
    let isValid = true;
    const result = await userService.getPageBalanceByMSSV(MSSV);
    const pageBalance = result.pageBalance;
    if (pageBalance < Amount) {
      isValid = false;
      throw new Error("Tài khoản này Không đủ giấy để thực hiện yêu cầu in");
    }
    //---------------------------------------------------------------------------------------------
    if (isValid) {
      let IDFile = await dbFile.checkAndInsertFile(Name, Type, Size, Color);
      //update thông tin vào database
      await dbPrinting.checkAndInsertPrinting(IDFile, IDPrinter, IDUser);
      await addPrinterJob(IDUser, IDFile, req);
      await userService.updatePageBalanceById(task.IDUser, -task.Amount); //tiến hành trừ vào pageBalance của students
      await printerService.updateprintwaiting(IDPrinter, 1); // cập nhật lại hàng đợi của máy in
    } else {
      throw new Error("Tài khoản này Không đủ giấy để thực hiện yêu cầu in");
    }
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu in:", error.message);
    throw new Error(error);
  }
};
