const dbPrinting = require("./dbPrinting");
const modulePrinter = require("../printer_management/printer.model");
const dbFile = require("../file/dbFile");
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
  while (true) {
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
    } else {
      console.log(`Máy in ${IDPrinter}: Không có công việc, chờ...`);
      await new Promise((resolve) => setTimeout(resolve, 20000)); // Chờ 20 giây trước khi kiểm tra lại hàng đợi
    }
  }
}

// khởi tạo giả lập máy in cho từng máy
exports.startPrinters = async () => {
  const printers = await modulePrinter.getAllPrinters();
  const numPrinters = printers.length;
  for (i = 0; i < numPrinters; ++i) {
    processPrinterQueue(printers[i].ID);
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

exports.handlePrintingRequest = async (IDUser, req) => {
  try {
    const { IDPrinter, Name, Type, Amount, Size, Color } = req;

    // Kiểm tra thông tin đầu vào
    if (!IDPrinter || !Name || !Type || !Amount || !Size || !Color) {
      console.error("Thiếu thông tin, không thể thêm công việc vào hàng đợi.");
      throw new Error("Thiếu thông tin, không thể thêm công việc vào hàng đợi.");
    }
    //Chỗ này sẽ bổ sung sau các hàm check điều kiện xem coi tài khoản của người dùng có đủ giấy có size và số lượng theo yêu cầu hay không;
    const isValid = true;
    
    //---------------------------------------------------------------------------------------------

    if (isValid) {
        IDFile = await dbFile.checkAndInsertFile(Name, Type, Size, Color);
        //update thông tin vào database
        await dbPrinting.checkAndInsertPrinting(IDFile, IDPrinter, IDUser);
        await addPrinterJob(IDUser, IDFile, req);
    } else {
      throw new Error("Điều kiện không đủ để in yêu cầu này");
    }
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu in:", error.message);
    throw new Error(error);
  }
};
