const mongoose = require('mongoose');
const { categoryType } = require('../config/categoryType');
const { toJSON, paginate } = require('./plugins');
const slugify = require('slugify');
const { normalizeVietnamese } = require('../utils/nomalizeText');

/** @typedef {import("mongoose").Schema} Schema */

/** @type {Schema} */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(categoryType),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

categorySchema.statics.isSlugTaken = async function (slug) {
  const category = await this.findOne({ slug });
  return !!category;
};

categorySchema.pre('save', async function (next) {
  if (!this.slug) {
    const name = normalizeVietnamese(this.name)
    this.slug = slugify(name, { lower: true });
    const isSlugTaken = await Category.isSlugTaken(this.slug);
    if (isSlugTaken) {
      this.slug = `${this.slug}-${this._id}`;
    }
  }


  next();
});

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
