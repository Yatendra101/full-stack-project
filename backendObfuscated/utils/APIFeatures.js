class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering logic
  filter() {
    let queryObj = { ...this.queryString };
    let filterQuery = {};

    // Price filter
    if (queryObj.minPrice && queryObj.maxPrice) {
      filterQuery.price = {
        $gte: queryObj.minPrice,
        $lte: queryObj.maxPrice,
      };
    } else if (queryObj.minPrice) {
      filterQuery.price = { $gte: queryObj.minPrice };
    }

    // Property type filter
    if (queryObj.propertyType) {
      filterQuery.propertyType = { $in: queryObj.propertyType.split(",").map(type => type.trim().toLowerCase()) };
    }

    // Room type filter
    if (queryObj.roomType) {
      filterQuery.roomType = queryObj.roomType;
    }

    // Amenities filter
    if (queryObj.amenities) {
      filterQuery["amenities.name"] = { $all: queryObj.amenities };
    }

    // Guests filter
    if (queryObj.guests) {
      filterQuery.guests = { $gte: queryObj.guests };
    }

    this.query = this.query.find(filterQuery);
    return this;
  }

  // Search functionality
  search() {
    let queryObj = { ...this.queryString };
    let searchQuery = {};

    if (queryObj.city) {
      let searchValue = queryObj.city.trim().toLowerCase();
      searchQuery = {
        $or: [
          { "address.city": searchValue },
          { "address.state": searchValue },
          { "address.area": searchValue },
        ],
      };
    }

    this.query = this.query.find(searchQuery);
    return this;
  }

  // Pagination logic
  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 10;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

// ✅ Export as ES Module
export default APIFeatures;
