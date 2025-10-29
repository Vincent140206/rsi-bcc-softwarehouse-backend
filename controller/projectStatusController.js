const RequestProjectData = require("../models/requestProjectData");
const Payment = require("../models/Payment");

exports.updateStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, analyzed_by, analysis_notes } = req.body;

    console.log("Updating status for requestId:", requestId, "to:", status);

    const project = await RequestProjectData.findByPk(requestId);
    
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ 
        success: false, 
        message: "Project tidak ditemukan" 
      });
    }

    project.status = status;
    project.analyzed_by = analyzed_by;
    project.analysis_notes = analysis_notes;
    await project.save();

    console.log("Project updated successfully");

    let payment = null;
    if (status?.trim().toLowerCase() === 'approved') {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      payment = await Payment.findOne({
        where: { requestId: project.requestId }
      });
      
      if (payment) {
        console.log("Payment auto-created by trigger:", payment.paymentId);
      }
    }

    res.status(200).json({
      success: true,
      message: "Status project diperbarui",
      data: {
        project: project,
        payment: payment,
        paymentAutoCreated: !!payment
      }
    });

  } catch (error) {
    console.error("Error updateStatus:", error.message);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status project",
      error: error.message
    });
  }
};