"use client";
import React from "react";
import { Grid, Typography, Card, CardContent, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import dynamic from "next/dynamic";
import { useGetTaskStatisticsQuery } from "@/lib/redux/features/api/apiSlice";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StatisticsPage = () => {
  const {
    data: statisticsData,
    isLoading,
    isError,
  } = useGetTaskStatisticsQuery();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error fetching statistics</Typography>;

  const stats = statisticsData?.data;

  // Pie Chart Options for Task Status
  const pieChartOptions = {
    labels: ["Completed Tasks", "Pending Tasks"],
    colors: ["#4CAF50", "#FFC107"],
  };

  const pieChartSeries = [
    stats?.completed_tasks || 0,
    stats?.total_tasks ? stats.total_tasks - stats.completed_tasks : 0,
  ];

  // Bar Chart Options for Task Types
  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Total", "Completed", "Pending", "Modified", "Deleted"],
    },
    colors: ["#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#F44336"],
  };

  const barChartSeries = [
    {
      name: "Tasks",
      data: [
        stats?.total_tasks || 0,
        stats?.completed_tasks || 0,
        stats?.total_tasks ? stats.total_tasks - stats.completed_tasks : 0,
        stats?.modified_tasks || 0,
        stats?.deleted_tasks || 0,
      ],
    },
  ];

  // Radial Chart Options for Task Completion Percentage
  const radialChartOptions = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            formatter: function (val: number) {
              return val.toFixed(1) + "%";
            },
          },
        },
      },
    },
    labels: ["Completion Rate"],
    colors: ["#4CAF50"],
  };

  const radialChartSeries = [
    stats?.total_tasks ? (stats.completed_tasks / stats.total_tasks) * 100 : 0,
  ];

  // Donut Chart Options for Task Modifications
  const donutChartOptions = {
    labels: ["Modified", "Deleted"],
    colors: ["#9C27B0", "#F44336"],
  };

  const donutChartSeries = [
    stats?.modified_tasks || 0,
    stats?.deleted_tasks || 0,
  ];

  return (
    <PageContainer
      title="Task Statistics"
      description="Comprehensive task analytics"
    >
      <Box>
        <Grid container spacing={3}>
          {/* Existing Pie Chart */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Task Completion Status
                </Typography>
                <Chart
                  options={pieChartOptions}
                  series={pieChartSeries}
                  type="pie"
                  height={350}
                  width={400}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Donut Chart for Modifications */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Task Modifications
                </Typography>
                <Chart
                  options={donutChartOptions}
                  series={donutChartSeries}
                  type="donut"
                  height={350}
                  width={400}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart for Task Types */}
          <Grid item xs={12} lg={"auto"}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Task Types Breakdown
                </Typography>
                <Chart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                  width={1200}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Radial Chart for Completion Rate */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Task Completion Rate
                </Typography>
                <Chart
                  options={radialChartOptions}
                  series={radialChartSeries}
                  type="radialBar"
                  height={350}
                  width={400}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default StatisticsPage;
