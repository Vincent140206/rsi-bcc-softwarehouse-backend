const RequestProjectData = require("../models/requestProjectData");
const Payment = require("../models/Payment");
const sequelize = require("../config/db");

exports.updateStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, analyzed_by, analysis_notes } = req.body;

    console.log("Incoming updateStatus request:", {
      requestId,
      status,
      analyzed_by,
      analysis_notes,
    });

    const project = await RequestProjectData.findByPk(requestId);
    if (!project) {
      console.log("Project not found for requestId:", requestId);
      return res
        .status(404)
        .json({ success: false, message: "Project tidak ditemukan" });
    }

    const normalizedStatus = status?.trim().toLowerCase();
    console.log("Normalized status:", normalizedStatus);

    await sequelize.transaction(async (t) => {
      project.status = status;
      project.analyzed_by = analyzed_by;
      project.analysis_notes = analysis_notes;
      await project.save({ transaction: t });
      
      console.log("Project updated successfully:", project.status);

      if (normalizedStatus === "Approved") {
        const existingPayment = await Payment.findOne({
          where: { requestId: project.requestId },
          transaction: t
        });

        if (!existingPayment) {
          const newPayment = await Payment.create(
            { 
              requestId: project.requestId, 
              fileUrl: null, 
              status: "Pending" 
            },
            { transaction: t }
          );
          console.log("Payment successfully created:", newPayment.toJSON());
        } else {
          console.log("Payment already exists for this request");
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Status project diperbarui",
      data: project,
    });
  } catch (error) {
    console.error("Error updateProjectStatus:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status project",
      error: error.message,
    });
  }
};