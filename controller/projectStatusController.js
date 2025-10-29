const RequestProjectData = require("../models/requestProjectData");
const Payment = require("../models/Payment");
const sequelize = require("../config/db");
const fs = require('fs');

function debugLog(message, data = {}) {
  const logMessage = `[${new Date().toISOString()}] ${message} ${JSON.stringify(data)}\n`;
  fs.appendFileSync('./payment-debug.log', logMessage);
  console.log(message, data);
}

exports.updateStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, analyzed_by, analysis_notes } = req.body;

    debugLog("🟦 START updateStatus", { requestId, status });

    const project = await RequestProjectData.findByPk(requestId);
    
    if (!project) {
      debugLog("❌ Project not found", { requestId });
      return res.status(404).json({ 
        success: false, 
        message: "Project tidak ditemukan" 
      });
    }

    debugLog("✅ Project found", {
      projectId: project.id,
      projectRequestId: project.requestId,
      currentStatus: project.status
    });

    const normalizedStatus = status?.trim().toLowerCase();
    
    debugLog("🔄 Status info", {
      originalStatus: status,
      normalizedStatus,
      isApproved: normalizedStatus === "approved"
    });

    const result = await sequelize.transaction(async (t) => {
      debugLog("🔵 Transaction started");

      project.status = status;
      project.analyzed_by = analyzed_by;
      project.analysis_notes = analysis_notes;
      await project.save({ transaction: t });
      
      debugLog("✅ Project updated", { 
        status: project.status 
      });

      if (normalizedStatus === "approved") {
        debugLog("🟢 Creating payment for approved status");

        const existingPayment = await Payment.findOne({
          where: { requestId: project.requestId },
          transaction: t
        });

        debugLog("🔍 Existing payment check", {
          exists: !!existingPayment
        });

        if (!existingPayment) {
          debugLog("🟡 Attempting payment creation", {
            requestId: project.requestId,
            status: "Pending"
          });

          const paymentData = {
            requestId: project.requestId,
            fileUrl: null,
            status: "Pending",
            uploadedBy: null,
            uploadedAt: new Date(),
            validatedBy: null,
            validatedAt: null
          };

          debugLog("📝 Payment data prepared", paymentData);

          const newPayment = await Payment.create(paymentData, { 
            transaction: t,
            logging: (sql) => debugLog("SQL executed", { sql })
          });
          
          debugLog("💳✅ Payment created", {
            paymentId: newPayment.paymentId,
            requestId: newPayment.requestId,
            status: newPayment.status
          });

          return { project, payment: newPayment, created: true };
        } else {
          debugLog("⚠️ Payment already exists", {
            paymentId: existingPayment.paymentId
          });
          return { project, payment: existingPayment, created: false };
        }
      } else {
        debugLog("⏭️ Status not approved, skip payment", {
          status: normalizedStatus
        });
        return { project, payment: null, created: false };
      }
    });

    debugLog("🟢 Transaction committed", {
      paymentCreated: result.created
    });

    res.status(200).json({
      success: true,
      message: "Status project diperbarui",
      data: {
        project: project,
        payment: result.payment,
        paymentCreated: result.created
      }
    });

  } catch (error) {
    debugLog("❌ ERROR", {
      message: error.message,
      name: error.name,
      code: error.code,
      sql: error.sql,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status project",
      error: error.message,
    });
  }
};