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

    debugLog("🟦 START updateStatus", {
      requestId,
      status,
      analyzed_by,
      hasAnalysisNotes: !!analysis_notes,
    });

    const project = await RequestProjectData.findByPk(requestId);
    
    if (!project) {
      debugLog("❌ Project not found", { requestId });
      return res
        .status(404)
        .json({ success: false, message: "Project tidak ditemukan" });
    }

    debugLog("✅ Project found", {
      projectId: project.id,
      currentStatus: project.status,
      requestId: project.requestId
    });

    const normalizedStatus = status?.trim().toLowerCase();
    debugLog("🔄 Status comparison", {
      originalStatus: status,
      normalizedStatus: normalizedStatus,
      isApproved: normalizedStatus === "approved",
      willCreatePayment: normalizedStatus === "approved"
    });

    const result = await sequelize.transaction(async (t) => {
      debugLog("🔵 Transaction started", {});

      project.status = status;
      project.analyzed_by = analyzed_by;
      project.analysis_notes = analysis_notes;
      await project.save({ transaction: t });
      
      debugLog("✅ Project saved", { 
        newStatus: project.status,
        analyzedBy: project.analyzed_by 
      });

      if (normalizedStatus === "approved") {
        debugLog("🟢 Approved status detected - checking for existing payment", {});

        const existingPayment = await Payment.findOne({
          where: { requestId: project.requestId },
          transaction: t
        });

        debugLog("🔍 Existing payment check", {
          exists: !!existingPayment,
          paymentData: existingPayment ? existingPayment.toJSON() : null
        });

        if (!existingPayment) {
          debugLog("🟡 Creating new payment...", {
            requestId: project.requestId
          });

          try {
            const newPayment = await Payment.create(
              { 
                requestId: project.requestId, 
                fileUrl: null, 
                status: "Pending" 
              },
              { transaction: t }
            );
            
            debugLog("💳✅ Payment created successfully", {
              paymentId: newPayment.id,
              paymentRequestId: newPayment.requestId,
              paymentStatus: newPayment.status,
              fullPayment: newPayment.toJSON()
            });

            return { project, payment: newPayment, created: true };
          } catch (paymentError) {
            debugLog("❌ Payment creation failed", {
              error: paymentError.message,
              stack: paymentError.stack,
              name: paymentError.name
            });
            throw paymentError;
          }
        } else {
          debugLog("⚠️ Payment already exists", {
            paymentId: existingPayment.id
          });
          return { project, payment: existingPayment, created: false };
        }
      } else {
        debugLog("⏭️ Status not approved, skipping payment creation", {
          status: normalizedStatus
        });
        return { project, payment: null, created: false };
      }
    });

    debugLog("🟢 Transaction committed successfully", {
      paymentCreated: result.created,
      hasPayment: !!result.payment
    });

    res.status(200).json({
      success: true,
      message: "Status project diperbarui",
      data: project,
      paymentCreated: result.created,
      payment: result.payment
    });

  } catch (error) {
    debugLog("❌ ERROR in updateStatus", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status project",
      error: error.message,
    });
  }
};