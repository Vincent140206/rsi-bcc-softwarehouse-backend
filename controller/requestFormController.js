const RequestProjectData = require('../models/requestProjectData');

const requestFormController = {
  submitRequest: async (projectData, res) => {
    try {
      const result = await requestFormController.saveRequestData(projectData);
      res.status(200).json({ 
        success: true, 
        message: "Request Berhasil Disimpan", 
        data: result 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Gagal menyimpan data" });
    }
  },

  saveRequestData: async (projectData) => {
    const result = await RequestProjectData.create({
      userId: projectData.userId,
      projectName: projectData.projectName,
      projectDescription: projectData.projectDescription,
      clientName: projectData.clientName,
      budget: projectData.budget,
      deadline: projectData.deadline,
      status: projectData.status || 'pending'
    });
    return result;
  }
};

module.exports = requestFormController;
