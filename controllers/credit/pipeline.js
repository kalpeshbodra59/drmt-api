exports.getAllCreditsPipeline = ({ workerId }) => {
  return [
    {
      $project: {
        date: 1,
        credit: 1,
        workerId: 1,
        price: 1,
        _id: 1,
      },
    },
    {
      $match: {
        workerId: workerId,
      },
    },
    {
      $group: {
        _id: {
          workerId: "$workerId",
        },
        allData: {
          $push: {
            id: "$_id",
            date: "$date",
            credit: "$credit",
            price: "$price",
          },
        },
        total: {
          $sum: "$price",
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $project: {
        _id: 0,
        allData: 1,
        total: 1,
      },
    },
  ];
};
