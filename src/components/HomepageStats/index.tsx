import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

type StatItem = {
  label: string;
  value: string;
  description: string;
};

const StatList: StatItem[] = [
  {
    label: 'Total Value Locked',
    value: 'Loading...',
    description: 'Total value locked in Curve protocols',
  },
  {
    label: 'Total Revenue Generated',
    value: 'Loading...',
    description: 'Total protocol revenue generated to date',
  },
  {
    label: 'Total Governance Votes',
    value: 'Loading...',
    description: 'Total number of governance votes',
  },
];

function Stat({label, value, description}: StatItem) {
  return (
    <div className={styles.statCard}>
      <h3 className={styles.statLabel}>{label}</h3>
      <div className={styles.statValue}>{value}</div>
      <p className={styles.statDescription}>{description}</p>
    </div>
  );
}

export default function HomepageStats(): React.ReactNode {
  const [stats, setStats] = useState(StatList);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Placeholder for TVL (replace with real endpoint if available)
        const mockData = {
          tvl: '$4.2B',
        };

        // Fetch total revenue from Curve API
        const revenueResponse = await fetch('https://api.curve.finance/api/getWeeklyFees');
        const revenueData = await revenueResponse.json();
        const totalRevenue = revenueData?.data?.totalFees?.fees ?? 0;
        const formattedRevenue = totalRevenue
          ? `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
          : 'N/A';

        // Fetch total governance votes (count)
        const votesResponse = await fetch('https://prices.curve.finance/v1/dao/proposals?pagination=1&page=1&status_filter=all&type_filter=all');
        const votesData = await votesResponse.json();
        const totalVotes = votesData?.count ?? 0;
        const formattedVotes = totalVotes.toLocaleString();

        setStats([
          {
            label: 'Total Value Locked',
            value: mockData.tvl,
            description: 'Total value locked in Curve protocols',
          },
          {
            label: 'Total Revenue Generated',
            value: formattedRevenue,
            description: 'Real yield paid out to token holders',
          },
          {
            label: 'Total Governance Votes',
            value: formattedVotes,
            description: 'Total number of governance votes',
          },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className={styles.stats}>
      <div className="container">
        <div className="row">
          {stats.map((stat, idx) => (
            <div key={idx} className="col col--4">
              <Stat {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 