const { Project, Progress, Member } = require('../models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.addProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: Member,
          as: 'members',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newProgress = await Progress.create({
      projectId,
      title,
      description,
      status
    });

    for (const member of project.members) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: member.email,
        subject: `Update Progress Project: ${project.name}`,
        html: `
          <h3>Hai ${member.name},</h3>
          <p>Progress baru telah ditambahkan pada proyek <b>${project.name}</b>:</p>
          <ul>
            <li><b>Judul:</b> ${title}</li>
            <li><b>Deskripsi:</b> ${description}</li>
            <li><b>Status:</b> ${status}</li>
          </ul>
          <p>Silakan cek dashboard untuk informasi lebih lanjut.</p>
          <hr>
          <small>Notifikasi otomatis dari sistem project management</small>
        `
      });
    }

    res.status(201).json({
      message: 'Progress added and emails sent to all project members',
      progress: newProgress
    });
  } catch (error) {
    console.error('Error adding progress and sending email:', error);
    res.status(500).json({
      error: 'Failed to add progress or send email',
      details: error.message
    });
  }
};

exports.getProjectWithProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [{ model: Progress, as: 'progressList' }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project progress:', error);
    res.status(500).json({
      message: 'Failed to fetch project progress',
      details: error.message
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Progress, as: 'progressList' }]
    });

    res.status(200).json({
      message: 'Projects fetched successfully',
      data: projects,
      count: projects.length
    });
    
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({
      message: 'Failed to fetch all projects',
      details: error.message
    });
  }
};