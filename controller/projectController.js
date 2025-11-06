const { Project, Progress } = require('../models');
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

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newProgress = await Progress.create({
      projectId,
      title,
      description,
      status
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || 'admin@example.com',
      subject: `Progress Baru untuk Project #${projectId}`,
      html: `
        <h3>Progress Baru Ditambahkan</h3>
        <p><b>Project:</b> ${project.name}</p>
        <p><b>Title:</b> ${title}</p>
        <p><b>Description:</b> ${description}</p>
        <p><b>Status:</b> ${status}</p>
      `
    });

    res.status(201).json({
      message: 'Progress added and email sent successfully',
      progress: newProgress
    });
  } catch (error) {
    console.error('Error adding progress:', error);
    res.status(500).json({ error: 'Failed to add progress', details: error.message });
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