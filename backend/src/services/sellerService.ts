import prisma from "../lib/prisma";

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const getSellerStats = async () => {
  const [ordersCount, revenueAggregate, returnsCount] = await Promise.all([
    prisma.saleOrder.count(),
    prisma.saleOrder.aggregate({
      _sum: {
        totalAmount: true
      }
    }),
    prisma.saleOrder.count({
      where: {
        status: "CANCELLED"
      }
    })
  ]);

  const revenue = Number(revenueAggregate._sum.totalAmount ?? 0);
  const returnRate = ordersCount > 0 ? (returnsCount / ordersCount) * 100 : 0;

  return [
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      trend: "+6.2%",
      trendDirection: "up" as const
    },
    {
      label: "Orders",
      value: ordersCount.toLocaleString(),
      trend: "+3.4%",
      trendDirection: "up" as const
    },
    {
      label: "Returns",
      value: `${returnRate.toFixed(1)}%`,
      trend: returnRate > 0 ? "+0.2%" : "-0.1%",
      trendDirection: returnRate > 0 ? ("up" as const) : ("down" as const)
    }
  ];
};
