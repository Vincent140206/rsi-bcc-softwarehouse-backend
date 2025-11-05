const Assignment = require('../models/Assignment');
const { Member } = require('../models');
const transporter = require('../config/email');
const sequelize = require('../config/db');
const Notification = require('../models/Notification');
const { ProjectMembers } = require('../models');
const { Project } = require('../models');

const createAssignmentEmailTemplate = (member, projectId, role) => {
  return {
    from: process.env.EMAIL_USER,
    to: member.email,
    subject: `🎯 Penugasan Baru: ${member.role} - Proyek ${projectId}`,
    html: generateEmailHTML(member, projectId, role),
    text: generateEmailText(member, projectId, role)
  };
};

const generateEmailHTML = (member, projectId, role) => {
  const dashboardUrl = process.env.DASHBOARD_URL || 'https://pg-vincent.bccdev.id/rsi/login';
  const assignmentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .info-box {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 15px 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-box p {
          margin: 8px 0;
        }
        .info-box strong {
          color: #667eea;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: 600;
          text-align: center;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #eee;
        }
        .divider {
          height: 1px;
          background: #eee;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Penugasan Proyek Baru</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Halo <strong>${member.name}</strong>,</p>
          
          <p>Selamat! Anda telah ditugaskan dalam proyek baru. Berikut adalah detail penugasan Anda:</p>
          
          <div class="info-box">
            <p><strong>ID Proyek:</strong> ${projectId}</p>
            <p><strong>Role Anda:</strong> ${member.role}</p>
            <p><strong>Tanggal Penugasan:</strong> ${assignmentDate}</p>
          </div>
          
          <p>Silakan segera akses dashboard Anda untuk melihat detail proyek, timeline, dan deliverables yang menjadi tanggung jawab Anda.</p>
          
          <center>
            <a href="${dashboardUrl}" class="cta-button">
              Buka Dashboard
            </a>
          </center>
          
          <div class="divider"></div>
          
          <p style="font-size: 14px; color: #666;">
            💡 <strong>Tips:</strong> Jangan lupa untuk mengecek notifikasi rutin dan berkomunikasi dengan tim proyek Anda untuk memastikan kolaborasi yang efektif.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Tim Manajemen Proyek</strong></p>
          <p style="margin: 5px 0;">Jika ada pertanyaan, jangan ragu untuk menghubungi kami.</p>
          <p style="font-size: 12px; color: #999; margin-top: 15px;">
            Email ini dikirim secara otomatis, mohon tidak membalas email ini.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateEmailText = (member, projectId, role) => {
  const dashboardUrl = process.env.DASHBOARD_URL || 'https://bccfilkom.ub.ac.id/';
  const assignmentDate = new Date().toLocaleDateString('id-ID');

  return `Halo ${member.name},

Selamat! Anda telah ditugaskan dalam proyek baru.

Detail Penugasan:
- ID Proyek: ${projectId}
- Role Anda: ${role}
- Tanggal Penugasan: ${assignmentDate}

Silakan segera akses dashboard Anda untuk melihat detail proyek, timeline, dan deliverables yang menjadi tanggung jawab Anda.

Link Dashboard: ${dashboardUrl}

Terima kasih,
Tim Manajemen Proyek

---
Email ini dikirim secara otomatis, mohon tidak membalas email ini.`;
};

const sendAssignmentEmail = async (member, projectId, role) => {
  try {
    const mailOptions = createAssignmentEmailTemplate(member, projectId, role);
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send email to ${member.email}:`, error.message);
    return { success: false, error: error.message };
  }
};

exports.assignMembers = async (req, res) => {
  const { projectId, members } = req.body;

  if (!projectId || !members || !Array.isArray(members) || members.length === 0) {
    return res.status(400).json({
      error: 'Invalid input. projectId and members array are required.'
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const emailResults = [];

    for (const item of members) {
      if (!item.memberId) {
        throw new Error('Each member must have memberId specified');
      }

      const member = await Member.findOne({ where: { id: item.memberId } });
      if (!member) {
        throw new Error(`Member with ID ${item.memberId} not found`);
      }

      await ProjectMembers.create({
        projectId: projectId,
        memberId: member.id,
      }, { transaction });

      await Notification.create({
        memberId: member.id,
        message: `Member ${member.name} assigned to Project ID ${projectId}`
      }, { transaction });

      // await Notification.create({
      //   senderId: req.user?.id || 1,
      //   receiverId: member.id,
      //   projectId: projectId,
      //   message: `Anda telah ditugaskan ke proyek ID ${projectId} oleh ${req.user?.name || 'Admin'}`
      // }, { transaction });

      // await Notification.create({
      //   senderId: member.id,
      //   receiverId: req.user?.id || 1,
      //   projectId: projectId,
      //   message: `Member ${member.name} telah berhasil ditugaskan ke proyek ID ${projectId}`
      // }, { transaction });

      await member.update({ status: 'assigned' }, { transaction });

      const emailResult = await sendAssignmentEmail(member, projectId, item.role);
      emailResults.push({
        memberId: item.memberId,
        email: member.email,
        ...emailResult
      });
    }

    await transaction.commit();

    const failedEmails = emailResults.filter(result => !result.success);
    if (failedEmails.length > 0) {
      return res.status(207).json({
        message: 'Assignment completed but some emails failed to send',
        assignments: 'success',
        emailResults
      });
    }

    res.json({
      message: 'Assignment and email notifications completed successfully',
      emailResults
    });

  } catch (err) {
    await transaction.rollback();
    console.error('Assignment error:', err);
    res.status(500).json({
      error: 'Assignment failed',
      details: err.message
    });
  }
};

exports.getMemberProjects = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findByPk(memberId, {
      include: [
        {
          association: 'projects',
          through: { attributes: [] }
        }
      ]
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (member.projects.length === 0) {
      return res.status(404).json({ message: 'No projects assigned to this member' });
    }

    res.status(200).json(member.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch projects', details: error.message });
  }
};

exports.getAssignedMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const assignments = await Project.findAll({ where: { projectId } });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assigned members:', error);
    res.status(500).json({
      error: 'Failed to fetch assigned members',
      details: error.message
    });
  }
};