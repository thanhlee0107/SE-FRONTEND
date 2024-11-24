const printinService = require("./printingService");

exports.printrequest = async (req, res) => {
  // const id = Number(req.params.id);
  const id = req.user.id;
  try {
    const result = await printinService.handlePrintingRequest(id, req.body);
    return res.status(200).json({ message: "Yêu cầu in thành công", result });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};
