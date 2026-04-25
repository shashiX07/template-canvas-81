import { FileText, Download, DollarSign, Star, TrendingUp, Clock, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FreelancerProfile, freelancerTemplateStorage, earningsStorage } from '@/lib/storage';
import { formatCurrency } from '@/lib/freelancerUtils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FreelancerOverviewProps {
  profile: FreelancerProfile;
}

export default function FreelancerOverview({ profile }: FreelancerOverviewProps) {
  const navigate = useNavigate();
  const templates = freelancerTemplateStorage.getByFreelancerId(profile.userId);
  const earnings = earningsStorage.getByFreelancerId(profile.userId);
  const availableBalance = earningsStorage.getAvailableBalance(profile.userId);

  const stats = [
    { no: '01', label: 'Templates', value: String(profile.totalTemplates), sub: 'Published in the studio', icon: FileText },
    { no: '02', label: 'Downloads', value: profile.totalDownloads.toLocaleString(), sub: 'All-time installs', icon: Download },
    { no: '03', label: 'Earnings', value: formatCurrency(profile.totalEarnings), sub: 'Lifetime, before payouts', icon: DollarSign },
    { no: '04', label: 'Rating', value: profile.rating.toFixed(1), sub: 'Average across reviews', icon: Star },
  ];

  const recentTemplates = templates.slice(0, 5);

  const statusTone = (s: string) => {
    if (s === 'published') return 'border-success/40 bg-success/10 text-success';
    if (s === 'approved') return 'border-primary/40 bg-primary/10 text-primary';
    if (s === 'under_review') return 'border-warning/40 bg-warning/10 text-warning';
    return 'border-foreground/20 bg-muted text-foreground/60';
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative space-y-10">
        {/* Editorial header */}
        <header>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70">
              The studio · Welcome back
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
            Hello, <span className="italic">{(user?.name || profile.professionalTitle || 'maker').split(' ')[0]}</span>.
          </h1>
          <p className="mt-5 max-w-xl text-foreground/65 text-lg leading-[1.7]">
            Your work, your numbers, your next move — all on one quiet page.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={() => navigate('/freelancer/dashboard/templates')}
              size="lg"
              className="group"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload a template
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/freelancer/dashboard/monetization')}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Available · {formatCurrency(availableBalance)}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/freelancer/dashboard/monetization')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View analytics
            </Button>
          </div>
        </header>

        {/* Status banners — editorial */}
        {profile.verificationStatus === 'pending' && (
          <div className="border-l-2 border-warning bg-warning/5 px-5 py-4 rounded-r-lg flex items-start gap-3">
            <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60 mb-1">
                Note · Application
              </div>
              <p className="text-sm text-foreground">
                Your application is being read. Expect a reply within 2–3 business days.
              </p>
            </div>
          </div>
        )}

        {profile.verificationStatus === 'rejected' && (
          <div className="border-l-2 border-destructive bg-destructive/5 px-5 py-4 rounded-r-lg">
            <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-destructive mb-1">
              Note · Resubmit
            </div>
            <p className="text-sm text-foreground mb-3">
              {profile.verificationNotes || 'Your application was not approved. Please contact support.'}
            </p>
            <Button variant="outline" size="sm">Resubmit application</Button>
          </div>
        )}

        {/* Stats */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-px bg-foreground" />
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                  Numbers · This week
                </span>
              </div>
              <h2 className="font-display text-3xl font-light tracking-tight">
                The <span className="italic">snapshot</span>.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.no}
                className="group relative border border-foreground/10 rounded-2xl p-6 bg-background hover:border-foreground/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    №{stat.no} · {stat.label}
                  </span>
                  <stat.icon className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
                <div className="font-display text-5xl font-light tracking-tight leading-none">
                  {stat.value}
                </div>
                <p className="mt-3 text-xs text-foreground/55 leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Two columns: templates + earnings */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent templates */}
          <div className="border border-foreground/10 rounded-2xl bg-background overflow-hidden">
            <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
              <div>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                  Chapter 03 · Templates
                </span>
                <h3 className="font-display text-2xl font-light mt-1">
                  Your <span className="italic">work</span>.
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/freelancer/dashboard/templates')}>
                See all <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </div>

            {recentTemplates.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <FileText className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
                <h4 className="font-display text-xl font-light">
                  Nothing <span className="italic">here yet</span>
                </h4>
                <p className="text-sm text-foreground/55 mt-1 mb-5">
                  Upload your first template to get started.
                </p>
                <Button size="sm" onClick={() => navigate('/freelancer/dashboard/templates')}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Upload
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-foreground/10">
                {recentTemplates.map((template, i) => (
                  <div key={template.id} className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 w-6 shrink-0">
                        №{String(i + 1).padStart(2, '0')}
                      </span>
                      <img
                        src={template.thumbnail}
                        alt={template.title}
                        className="w-12 h-12 rounded-lg object-cover ring-1 ring-foreground/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{template.title}</p>
                        <p className="text-xs text-foreground/55">
                          {template.downloads} downloads
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "font-mono-accent text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border shrink-0",
                      statusTone(template.submissionStatus),
                    )}>
                      {template.submissionStatus.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent earnings */}
          <div className="border border-foreground/10 rounded-2xl bg-background overflow-hidden">
            <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
              <div>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                  Chapter 04 · Earnings
                </span>
                <h3 className="font-display text-2xl font-light mt-1">
                  Recent <span className="italic">income</span>.
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/freelancer/dashboard/monetization')}>
                See all <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </div>

            {earnings.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <DollarSign className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
                <h4 className="font-display text-xl font-light">
                  No <span className="italic">earnings</span> yet
                </h4>
                <p className="text-sm text-foreground/55 mt-1">
                  Income arrives once your templates start selling.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-foreground/10">
                {earnings.slice(0, 5).map((earning, i) => (
                  <div key={earning.id} className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 w-6 shrink-0">
                        №{String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{earning.description}</p>
                        <p className="text-xs text-foreground/55">
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-xl font-light text-success">
                        +{formatCurrency(earning.amount)}
                      </p>
                      <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                        {earning.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quote */}
        <div className="border-l-2 border-foreground/20 pl-5 py-3 max-w-xl">
          <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-2">
            From the editor's desk
          </div>
          <p className="font-display italic text-xl leading-snug text-foreground">
            "Make one quiet thing today. The studio rewards repetition."
          </p>
        </div>
      </div>
    </div>
  );
}
