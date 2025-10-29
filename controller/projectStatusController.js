const RequestProjectData = require("../models/requestProjectData");
const Payment = require("../models/Payment");
const sequelize = require("../config/db");
const fs = require('fs');

function debugLog(message, data = {}) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${JSON.stringify(data)}\n`;
  
  try {
    fs.appendFileSync('./payment-debug.log', logMessage);
  } catch (err) {
    console.error('Failed to write log:', err.message);
  }
  
  console.log(`[${timestamp}] ${message}`, data);
}

exports.updateStatus = async (req, res) => {
  let transaction;
  
  try {
    const { requestId } = req.params;
    const { status, analyzed_by, analysis_notes } = req.body;

    debugLog("START updateStatus", { requestId, status, analyzed_by });

    const project = await RequestProjectData.findByPk(requestId);
    
    if (!project) {
      debugLog("ERROR: Project not found", { requestId });
      return res.status(404).json({ 
        success: false, 
        message: "Project tidak ditemukan" 
      });
    }

    debugLog("SUCCESS: Project found", {
      id: project.id,
      requestId: project.requestId,
      currentStatus: project.status
    });

    const normalizedStatus = status?.trim().toLowerCase();
    
    debugLog("INFO: Status normalized", {
      original: status,
      normalized: normalizedStatus,
      isApproved: normalizedStatus === "approved"
    });

    transaction = await sequelize.transaction();
    debugLog("INFO: Transaction started", { 
      isolationLevel: transaction.options.isolationLevel 
    });

    project.status = status;
    project.analyzed_by = analyzed_by;
    project.analysis_notes = analysis_notes;
    
    await project.save({ transaction });
    
    debugLog("SUCCESS: Project updated", { 
      newStatus: project.status,
      analyzedBy: project.analyzed_by
    });

    let paymentResult = null;
    let paymentCreated = false;

    if (normalizedStatus === "Approved") {
      debugLog("INFO: Status approved - checking payment");

      const existingPayment = await Payment.findOne({
        where: { requestId: project.requestId },
        transaction
      });

      if (existingPayment) {
        debugLog("WARNING: Payment already exists", {
          paymentId: existingPayment.paymentId,
          status: existingPayment.status
        });
        paymentResult = existingPayment;
        paymentCreated = false;
      } else {
        debugLog("INFO: Creating new payment", { requestId: project.requestId });

        const paymentData = {
          requestId: project.requestId,
          fileUrl: null,
          status: "Pending",
          uploadedBy: null,
          uploadedAt: new Date(),
          validatedBy: null,
          validatedAt: null
        };

        debugLog("INFO: Payment data prepared", paymentData);

        const newPayment = await Payment.create(paymentData, { 
          transaction,
          logging: (sql) => debugLog("SQL EXECUTED", { sql })
        });

        debugLog("SUCCESS: Payment created", {
          paymentId: newPayment.paymentId,
          requestId: newPayment.requestId,
          status: newPayment.status
        });

        paymentResult = newPayment;
        paymentCreated = true;
      }
    } else {
      debugLog("INFO: Status not approved, skipping payment", { 
        status: normalizedStatus 
      });
    }

    debugLog("INFO: Committing transaction");
    await transaction.commit();
    debugLog("SUCCESS: Transaction committed");

    const responseData = {
      success: true,
      message: "Status project diperbarui",
      data: {
        project: {
          id: project.id,
          requestId: project.requestId,
          status: project.status,
          analyzed_by: project.analyzed_by
        },
        payment: paymentResult ? {
          paymentId: paymentResult.paymentId,
          requestId: paymentResult.requestId,
          status: paymentResult.status,
          uploadedAt: paymentResult.uploadedAt
        } : null,
        paymentCreated: paymentCreated
      }
    };

    debugLog("SUCCESS: Sending response", { 
      paymentCreated,
      hasPayment: !!paymentResult 
    });

    res.status(200).json(responseData);

  } catch (error) {
    debugLog("ERROR: Exception caught", {
      message: error.message,
      name: error.name,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });

    if (transaction) {
      try {
        debugLog("INFO: Rolling back transaction");
        await transaction.rollback();
        debugLog("SUCCESS: Transaction rolled back");
      } catch (rollbackError) {
        debugLog("ERROR: Rollback failed", { 
          error: rollbackError.message 
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui status project",
      error: error.message
    });
  }
};