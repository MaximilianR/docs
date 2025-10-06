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
    label: 'Fees Distributed to veCRV',
    value: 'Loading...',
    description: 'Total protocol fees paid to veCRV holders',
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
        const formatCompact = (num: number): string => {
          const abs = Math.abs(num);
          if (abs >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
          if (abs >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
          if (abs >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
          if (abs >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
          return `${Math.round(num).toLocaleString()}`;
        };
        // Fetch latest TVL from DefiLlama
        const tvlResponse = await fetch('https://api.llama.fi/tvl/curve-finance');
        const tvlRaw = await tvlResponse.json();
        const tvlNumber = typeof tvlRaw === 'number' ? tvlRaw : (tvlRaw?.tvl ?? tvlRaw?.value ?? 0);
        const formattedTvl = tvlNumber ? `$${formatCompact(tvlNumber)}` : 'N/A';

        // Fetch cumulative fees distributed to veCRV from Curve API
        const revenueResponse = await fetch('https://api.curve.finance/api/getWeeklyFees');
        const revenueData = await revenueResponse.json();
        const totalRevenue = revenueData?.data?.totalFees?.fees ?? 0;
        const formattedRevenue = totalRevenue
          ? `${formatCompact(totalRevenue)}`
          : 'N/A';

        // Fetch total governance votes (count)
        const votesResponse = await fetch('https://prices.curve.finance/v1/dao/proposals?pagination=1&page=1&status_filter=all&type_filter=all');
        const votesData = await votesResponse.json();
        const totalVotes = votesData?.count ?? 0;
        const formattedVotes = totalVotes.toLocaleString();

        setStats([
          {
            label: 'Total Value Locked',
            value: formattedTvl,
            description: 'Total value locked in Curve protocols',
          },
          {
            label: 'Fees Distributed to veCRV',
            value: formattedRevenue ? `$${formattedRevenue}` : 'N/A',
            description: 'Total protocol fees paid to veCRV holders',
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
        <div className="row guide-card-row">
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