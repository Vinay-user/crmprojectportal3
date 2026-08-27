import {
  Activity,
  Building2,
  DollarSign,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import StatCard from "../../components/common/StatCard";

const revenueData = [
  {
    month: "Jan",
    revenue: 18000
  },
  {
    month: "Feb",
    revenue: 23000
  },
  {
    month: "Mar",
    revenue: 21000
  },
  {
    month: "Apr",
    revenue: 28000
  },
  {
    month: "May",
    revenue: 32000
  },
  {
    month: "Jun",
    revenue: 39000
  },
  {
    month: "Jul",
    revenue: 45000
  }
];

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Overview</h2>
          <p>
            Here's what's happening with
            your CRM today.
          </p>
        </div>

        <button className="primary-button">
          + Add Record
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value="1,248"
          change={12.5}
          icon={UserPlus}
          color="blue"
        />

        <StatCard
          title="Contacts"
          value="3,842"
          change={8.2}
          icon={Users}
          color="green"
        />

        <StatCard
          title="Companies"
          value="684"
          change={5.4}
          icon={Building2}
          color="purple"
        />

        <StatCard
          title="Revenue"
          value="$128,450"
          change={18.7}
          icon={DollarSign}
          color="orange"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Revenue Overview</h3>
              <p>
                Monthly revenue performance
              </p>
            </div>

            <TrendingUp
              size={20}
              className="green-text"
            />
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={revenueData}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2563eb"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#2563eb"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>
                Latest CRM activities
              </p>
            </div>

            <Activity size={20} />
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar blue">
                JD
              </div>

              <div>
                <strong>
                  John created a new deal
                </strong>

                <small>
                  Acme Corporation · 10m ago
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar green">
                AS
              </div>

              <div>
                <strong>
                  Sarah converted a lead
                </strong>

                <small>
                  Michael Johnson · 35m ago
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar purple">
                MK
              </div>

              <div>
                <strong>
                  Mike completed a task
                </strong>

                <small>
                  Follow up with client · 1h ago
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-avatar orange">
                RB
              </div>

              <div>
                <strong>
                  Rachel added a contact
                </strong>

                <small>
                  Global Industries · 2h ago
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}