exports.getAllDiamondsPipeline = ({ month, year, customerId }) => {
  const monthMatch =  month ? { $and: [{ month: month }, { year: year }] } : { year: year };
  return [
    {
      $project: {
        month: {
          $month: "$date",
        },
        year: {
          $year: "$date",
        },
        date: 1,
        lot_no: 1,
        total_diamond: 1,
        total_diamond_weight: 1,
        worked_diamond: 1,
        worked_diamond_weight: 1,
        percentage: 1,
        customerId: 1,
        _id: 1,
      },
    },
    {
      $match: {
        ...monthMatch,
        customerId,
      },
    },
    {
      $group: {
        _id: {
          date: "$date",
          lot_no: "$lot_no",
        },
        subData: {
          $push: {
            id: "$_id",
            totalD: "$total_diamond",
            totalDW: "$total_diamond_weight",
            workedD: "$worked_diamond",
            workedDW: "$worked_diamond_weight",
            percentage: "$percentage",
          },
        },
        totalDTotal: {
          $sum: "$total_diamond",
        },
        workedDTotal: {
          $sum: "$worked_diamond",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id.date",
        lNo: "$_id.lot_no",
        subData: 1,
        total: {
          totalDTotal: "$totalDTotal",
          workedDTotal: "$workedDTotal",
        },
      },
    },
  ];
};
