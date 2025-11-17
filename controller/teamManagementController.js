const Member = require('../models/Member');

exports.getMemberList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    const { count, rows } = await Member.findAndCountAll({
      where: { status: 'available' },
      limit,
      offset,
      order: [['id', 'ASC']]
    })

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No available members found' })
    }

    res.status(200).json({
      success: true,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
      data: rows
    })
  } catch (error) {
    console.error('Error in getMemberList:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}
