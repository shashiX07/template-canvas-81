import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Download, DollarSign, Star, Eye, Edit, Trash2 } from 'lucide-react';
import { freelancerTemplateStorage } from '@/lib/storage';
import type { FreelancerTemplate } from '@/lib/storage';
import { getStatusColor, formatCurrency } from '@/lib/freelancerUtils';

interface FreelancerTemplatesProps {
  freelancerId: string;
}

export default function FreelancerTemplates({ freelancerId }: FreelancerTemplatesProps) {
  const [templates, setTemplates] = useState<FreelancerTemplate[]>(
    freelancerTemplateStorage.getByFreelancerId(freelancerId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || template.submissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Templates</h1>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Upload New Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Upload your first template to get started'}
          </p>
          <Button>Upload New Template</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <Badge
                  className={`absolute top-3 right-3 capitalize border-0 ${getStatusColor(template.submissionStatus)}`}
                >
                  {template.submissionStatus.replace('_', ' ')}
                </Badge>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {template.description}
                </p>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-border">
                  <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                      {template.downloads}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">Downloads</span>
                  </div>
                  <div className="flex flex-col items-center text-center border-x border-border">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                      <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatCurrency(template.earnings)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">Earned</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      {template.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">Rating</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  {template.submissionStatus === 'draft' && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
