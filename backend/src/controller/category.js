const Category = require("../models/category.js");
const slugify = require("slugify");
const shortid = require("shortid");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      type: cate.type,
      parentId: cate.parentId,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  };

  if (req.file) {
    categoryObj.categoryImage =
      process.env.API + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });
    if (categories) {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategory = async (req, res) => {
  try {
    const { _id, name, parentId, type } = req.body;

    if (name instanceof Array) {
      if (
        !_id ||
        !type ||
        _id.length !== name.length ||
        type.length !== name.length
      ) {
        return res.status(400).json({ error: "Datos inconsistentes" });
      }

      const updatePromises = name.map((nameItem, i) => {
        const category = {
          name: nameItem,
          type: type[i],
          slug: slugify(nameItem),
        };

        if (parentId && parentId[i] && parentId[i] !== "") {
          category.parentId = parentId[i];
        }

        return Category.findOneAndUpdate({ _id: _id[i] }, category, {
          new: true,
          runValidators: true,
        });
      });

      const updatedCategories = await Promise.all(updatePromises);
      res.status(200).json({ updatedCategories });
    } else {
      const category = {
        name,
        type,
        slug: slugify(name),
      };

      if (parentId && parentId !== "") {
        category.parentId = parentId;
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id },
        category,
        { new: true, runValidators: true }
      );

      res.status(200).json({ updatedCategory });
    }
  } catch (error) {
    console.error("Error updating categories:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.deleteCategories = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({
      _id: ids[i]._id,
    });
    deletedCategories.push(deleteCategory);
  }

  if (deletedCategories.length == ids.length) {
    res.status(200).json({
      message: "Categories removed",
    });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};
