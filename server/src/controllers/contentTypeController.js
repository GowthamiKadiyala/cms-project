const contentTypeService = require("../services/contentTypeService");

const createType = async (req, res) => {
  try {
    const { name, fields } = req.body;
    // Basic validation
    if (!name || !fields)
      return res.status(400).json({ error: "Missing name or fields" });

    const newType = await contentTypeService.createType(name, fields);
    res.status(201).json(newType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getTypes = async (req, res) => {
  try {
    const types = await contentTypeService.getAllTypes();
    res.status(200).json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createType, getTypes };
