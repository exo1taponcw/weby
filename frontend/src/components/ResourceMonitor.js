import React, { useState, useEffect } from 'react';
import { Activity, HardDrive, Cpu, Wifi, Clock, CheckCircle } from 'lucide-react';
import { mockServerStats, realtimeMetrics, statusData } from '../data/mock';

const ResourceMonitor = () => {
  const [currentStats, setCurrentStats] = useState(mockServerStats);
  const [metrics] = useState(realtimeMetrics);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(20, Math.min(80, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(25, Math.min(70, prev.memory.percentage + (Math.random() - 0.5) * 5))
        },
        network: {
          ...prev.network,
          inbound: Math.max(500, Math.min(3000, prev.network.inbound + (Math.random() - 0.5) * 200)),
          outbound: Math.max(300, Math.min(2000, prev.network.outbound + (Math.random() - 0.5) * 150))
        }
      }));
      setCurrentTime(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'outage': return 'text-red-400';
      default: return 'text-[var(--text-muted)]';
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <section id="status" className="py-20 bg-black">
      <div className="dark-container">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="display-large mb-6">
              Live <span className="text-[var(--brand-primary)]">Performance</span> Monitor
            </h2>
            <p className="body-large text-[var(--text-secondary)] max-w-3xl mx-auto">
              Real-time insights into our infrastructure performance. Monitor system health, 
              resource usage, and service status in real-time.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Real-time System Stats */}
            <div className="space-y-6">
              <h3 className="heading-2 mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-[var(--brand-primary)]" />
                System Performance
              </h3>

              {/* CPU Usage */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-[var(--brand-primary)]" />
                    <span className="heading-3">CPU Usage</span>
                  </div>
                  <span className="body-large font-semibold text-[var(--brand-primary)]">
                    {currentStats.cpu.usage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${getUsageColor(currentStats.cpu.usage)}`}
                    style={{ width: `${currentStats.cpu.usage}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  {currentStats.cpu.cores} cores @ {currentStats.cpu.frequency}
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-5 h-5 text-[var(--brand-primary)]" />
                    <span className="heading-3">Memory Usage</span>
                  </div>
                  <span className="body-large font-semibold text-[var(--brand-primary)]">
                    {currentStats.memory.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${getUsageColor(currentStats.memory.percentage)}`}
                    style={{ width: `${currentStats.memory.percentage}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-[var(--text-muted)]">
                  {currentStats.memory.used} GB / {currentStats.memory.total} GB
                </div>
              </div>

              {/* Network Activity */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wifi className="w-5 h-5 text-[var(--brand-primary)]" />
                  <span className="heading-3">Network Activity</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">Inbound</div>
                    <div className="body-large font-semibold text-green-400">
                      {currentStats.network.inbound.toFixed(0)} KB/s
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--text-muted)]">Outbound</div>
                    <div className="body-large font-semibold text-blue-400">
                      {currentStats.network.outbound.toFixed(0)} KB/s
                    </div>
                  </div>
                </div>
              </div>

              {/* Uptime */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-[var(--brand-primary)]" />
                  <span className="heading-3">System Uptime</span>
                </div>
                <div className="body-large font-semibold text-[var(--brand-primary)]">
                  {currentStats.uptime}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  Last updated: {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="space-y-6">
              <h3 className="heading-2 mb-6 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-[var(--brand-primary)]" />
                Service Status
              </h3>

              {/* Overall Status */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="heading-3">Overall Status</span>
                  <span className={`body-large font-semibold capitalize ${getStatusColor(statusData.overall)}`}>
                    {statusData.overall}
                  </span>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  All systems are running smoothly
                </div>
              </div>

              {/* Individual Services */}
              <div className="space-y-4">
                {statusData.services.map((service, index) => (
                  <div key={index} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="body-large font-semibold">{service.name}</span>
                      <span className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      Uptime: {service.uptime}
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Chart Placeholder */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <h4 className="heading-3 mb-4">Performance Trends</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-[var(--brand-primary)] transition-all duration-1000"
                        style={{ height: `${metric.cpu}%` }}
                      ></div>
                      <div className="text-xs text-[var(--text-muted)] mt-2">
                        {metric.time}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-4">
                  CPU usage over the last 30 minutes
                </div>
              </div>

              {/* Discord Status Integration */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--brand-primary)] p-6">
                <h4 className="heading-3 mb-4 text-[var(--brand-primary)]">
                  Live Support Available
                </h4>
                <p className="body-medium text-[var(--text-secondary)] mb-4">
                  Our technical team is online and ready to help with any questions or issues.
                </p>
                <a 
                  href="https://loyalhood.xyz/discord" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  Join Discord for Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceMonitor;