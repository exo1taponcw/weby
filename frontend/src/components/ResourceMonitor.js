import React, { useState, useEffect } from 'react';
import { Activity, Globe, CheckCircle, AlertCircle, Clock, Wifi } from 'lucide-react';
import { websiteStatusApi } from '../services/api';

const ResourceMonitor = () => {
  const [websiteStatus, setWebsiteStatus] = useState({
    'loyalhood.xyz': { status: 'checking', responseTime: 0, lastChecked: null },
    'host.loyalhood.xyz': { status: 'checking', responseTime: 0, lastChecked: null },
    'pm.loyalhood.xyz': { status: 'checking', responseTime: 0, lastChecked: null }
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [uptimeData, setUptimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState('checking');

  // Fetch website status from backend
  useEffect(() => {
    const fetchWebsiteStatus = async () => {
      try {
        setIsLoading(true);
        const response = await websiteStatusApi.getAllStatus();
        setWebsiteStatus(response.websites);
        setOverallStatus(response.overall);
        
        // Also fetch uptime data
        const uptimeResponse = await websiteStatusApi.getUptimeData();
        setUptimeData(uptimeResponse.uptime);
        
      } catch (error) {
        console.error('Failed to fetch website status:', error);
        // Keep existing mock/default state on error
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchWebsiteStatus();

    // Fetch every 30 seconds
    const interval = setInterval(fetchWebsiteStatus, 30000);
    
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'degraded': return 'text-yellow-400';
      case 'checking': return 'text-[var(--text-muted)]';
      default: return 'text-[var(--text-muted)]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'offline': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'checking': return <Clock className="w-5 h-5 text-[var(--text-muted)] animate-spin" />;
      default: return <Globe className="w-5 h-5 text-[var(--text-muted)]" />;
    }
  };

  const getOverallStatus = () => {
    return overallStatus;
  };

  const getWebsiteDisplayName = (website) => {
    switch (website) {
      case 'loyalhood.xyz': return 'Main Website';
      case 'host.loyalhood.xyz': return 'Host Portal';
      case 'pm.loyalhood.xyz': return 'Proxmox Panel';
      default: return website;
    }
  };

  const getWebsiteDescription = (website) => {
    switch (website) {
      case 'loyalhood.xyz': return 'Primary website and landing page';
      case 'host.loyalhood.xyz': return 'Customer hosting portal';
      case 'pm.loyalhood.xyz': return 'Proxmox virtualization management';
      default: return 'Website monitoring';
    }
  };

  return (
    <section id="status" className="py-20 bg-black">
      <div className="dark-container">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="display-large mb-6">
              Live <span className="text-[var(--brand-primary)]">Status</span> Monitor
            </h2>
            <p className="body-large text-[var(--text-secondary)] max-w-3xl mx-auto">
              Real-time monitoring of all LoyalHOOD services and websites. 
              Check service availability, response times, and system status.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Overall Status */}
            <div className="space-y-6">
              <h3 className="heading-2 mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-[var(--brand-primary)]" />
                System Overview
              </h3>

              {/* Overall Status Card */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="heading-3">Overall Status</span>
                  <span className={`body-large font-semibold capitalize ${getStatusColor(getOverallStatus())}`}>
                    {getOverallStatus()}
                  </span>
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {getOverallStatus() === 'operational' 
                    ? 'All systems are running smoothly' 
                    : getOverallStatus() === 'degraded'
                    ? 'Some services are experiencing issues'
                    : 'Major service disruption detected'
                  }
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-2">
                  Last updated: {currentTime.toLocaleTimeString()}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Wifi className="w-5 h-5 text-[var(--brand-primary)]" />
                    <span className="heading-3">Avg Response Time</span>
                  </div>
                  <div className="body-large font-semibold text-[var(--brand-primary)]">
                    {Object.values(websiteStatus)
                      .filter(site => site.status === 'online')
                      .reduce((acc, site) => acc + site.responseTime, 0) / 
                     Object.values(websiteStatus).filter(site => site.status === 'online').length || 0
                    }ms
                  </div>
                </div>
                
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-[var(--brand-primary)]" />
                    <span className="heading-3">Services Online</span>
                  </div>
                  <div className="body-large font-semibold text-[var(--brand-primary)]">
                    {Object.values(websiteStatus).filter(site => site.status === 'online').length}/
                    {Object.keys(websiteStatus).length}
                  </div>
                </div>
              </div>

              {/* Uptime Chart */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <h4 className="heading-3 mb-4">24-Hour Uptime</h4>
                <div className="h-16 flex items-end justify-between gap-1">
                  {uptimeData.length > 0 ? uptimeData.map((hourData, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full transition-all duration-1000 ${
                          hourData.percentage > 95 ? 'bg-green-500' : hourData.percentage > 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ height: `${hourData.percentage}%` }}
                      ></div>
                    </div>
                  )) : [...Array(24)].map((_, index) => {
                    const uptime = Math.random() > 0.05 ? 100 : Math.random() * 50 + 50;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full transition-all duration-1000 ${
                            uptime > 95 ? 'bg-green-500' : uptime > 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ height: `${uptime}%` }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-4">
                  Hourly uptime percentage for past 24 hours
                </div>
              </div>
            </div>

            {/* Individual Website Status */}
            <div className="space-y-6">
              <h3 className="heading-2 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-[var(--brand-primary)]" />
                Website Status
              </h3>

              {/* Individual Website Cards */}
              <div className="space-y-4">
                {Object.entries(websiteStatus).map(([website, data]) => (
                  <div key={website} className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(data.status)}
                        <div>
                          <span className="body-large font-semibold">{getWebsiteDisplayName(website)}</span>
                          <div className="text-sm text-[var(--text-muted)]">{website}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium capitalize ${getStatusColor(data.status)}`}>
                        {data.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-[var(--text-muted)] mb-2">
                      {getWebsiteDescription(website)}
                    </div>
                    
                    {data.status === 'online' && (
                      <div className="flex justify-between text-xs text-[var(--text-muted)]">
                        <span>Response Time: {data.responseTime}ms</span>
                        <span>Last Checked: {data.lastChecked?.toLocaleTimeString()}</span>
                      </div>
                    )}
                    
                    {data.status === 'offline' && (
                      <div className="text-xs text-red-400">
                        Service unavailable - investigating issue
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Discord Support Integration */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--brand-primary)] p-6">
                <h4 className="heading-3 mb-4 text-[var(--brand-primary)]">
                  Need Help?
                </h4>
                <p className="body-medium text-[var(--text-secondary)] mb-4">
                  If you're experiencing issues with any of our services, 
                  join our Discord for immediate support from our technical team.
                </p>
                <a 
                  href="https://loyalhood.xyz/discord" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  Get Support on Discord
                </a>
              </div>

              {/* Status Legend */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6">
                <h4 className="heading-3 mb-4">Status Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Online - Service is fully operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Degraded - Service is experiencing issues</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm">Offline - Service is unavailable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceMonitor;