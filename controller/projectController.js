const { Project, Progress } = require('../models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const progress = await Project.findByPk(id, { include: { model: Progress, as: 'progressList' } });
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    await progress.update({
      title: title || progress.title,
      description: description || progress.description,
      status: status || progress.status,
      updatedAt: new Date()
    });

    const project = progress.project;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL || 'admin@example.com',
      subject: `Update Progress: ${project.id}`,
      html: `
        <h3>Progress Update</h3>
        <p><b>Project:</b> ${project.id}</p>
        <p><b>Title:</b> ${progress.title}</p>
        <p><b>Description:</b> ${progress.description}</p>
        <p><b>Status:</b> ${progress.status}</p>
        <p><b>Updated At:</b> ${progress.updatedAt}</p>
      `
    });

    res.status(200).json({
      message: 'Progress updated and email sent successfully',
      updatedProgress: progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      error: 'Failed to update progress',
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