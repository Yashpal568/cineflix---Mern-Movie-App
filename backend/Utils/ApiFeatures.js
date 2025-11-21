class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

   filter() {
  const queryObj = { ...this.queryStr };

  // Remove non-filter fields
  const removeFields = ["sort", "fields", "page", "limit", "q"];
  removeFields.forEach((f) => delete queryObj[f]);

  const mongoQuery = {};

  Object.keys(queryObj).forEach((key) => {
    const value = queryObj[key];

    // CASE 1: Bracket notation   ratings[gte]
    const match = key.match(/^(.+)\[(.+)\]$/);
    if (match) {
      const field = match[1];
      const operator = match[2]; // gte, lte, gt, lt

      if (!mongoQuery[field]) mongoQuery[field] = {};
      
      const num = Number(value);
      mongoQuery[field][`$${operator}`] = isNaN(num) ? value : num;
      return;
    }

    // CASE 2: Plain equality      releaseYear=2023
    const num = Number(value);
    mongoQuery[key] = isNaN(num) ? value : num;
  });

  this.query = this.query.find(mongoQuery);
  return this;
}


    // sort() {
    //     if (this.queryStr.sort) {
    //        // console.log(this.queryStr.sort)
    //         const sortBy = this.queryStr.sort.split(',').join(' ');
    //         this.query = this.query.sort(sortBy);
    //     } else {
    //         // Default sort by newest
    //         this.query = this.query.sort('-createdAt');
    //     }
    //     return this;
    // }

    sort() {
  if (this.queryStr.sort) {
    let sortBy;

    // ✅ Handle both string and array cases safely
    if (typeof this.queryStr.sort === 'string') {
      sortBy = this.queryStr.sort.split(',').join(' ');
    } else if (Array.isArray(this.queryStr.sort)) {
      sortBy = this.queryStr.sort.join(' ');
    } else {
      sortBy = '-createdAt';
    }

    this.query = this.query.sort(sortBy);
  } else {
    this.query = this.query.sort('-createdAt');
  }

  return this;
}


    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
