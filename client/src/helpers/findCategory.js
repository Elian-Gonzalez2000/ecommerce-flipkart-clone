export const findCategory = (data, key, value, needParent = false) => {
  function search(categories, parentCategory = null) {
    for (const category of categories) {
      if (category[key] === value) {
        if (needParent) {
          return { category, parentCategory };
        }
        return category;
      }

      if (category.children.length > 0) {
        const result = search(category.children, category);
        if (result) return result;
      }
    }
    return null;
  }
  return search(data);
};
